const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

// PUBLIC READ ENDPOINTS
router.get("/", getAllBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);

// PROTECTED WRITE ENDPOINTS (Admin Authorization Required)
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
