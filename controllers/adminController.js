const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

// LOGIN (simple)
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE username=?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        const user = result[0];
        
        // Check if stored password is a bcrypt hash
        const isBcrypt = user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$"));
        let isMatch = false;

        try {
          if (isBcrypt) {
            isMatch = await bcrypt.compare(password, user.password);
          } else {
            isMatch = (password === user.password);
          }
        } catch (compareErr) {
          return res.status(500).json({ message: "Error verifying password" });
        }

        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || "fallback_secret",
            { expiresIn: "1d" }
          );
          res.json({ message: "Login success", user: { id: user.id, username: user.username }, token });
        } else {
          res.status(401).json({ message: "Invalid login" });
        }
      } else {
        res.status(401).json({ message: "Invalid login" });
      }
    }
  );
};

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO admins (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Admin created successfully", adminId: result.insertId });
      }
    );
  } catch (hashErr) {
    return res.status(500).json({ message: "Error encrypting password" });
  }
};

// GET ALL ADMINS
exports.getAllAdmins = (req, res) => {
  db.query("SELECT id, username FROM admins ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
