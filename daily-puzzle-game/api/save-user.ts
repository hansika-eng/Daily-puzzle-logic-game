import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, score } = req.body;

  if (!email || score === undefined) {
    return res.status(400).json({ message: "Missing email or score" });
  }

  try {
    await pool.query(
      "INSERT INTO scores (user_email, score) VALUES ($1, $2)",
      [email, score]
    );

    return res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    console.error("DB ERROR:", error);
    return res.status(500).json({ message: "Database error" });
  }
}
