var express = require("express");
var router = express.Router();

// GET /news
router.get("/", (req, res) => {
  res.render("news");
});

// GET /news/:slug
router.get("/:slug", (req, res) => {
  res.send(`News detail: ${req.params.slug}`);
});

module.exports = router;
