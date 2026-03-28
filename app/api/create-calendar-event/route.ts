import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/google-callback`
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });

    const summary = `${body.customer_name} - ${body.service_description || "Cleaning Job"}`;

    const description = [
      body.phone ? `Phone: ${body.phone}` : "",
      body.address ? `Address: ${body.address}` : "",
      body.price ? `Price: $${body.price}` : "",
      body.status ? `Status: ${body.status}` : ""
    ]
      .filter(Boolean)
      .join("\n");

    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary,
        location: body.address || undefined,
        description,
        start: {
          dateTime: body.start_at
        },
        end: {
          dateTime: body.end_at
        }
      }
    });

    return Response.json({
      success: true,
      eventId: event.data.id,
      htmlLink: event.data.htmlLink
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
