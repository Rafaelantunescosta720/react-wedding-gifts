// auth.js
import { google } from "googleapis";

export async function authenticateGoogleSheets(scope="") {
  const auth = await google.auth.getClient({
    scopes: [`https://www.googleapis.com/auth/spreadsheets${scope}`],
    credentials: {
      private_key: process.env.GAC_PVT_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GAC_CLIENT_EMAIL,
    },
  });

  return google.sheets({ version: "v4", auth });
}
