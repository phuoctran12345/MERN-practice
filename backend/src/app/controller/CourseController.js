const { mongooseToObject } = require("../../until/mongoose");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
class CourseController {
  // GET /courses
  async index(req, res, next) {
    try {
      const courses = await Course.find({}).lean();
      res.render("home", { courses });
    } catch (err) {
      next(err);
    }
  }

  // GET /courses/:slugOrId
  async show(req, res, next) {
    try {
      const key = String(req.params.slug || "");
      const isObjectId = mongoose.Types.ObjectId.isValid(key);
      const course = await Course.findOne(
        isObjectId ? { _id: key } : { slug: key },
      ).lean();
      if (!course)
        return res.status(404).render("courses/show", { notFound: true });
      return res.render("courses/show", { course });
    } catch (err) {
      next(err);
    }
  }

  // GET /courses/create
  create(req, res, next) {
    res.render("courses/create");
  }

  // POST /courses/store
  store(req, res, next) {
    // res.json(req.body);

    const formData = { ...req.body };

    // Lấy videoId, chấp nhận cả vidieoId cũ
    const videoId = formData.videoId || formData.vidieoId;

    // Tạo slug thủ công từ name (nếu bạn đang bỏ plugin)
    formData.slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Ảnh thumbnail từ YouTube
    if (videoId && !formData.image) {
      formData.image = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
    }

    const course = new Course(formData);
    course
      .save()
      .then(() => res.redirect("/me/stored/courses"))
      .catch((error) => {
        console.log("[ERROR] !!!!!!!!!!!!!!!!!!!!!!!");
      });
  }

  // [GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) =>
        res.render("courses/edit", {
          course: mongooseToObject(course),
        }),
      )
      .catch(next);
  }

  // [PUT] /courses/:id
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect("/me/stored/courses"))
      .catch(next);
  }
  // [DELETE] /courses/:id
  destroy(req, res, next) {
    // xoá thiệt k phải là soft delete 
    // Course.deleteOne({ _id: req.params.id }, req.body)           //Chỗ ni hắn sẽ chọc vào database với modal là Course               ||Propotype sẽ là những cái ô màu xanh || Function sẽ là những cái ô màu tím
    //   .then(() => res.redirect("back"))                          // Trả về location
    //   .catch(next);

    Course.delete({ _id: req.params.id }, req.body)                 //Chỗ ni hắn sẽ chọc vào database với modal là Course               ||Propotype sẽ là những cái ô màu xanh || Function sẽ là những cái ô màu tím
    .then(() => res.redirect("back"))                               // Trả về location
    .catch(next);
  }

  // [DELETE] /courses/:id/force                                    // xóa thiệt
  forceDestroy(req, res, next) {
    // xoá thiệt k phải là soft delete 
    // Course.deleteOne({ _id: req.params.id }, req.body)           //Chỗ ni hắn sẽ chọc vào database với modal là Course               ||Propotype sẽ là những cái ô màu xanh || Function sẽ là những cái ô màu tím
    //   .then(() => res.redirect("back"))                          // Trả về location
    //   .catch(next);

    Course.deleteOne({ _id: req.params.id }, req.body)                 
    .then(() => res.redirect("back"))                               
    .catch(next);
  }


   // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.restore ({ _id: req.params.id }, req.body)               //Chỗ ni hắn sẽ chọc vào database với modal là Course               ||Propotype sẽ là những cái ô màu xanh || Function sẽ là những cái ô màu tím
    .then(() => res.redirect("back"))                               // Trả về location
    .catch(next);
  }


}

module.exports = new CourseController();

