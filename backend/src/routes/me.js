var express = require("express");
var router = express.Router();

const meController = require("../app/controller/MeController");

// GET /courses
// router.get('/', meController.index);

// Log để debug
console.log("meController:", typeof meController.storedCourses);

// [GET] /me/stored/courses
router.get("/stored/courses", meController.storedCourses);
// router.get('/stored/courses', (req, res) => {
//     res.send('Test me route');
// });


// [GET] /me/stored/courses
router.get("/trash/courses", meController.trashCourses);

module.exports = router;
