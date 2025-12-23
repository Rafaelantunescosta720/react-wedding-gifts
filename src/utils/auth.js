import { google } from "googleapis";

export async function authenticateGoogleSheets(scope = "") {
  // Suporta dois nomes de variáveis comuns para compatibilidade
  const clientEmail =
    process.env.GAC_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GAC_PVT_KEY || process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail) {
    throw new Error(
      "Missing env: GAC_CLIENT_EMAIL or GOOGLE_SERVICE_ACCOUNT_EMAIL"
    );
  }
  if (!privateKey) {
    throw new Error("Missing env: GAC_PVT_KEY or GOOGLE_PRIVATE_KEY");
  }

  // Remove aspas externas (se alguém as colocou por engano)
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  // Converte sequências literais \n em quebras de linha reais e remove CRs
  privateKey = privateKey.replace(/\\n/g, "\n").replace(/\r/g, "");

  const jwtClient = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [`https://www.googleapis.com/auth/spreadsheets${scope}`],
  });

  // Autoriza para garantir que as credenciais são válidas (lança erro se não)
  await jwtClient.authorize();

  return google.sheets({ version: "v4", auth: jwtClient });
}
