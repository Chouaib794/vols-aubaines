import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  // Simule une réponse OK après 300ms (test local)
  setTimeout(() => res.status(200).json({ ok: true }), 300);
}
