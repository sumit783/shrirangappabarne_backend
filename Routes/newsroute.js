const express = require("express");
const router = express.Router();
const {getAllNews,getNewsById,createNews,updateNews,deleteNews} = require("../controllers/newsController");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL NEWS
router.get("/", getAllNews);

// GET BY ID
router.get("/:id", getNewsById);

// INSERT NEWS
router.post("/", authMiddleware, createNews);

// UPDATE NEWS
router.put("/:id", authMiddleware, updateNews);

// DELETE NEWS
router.delete("/:id", authMiddleware, deleteNews);

module.exports = router;