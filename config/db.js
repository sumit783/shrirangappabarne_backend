const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Resort@123",        // 👉 put your MySQL password here (XAMPP = usually empty)
  database: "website_news",
  port: 3306
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully!");
  }
});

module.exports = db;