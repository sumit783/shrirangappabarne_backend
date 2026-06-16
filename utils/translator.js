const translationCache = new Map();

async function translateText(text, targetLang) {
  if (!text || !targetLang) return text;
  
  // Normalize targetLang to lowercase 2-letter code
  const target = targetLang.toLowerCase().substring(0, 2);
  
  // Validate target language code (must be 2 letters, not "au" for auto)
  if (!/^[a-z]{2}$/.test(target) || target === "au") {
    return text;
  }
  
  // Detect source language based on presence of Devanagari characters (Marathi)
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const source = hasDevanagari ? "mr" : "en";
  
  if (source === target) return text;
  
  const cacheKey = `${source}|${target}|${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      translationCache.set(cacheKey, translated);
      return translated;
    }
  } catch (error) {
    console.error(`Translation failed for text "${text.substring(0, 20)}...":`, error.message);
  }
  
  return text; // Fallback to original text on failure
}

function getTargetLanguage(req) {
  if (req.query && req.query.lang) {
    return req.query.lang;
  }
  const acceptLang = req.headers['accept-language'];
  if (acceptLang) {
    const match = acceptLang.split(",")[0].split(";")[0].trim();
    if (match) return match;
  }
  return null;
}

module.exports = {
  translateText,
  getTargetLanguage
};
