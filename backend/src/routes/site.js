var express = require("express");
var router = express.Router();
const Course = require("../app/models/Course");

// Trang chủ
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({}).lean();
    res.render("home", { courses });
  } catch (err) {
    res.status(500).send("Lỗi tải khóa học");
  }
});

// Tìm kiếm (GET): nhận từ khoá qua query string ?q=
router.get("/search", (req, res) => {
  const keyword = typeof req.query.q === "string" ? req.query.q : "";
  res.render("search", { q: keyword });
});

// Tìm kiếm (POST): nhận dữ liệu form body
router.post("/search", (req, res) => {
  const keyword = typeof req.body.q === "string" ? req.body.q : "";
  res.render("search", { q: keyword });
});

module.exports = router;
