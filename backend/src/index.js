var path = require("path");
const express = require("express");
const morgan = require("morgan"); // lấy ra từ thư mục node module -> trả về đối tượng app
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const app = express(); //
const port = 3000; // cổng nào

const route = require("./routes");
const db = require("./config/db");

// Kết nối DB
db.connect();

// Static assets từ src/public
app.use(express.static(path.join(__dirname, "public")));

app.use(
  express.urlencoded({
    extended: true,
  }),
); // xử lý dữ liệu được gửi từ cái form gửi lên cho chúng ta thông qua METHOD và action
app.use(express.json());

// ê chú ý chỗ ni mai ni hắn còn có XMLHttpRequest (JSP/Servlet) , fetch , axios , ajax

app.use(methodOverride("_method")); // middeleware

// HTTP loger
app.use(morgan("combined"));

// Cấu hình Handlebars (.hbs)
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
    },
  }),
);

app.set("view engine", "hbs"); // view engine bằng handle bars
app.set("views", path.join(__dirname, "resources", "views"));

console.log(path.join(__dirname, "resources", "views"));

// Routes init (chỉ gọi 1 lần)
route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
