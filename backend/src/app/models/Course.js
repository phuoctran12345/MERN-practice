const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const mongooseDelete = require("mongoose-delete");
const { Schema } = mongoose;

mongoose.plugin(slug);
const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String },
    level: { type: String },
    slug: { type: String, unique: true },
    //chỗ ni bên dependences sẽ có sinh ra slugId ở phía đằng sau slug
    // ví dụ hello-word sau khi thêm zo trong mongooseDB với api trùng các trường nhập liệu thì sẽ thành -> hello-word-dcoool_sCn
  },
  { timestamps: true }
);

// Add plugins
CourseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
}); // mongooose delete - search ở đây // ở đây giống như overriding bên java

module.exports = mongoose.model("Course", CourseSchema, "courses");
