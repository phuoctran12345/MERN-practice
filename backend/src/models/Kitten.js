const mongoose = require("mongoose");

// shape data
const kittySchema = new mongoose.Schema({
  // đoạn code ni sẽ có  lợi ích -> định dạng hình thù data
  name: String,
});

const Kitten = mongoose.model("Kitten", kittySchema); //model("Kitten", định nghĩa tên của collection
const cat = new Kitten({ name: "m3p" });
cat.save();

module.exports = Kitten;
