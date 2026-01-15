console.log("### BACKEND SERVER STARTING ###");

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());

// ✅ DEFINE db ให้ชัดเจน
const db = mysql.createPool({
  host: "localhost",
  user: "app",          // user ที่เราสร้างไว้
  password: "app1234",
  database: "demo_ci"
});

app.get("/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({ status: "ok" });
  } catch {
    res.status(500).json({ status: "db_not_ready" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const [rows] = await db.query("CALL get_orders()");
    res.json(rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "database error" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});




