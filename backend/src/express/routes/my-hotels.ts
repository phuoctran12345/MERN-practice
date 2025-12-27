import express from "express";
import multer from "multer";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";
import * as myHotelsController from "../controllers/my-hotels.controller";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6), // ⚠️ Multer PHẢI chạy TRƯỚC validation để parse form-data
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type")
      .notEmpty()
      .withMessage("Select at least one hotel type"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .withMessage("Facilities are required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  myHotelsController.createHotel
);

router.get("/", verifyToken, myHotelsController.getMyHotels);

router.get("/:id", verifyToken, myHotelsController.getMyHotelById);

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  myHotelsController.updateMyHotel
);

export default router;
