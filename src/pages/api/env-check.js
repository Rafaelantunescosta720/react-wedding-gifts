export default function handler(req, res) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  res.status(200).json({
    hasClientEmail: !!clientEmail,
    clientEmail,
    hasPrivateKey: !!privateKey,
    privateKeyPreview:
      privateKey && privateKey.length > 40
        ? `${privateKey.slice(0,20)}...${privateKey.slice(-20)}`
        : privateKey,
    sheetId: process.env.SHEET_ID || null,
    sheetPage: process.env.SHEET_PAGE || null
  });
}
