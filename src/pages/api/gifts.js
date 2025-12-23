// pages/api/gifts.js
import { authenticateGoogleSheets } from "@/utils/auth";

export default async function handler(req, res) {
  try {
    const sheets = await authenticateGoogleSheets(".readonly");

    // use a env var server-only (não NEXT_PUBLIC_) e forneça fallback para debug
    const sheetPage =
      process.env.SHEET_PAGE || process.env.NEXT_PUBLIC_SHEET_PAGE || "Página1";
    const range = `${sheetPage}!A:H`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return res.status(200).json([]);

    const [header, ...giftsData] = rows;
    const apiGifts = giftsData.map((gift, index) => ({
      id: index + 2,
      imageSrc: gift[0],
      title: gift[1],
      status: gift[2],
      name: gift[3],
      phone: gift[4],
      paymentMethod: gift[5],
      message: gift[6],
      giftDate: gift[7],
    }));

    res.status(200).json(apiGifts);
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res
      .status(500)
      .json({ error: "Internal server error", detail: error.message });
  }
}
