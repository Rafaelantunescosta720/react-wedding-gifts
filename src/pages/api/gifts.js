// pages/api/gifts.js
import { authenticateGoogleSheets } from "@/utils/auth";

export default async function handler(req, res) {
  try {
    // Authentication with Google Sheets
    const sheets = await authenticateGoogleSheets(".readonly");

    const range = `${process.env.NEXT_PUBLIC_SHEET_PAGE}!A:H`;

    // Get data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    // Extract cell data
    const rows = response.data.values;

    if (rows) {
      // Remove the header
      const [header, ...giftsData] = rows;
      
      // Map the data to the format expected by the component
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
      
      // Return data as response
      res.status(200).json(apiGifts);
    }else{
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching spreadsheet data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
