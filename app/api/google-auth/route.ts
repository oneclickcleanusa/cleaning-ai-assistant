import { google } from "googleapis";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/google-callback`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    "",
    redirectUri
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"]
  });

  return Response.redirect(url);
}
