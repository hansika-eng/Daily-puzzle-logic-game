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

  try {
    await pool.query(
      "INSERT INTO scores (email, score) VALUES ($1, $2)",
      [email, score]
    );

    res.status(200).json({ message: "Score saved successfully" });
  } catch (error) {
    console.error("Save score error:", error);
    res.status(500).json({ error: "Database error" });
  }
}
