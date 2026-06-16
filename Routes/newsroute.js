const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL NEWS
router.get("/", (req, res) => {
  db.query("SELECT * FROM news", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// GET BY ID
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM news WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// INSERT NEWS
router.post("/", (req, res) => {
  const { title, description, image, news_date } = req.body;

  db.query(
    "INSERT INTO news (title, description, image, news_date) VALUES (?,?,?,?)",
    [title, description, image, news_date],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "News added", result });
    }
  );
});

// UPDATE NEWS
router.put("/:id", (req, res) => {
  const { title, description, image, news_date } = req.body;

  db.query(
    "UPDATE news SET title=?, description=?, image=?, news_date=? WHERE id=?",
    [title, description, image, news_date, req.params.id],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "Updated" });
    }
  );
});

// DELETE NEWS
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM news WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.json(err);
    res.json({ message: "Deleted" });
  });
});

module.exports = router;