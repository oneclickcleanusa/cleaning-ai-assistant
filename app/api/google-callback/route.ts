import { google } from "googleapis";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/google-callback`
  );

  const { tokens } = await oauth2Client.getToken(code!);

  return new Response(
    JSON.stringify(tokens),
    { headers: { "Content-Type": "application/json" } }
  );
}
