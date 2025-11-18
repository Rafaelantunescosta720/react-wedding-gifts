// src/pages/api/pix-payload.js
import { payload as buildPayload } from "pix-payload";

/**
 * Normaliza string: remove acentos, pega apenas caracteres imprimíveis,
 * converte para uppercase, remove caracteres inválidos e trunca.
 */
function normalize(text = "", maxLen) {
  // remove acentos
  const from = "ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝýÿŸ";
  const to = "AAAAAAaaaaaaCcEEEEeeeeIIIIiiiiNnOOOOOOooooooUUUUuuuuYyyY";
  let s = text
    .split("")
    .map((c, i) => {
      const idx = from.indexOf(c);
      return idx > -1 ? to[idx] : c;
    })
    .join("");

  // keep letters, numbers, space and basic punctuation
  s = s.replace(/[^0-9A-Za-z \-\.]/g, "");

  s = s.trim().toUpperCase();

  if (maxLen) s = s.slice(0, maxLen);

  return s;
}

export default function handler(req, res) {
  try {
    // prefira usar server-only env var (PIX_KEY) em vez de NEXT_PUBLIC_*
    const key = process.env.PIX_KEY || process.env.NEXT_PUBLIC_PIX_KEY;
    if (!key) {
      return res
        .status(400)
        .json({ error: "PIX key not configured (PIX_KEY)" });
    }

    const rawName =
      process.env.ACCOUNT_OWNER ||
      process.env.NEXT_PUBLIC_ACCOUNT_OWNER ||
      "RECEBEDOR";
    const rawCity =
      process.env.ACCOUNT_CITY ||
      process.env.NEXT_PUBLIC_ACCOUNT_CITY ||
      "VILA VELHA";

    // sanitize/truncate conforme spec EMV:
    // merchant name: max 25 chars
    // merchant city: max 15 chars
    const name = normalize(rawName, 25) || "RECEBEDOR";
    const city = normalize(rawCity, 15) || "VILA VELHA";

    // amount opcional (em reais), ex: /api/pix-payload?amount=50.00
    const amount = req.query.amount ? Number(req.query.amount) : undefined;

    // gerar txid curto: máximo 25 caracteres. Aqui usamos timestamp curto + random.
    // Exemplo: tx-<10 dígitos> (<=25)
    const txid =
      (req.query.txid && String(req.query.txid).slice(0, 25)) ||
      `tx${String(Date.now()).slice(-10)}`;

    const data = {
      key,
      name,
      city,
      ...(amount ? { amount } : {}),
      transactionId: txid,
    };

    const pixPayload = buildPayload(data); // string BR Code válida

    return res.status(200).json({ payload: pixPayload, txid, name, city });
  } catch (err) {
    console.error("pix-payload error:", err);
    return res.status(500).json({ error: err.message || "internal error" });
  }
}
