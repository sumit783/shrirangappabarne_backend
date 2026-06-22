const db = require("../db");
const { translateText, getTargetLanguage } = require("../utils/translator");

async function translateNewsItem(item, targetLang) {
  if (!targetLang) return item;
  try {
    const [title, category, description] = await Promise.all([
      translateText(item.title, targetLang),
      translateText(item.category, targetLang),
      translateText(item.description, targetLang)
    ]);
    return {
      ...item,
      title,
      category,
      description
    };
  } catch (err) {
    console.error("Error in translateNewsItem:", err.message);
    return item;
  }
}

// GET ALL NEWS
exports.getAllNews = (req, res) => {
  db.query("SELECT * FROM news", async (err, result) => {
    if (err) return res.json(err);
    
    const targetLang = getTargetLanguage(req);
    if (targetLang) {
      try {
        const translatedResult = await Promise.all(
          result.map(item => translateNewsItem(item, targetLang))
        );
        return res.json(translatedResult);
      } catch (transErr) {
        console.error("Error in parallel translation:", transErr.message);
      }
    }
    
    res.json(result);
  });
};

// GET BY ID
exports.getNewsById = (req, res) => {
  db.query("SELECT * FROM news WHERE id=?", [req.params.id], async (err, result) => {
    if (err) return res.json(err);
    if (result.length === 0) return res.json(result);
    
    const targetLang = getTargetLanguage(req);
    if (targetLang) {
      try {
        const translatedItem = await translateNewsItem(result[0], targetLang);
        return res.json([translatedItem]);
      } catch (transErr) {
        console.error("Error in single translation:", transErr.message);
      }
    }
    
    res.json(result);
  });
};

// INSERT NEWS
exports.createNews = (req, res) => {
  const { title, category, description, image, news_date } = req.body;

  db.query(
    "INSERT INTO news (title, category, description, image, news_date) VALUES (?,?,?,?,?)",
    [title, category || 'News', description, image, news_date],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "News added", result });
    }
  );
};

// UPDATE NEWS
exports.updateNews = (req, res) => {
  const { title, category, description, image, news_date } = req.body;

  db.query(
    "UPDATE news SET title=?, category=?, description=?, image=?, news_date=? WHERE id=?",
    [title, category || 'News', description, image, news_date, req.params.id],
    (err, result) => {
      if (err) return res.json(err);
      res.json({ message: "Updated" });
    }
  );
};

// DELETE NEWS
exports.deleteNews = (req, res) => {
  db.query("DELETE FROM news WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.json(err);
    res.json({ message: "Deleted" });
  });
};

// GET CATEGORIES (max 4 distinct from news table)
exports.getCategories = (req, res) => {
  db.query(
    "SELECT DISTINCT category FROM news WHERE category IS NOT NULL AND TRIM(category) != '' ORDER BY category ASC LIMIT 4",
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const targetLang = getTargetLanguage(req);
      const categories = result.map((r) => r.category);

      if (targetLang) {
        try {
          const translated = await Promise.all(
            categories.map((c) => translateText(c, targetLang))
          );
          return res.json({ categories: translated });
        } catch (transErr) {
          console.error("Error translating categories:", transErr.message);
        }
      }

      res.json({ categories });
    }
  );
};

// GET ALL NEWS BY CATEGORY (filtered, latest first)
// Usage: GET /news/by-category?category=Sports
// If no category provided, returns all news ordered latest first
exports.getNewsByCategory = (req, res) => {
  const { category } = req.query;

  let sql = "SELECT * FROM news";
  const params = [];

  if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const targetLang = getTargetLanguage(req);
    if (targetLang) {
      try {
        const translated = await Promise.all(
          result.map((item) => translateNewsItem(item, targetLang))
        );
        return res.json(translated);
      } catch (transErr) {
        console.error("Error translating news by category:", transErr.message);
      }
    }

    res.json(result);
  });
};

// GET TOP 3 NEWS BY CATEGORY (latest 3, useful for homepage sections)
// Usage: GET /news/by-category/top?category=Sports
// If no category provided, returns latest 3 across all categories
exports.getTopNewsByCategory = (req, res) => {
  const { category } = req.query;

  let sql = "SELECT * FROM news";
  const params = [];

  if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " ORDER BY id DESC LIMIT 3";

  db.query(sql, params, async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const targetLang = getTargetLanguage(req);
    if (targetLang) {
      try {
        const translated = await Promise.all(
          result.map((item) => translateNewsItem(item, targetLang))
        );
        return res.json(translated);
      } catch (transErr) {
        console.error("Error translating top news by category:", transErr.message);
      }
    }

    res.json(result);
  });
};


