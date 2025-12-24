const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { mutipleMongooseToObject } = require("../../until/mongoose");

const Course = require("../model/Courses");
class SiteController {
  // [GET]
  index(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.render("home", {
          courses: mutipleMongooseToObject(courses),
        }); // truyền cái biến course -> render lên trang home
      })
      .catch(next);
  }
}

module.exports = mongoose.module("Course", course);
module.exports = new SiteController();
