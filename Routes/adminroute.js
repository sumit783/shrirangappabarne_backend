const express = require("express");
const router = express.Router();
const { login, createAdmin, getAllAdmins } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// LOGIN (simple)
router.post("/login", login);

// GET ALL ADMINS
router.get("/", authMiddleware, getAllAdmins);

// CREATE ADMIN
router.post("/", authMiddleware, createAdmin);

module.exports = router;