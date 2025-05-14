const stylize = require('../fonts');

module.exports = (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.status(400).json({ error: "text is required" });

    const result = stylize(text);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in /fonts:", err);
    res.status(500).json({ error: "internal server error" });
  }
};
