const express = require("express");
const router = express.Router();
const db = require("../db");

// LOGIN (simple)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.json(err);

      if (result.length > 0) {
        res.json({ message: "Login success", user: result[0] });
      } else {
        res.status(401).json({ message: "Invalid login" });
      }
    }
  );
});

module.exports = router;