// Dùng CommonJS cho đồng bộ với phần còn lại của project
const fileUpload = require("express-fileupload");

app.use(fileUpload()); // call middleware

async function createKitten() {
  const silence = new Kitten({ name: "Mapape" });
  await silence.save(); // lưu xuống database
  console.log("Đã lưu 1 document  vào DB");
}

(async () => {
  try {

    // Using mongoDB driver
    // Connection URL 
    const url = process.env.DB_HOST_WITH_DRIVER;
    const client = new MongoClient(url);

    // Database Name
    const dbName = "HoiDant";


    
    await mongoose.connect("mongodb://localhost:27017/HoiDant");
    console.log("Connect DB success");
    createKitten();
  } catch (error) {
    console.log("Connect DB error", error);
  }
})();

module.exports = createKitten;

/*
giải thích về middleware 
req -> res

view -> routers ->(req) controller -> model -> database             || ở đây là trường hợp không có middleware

view -> routers ->req.files ->(req) controller -> model -> database || ở đây là middleware

*/
