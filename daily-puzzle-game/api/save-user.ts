import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       ON CONFLICT (email) DO NOTHING`,
      [name, email]
    );

    res.status(200).json({ message: "User saved" });
  } catch (error) {
    console.error("User save error:", error);
    res.status(500).json({ message: "Database error" });
  }
}
