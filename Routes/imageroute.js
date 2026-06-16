const express = require("express");
const router = express.Router();
const {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage
} = require("../controllers/imageController");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL IMAGES
router.get("/", getAllImages);

// GET BY ID
router.get("/:id", getImageById);

// INSERT IMAGE
router.post("/", authMiddleware, createImage);

// UPDATE IMAGE
router.put("/:id", authMiddleware, updateImage);

// DELETE IMAGE
router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;
