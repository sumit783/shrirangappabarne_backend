const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL POSTS
router.get("/", (req, res) => {
  db.query("SELECT * FROM posts", (err, result) => {
    if (err) return res.json(err);
    res.json(result);
  });
});

// ADD POST
router.post("/", (req, res) => {
  const { category, caption, image, post_date, url } = req.body;

  db.query(
    "INSERT INTO posts (category, caption, image, post_date, url) VALUES (?,?,?,?,?)",
    [category, caption, image, post_date, url],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "Post added" });
    }
  );
});

module.exports = router;