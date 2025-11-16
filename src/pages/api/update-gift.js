import { authenticateGoogleSheets } from "@/utils/auth";

export default async function handler(req, res) {
  try {
    const { id, name, phone, status, paymentMethod, message, giftDate } =
      req.body;

    const sheets = await authenticateGoogleSheets();

    const range = `${process.env.NEXT_PUBLIC_SHEET_PAGE}!C${id}:H${id}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID,
      range,
      valueInputOption: "RAW",
      resource: {
        values: [[status, name, phone, paymentMethod, message, giftDate]],
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar gift na planilha: " + error });
  }
}
