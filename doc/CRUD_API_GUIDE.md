# 📚 Hướng Dẫn Tạo CRUD API - Backend Express + TypeScript

## 🎯 Mục Lục

1. [Kiến Trúc Backend](#kiến-trúc-backend)
2. [Giới Thiệu CRUD và REST API](#giới-thiệu-crud-và-rest-api)
3. [Cấu Trúc Dự Án Backend](#cấu-trúc-dự-án-backend)
4. [Các Thành Phần Cần Thiết](#các-thành-phần-cần-thiết)
5. [Hướng Dẫn Tạo API CRUD Từng Bước](#hướng-dẫn-tạo-api-crud-từng-bước)
6. [Ví Dụ Thực Tế Từ Code](#ví-dụ-thực-tế-từ-code)
7. [Best Practices](#best-practices)

---

## 🏗️ Kiến Trúc Backend

### **Layered Architecture (3-Tier Architecture)**

Dự án của bạn sử dụng **kiến trúc phân tầng (Layered Architecture)**, đây là kiến trúc phổ biến và dễ maintain cho backend Express.

```
┌─────────────────────────────────────────────────┐
│           PRESENTATION LAYER                    │
│  (Routes/Controllers)                           │
│  - src/routes/*.ts                              │
│  - Xử lý HTTP requests/responses               │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           BUSINESS LOGIC LAYER                  │
│  (Services/Middleware)                          │
│  - src/middleware/auth.ts                       │
│  - Validation, Authentication                   │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│           DATA ACCESS LAYER                     │
│  (Models)                                        │
│  - src/models/*.ts                              │
│  - Mongoose Schemas                             │
└─────────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │   MongoDB     │
              └───────────────┘
```

### **Luồng Xử Lý Request Chi Tiết**

```
1. Client Request
   POST /api/my-hotels
   ↓
2. index.ts (Route Registration)
   app.use("/api/my-hotels", myHotelRoutes)
   ↓
3. routes/my-hotels.ts (Controller)
   router.post("/", verifyToken, [...], handler)
   ↓
4. middleware/auth.ts (Authentication)
   verifyToken → Kiểm tra JWT token → req.userId
   ↓
5. express-validator (Validation)
   Kiểm tra dữ liệu đầu vào
   ↓
6. routes/my-hotels.ts (Business Logic)
   Xử lý nghiệp vụ (upload images, format data)
   ↓
7. models/hotel.ts (Data Access)
   const hotel = new Hotel(data)
   await hotel.save()
   ↓
8. MongoDB
   Lưu document vào collection
   ↓
9. Response
   res.status(201).json(hotel)
```

### **Design Patterns Được Sử Dụng**

#### 1. **MVC Pattern (Model-View-Controller)**

Trong MVC pattern đúng chuẩn:

- **Model**: `src/models/*.ts` - Định nghĩa cấu trúc dữ liệu (Mongoose Schemas)
- **View**: JSON Response - Dữ liệu trả về cho client
- **Controller**: `src/controllers/*.ts` - Xử lý business logic (TÁCH RIÊNG khỏi Routes)
- **Routes**: `src/routes/*.ts` - Chỉ định nghĩa API endpoints và gọi Controller

**⚠️ Lưu ý:** Hiện tại trong code, Routes đang làm cả 2 việc (định nghĩa endpoints + xử lý logic). 
Để đúng MVC pattern, nên tách Controller ra riêng như sau:

```
Routes (Định nghĩa API) → Controller (Xử lý logic) → Model (Database)
```

**Cấu trúc đúng MVC:**
```
src/
├── routes/          # Chỉ định nghĩa endpoints
│   └── hotels.ts    # router.post("/", controller.createHotel)
├── controllers/     # Xử lý business logic
│   └── hotel.controller.ts  # createHotel, getHotels, updateHotel...
└── models/          # Data access
    └── hotel.ts
```

#### 2. **Middleware Pattern**

Middleware được chain lại với nhau để xử lý request theo từng bước:

```typescript
router.post(
  "/",
  verifyToken,        // Middleware 1: Authentication
  [validation],        // Middleware 2: Validation
  upload.array(),      // Middleware 3: File upload
  async (req, res) => { // Handler: Business logic
    // Xử lý nghiệp vụ
  }
);
```

**Luồng xử lý:**
- Request đi qua từng middleware theo thứ tự
- Mỗi middleware có thể:
  - Xử lý request (verifyToken → set req.userId)
  - Chặn request (validation failed → return error)
  - Gọi `next()` để chuyển sang middleware tiếp theo

#### 3. **Repository Pattern** (Implicit)

Models đóng vai trò như Repository, cung cấp methods để truy cập database:

```typescript
// Repository pattern - Models cung cấp methods
const hotels = await Hotel.find({ userId: req.userId });      // Tìm nhiều
const hotel = await Hotel.findById(id);                       // Tìm một
const hotel = await Hotel.findOneAndUpdate({...}, {...});    // Cập nhật
await hotel.save();                                           // Lưu
```

#### 4. **Singleton Pattern**

- Express app instance (một app duy nhất)
- MongoDB connection (một connection duy nhất)
- Các service instances

### **Separation of Concerns (Tách Biệt Mối Quan Tâm)**

Mỗi layer có trách nhiệm riêng biệt:

| Layer | Trách Nhiệm | Ví Dụ |
|-------|-------------|-------|
| **Routes** | Định nghĩa endpoints, gọi controller | `router.get("/", controller.getItems)` |
| **Controllers** | Xử lý business logic | `getItems() { ... logic ... }` |
| **Middleware** | Cross-cutting concerns | Authentication, Validation, Logging |
| **Models** | Database operations | `Hotel.find()`, `hotel.save()` |
| **Business Logic** | Nghiệp vụ cụ thể | Upload images, Format data, Calculate prices |

### **Ưu Điểm của Kiến Trúc Này**

✅ **Dễ Maintain**: Mỗi layer có trách nhiệm rõ ràng  
✅ **Dễ Test**: Có thể test từng layer riêng biệt  
✅ **Dễ Scale**: Có thể thêm features mới mà không ảnh hưởng layer khác  
✅ **Reusability**: Middleware và Models có thể tái sử dụng  
✅ **Type Safety**: TypeScript đảm bảo type safety giữa các layers  

### **So Sánh với Các Kiến Trúc Khác**

| Kiến Trúc | Dự Án Của Bạn | Mô Tả |
|-----------|---------------|-------|
| **Monolithic** | ✅ | Tất cả features trong một backend |
| **Microservices** | ❌ | Không tách thành nhiều services |
| **Layered** | ✅ | Routes → Middleware → Models |
| **MVC** | ✅ | Model-View-Controller pattern |
| **RESTful** | ✅ | API endpoints theo REST conventions |

---

## 🎯 Giới Thiệu CRUD và REST API

### CRUD là gì?

**CRUD** = **C**reate, **R**ead, **U**pdate, **D**elete (Tạo, Đọc, Cập nhật, Xóa)

| Operation | HTTP Method | Mô tả | Ví dụ |
|-----------|-------------|------|-------|
| **Create** | `POST` | Tạo mới dữ liệu | Đăng ký user, Tạo hotel |
| **Read** | `GET` | Đọc/lấy dữ liệu | Lấy danh sách hotels, Lấy thông tin user |
| **Update** | `PUT` / `PATCH` | Cập nhật dữ liệu | Sửa thông tin hotel, Đổi mật khẩu |
| **Delete** | `DELETE` | Xóa dữ liệu | Xóa hotel, Xóa booking |

### REST API Endpoints Pattern

```
GET    /api/resource          → Lấy tất cả (List)
GET    /api/resource/:id      → Lấy một item (Detail)
POST   /api/resource          → Tạo mới (Create)
PUT    /api/resource/:id      → Cập nhật toàn bộ (Update)
PATCH  /api/resource/:id      → Cập nhật một phần (Partial Update)
DELETE /api/resource/:id      → Xóa (Delete)
```

---

## 📁 Cấu Trúc Dự Án Backend

### **Cấu Trúc Hiện Tại (Routes + Logic gộp chung)**

```
backend/
├── index.ts                 # File chính, khởi tạo Express server
├── src/
│   ├── models/             # Mongoose Models (Schema)
│   │   ├── user.ts
│   │   ├── hotel.ts
│   │   └── booking.ts
│   ├── routes/              # API Routes (Đang làm cả Routes + Controller)
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── hotels.ts
│   │   └── my-hotels.ts
│   └── middleware/         # Middleware (Auth, Validation)
│       └── auth.ts
└── package.json
```

### **Cấu Trúc Đúng MVC (Khuyến Nghị)**

```
backend/
├── index.ts                 # File chính, khởi tạo Express server
├── src/
│   ├── models/             # Mongoose Models (Schema) - DATA LAYER
│   │   ├── user.ts
│   │   ├── hotel.ts
│   │   └── booking.ts
│   ├── routes/              # API Routes - CHỈ ĐỊNH NGHĨA ENDPOINTS
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── hotel.routes.ts
│   │   └── my-hotels.routes.ts
│   ├── controllers/         # Controllers - BUSINESS LOGIC LAYER
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── hotel.controller.ts
│   │   └── my-hotels.controller.ts
│   └── middleware/         # Middleware (Auth, Validation)
│       └── auth.ts
└── package.json
```

### **Luồng Hoạt Động (Đúng MVC)**

```
Client Request
    ↓
index.ts (Route Registration)
    ↓
routes/*.ts (Định nghĩa endpoints)
    router.post("/", verifyToken, hotelController.create)
    ↓
middleware/auth.ts (Authentication)
    ↓
controllers/*.ts (Xử lý business logic)
    createHotel(req, res) { ... }
    ↓
models/*.ts (Database Operations)
    await Hotel.save()
    ↓
MongoDB
```

### **So Sánh: Routes vs Controller**

| Routes | Controller |
|--------|------------|
| **Định nghĩa endpoints** | **Xử lý business logic** |
| `router.post("/", handler)` | `async createHotel(req, res) {}` |
| Chỉ gọi controller | Gọi model, xử lý data, trả response |
| Không có logic phức tạp | Có logic nghiệp vụ |
| Ví dụ: `router.get("/", getHotels)` | Ví dụ: `getHotels() { ... logic ... }` |

### **So Sánh: Cách Hiện Tại vs Cách Đúng MVC**

#### ❌ **Cách Hiện Tại (Routes + Logic gộp chung)**

```typescript
// routes/my-hotels.ts
router.post(
  "/",
  verifyToken,
  [validation],
  async (req: Request, res: Response) => {
    // ❌ Logic nghiệp vụ nằm trong Routes
    const imageFiles = (req as any).files;
    const newHotel = req.body;
    
    // Upload images
    const imageUrls = await uploadImages(imageFiles);
    newHotel.imageUrls = imageUrls;
    newHotel.userId = req.userId;
    
    // Save to database
    const hotel = new Hotel(newHotel);
    await hotel.save();
    
    res.status(201).json(hotel);
  }
);
```

**Nhược điểm:**
- Routes file dài và phức tạp
- Khó test logic riêng biệt
- Khó tái sử dụng logic
- Vi phạm Single Responsibility Principle

#### ✅ **Cách Đúng MVC (Routes tách Controller)**

```typescript
// routes/my-hotels.routes.ts
router.post(
  "/",
  verifyToken,
  [validation],
  hotelController.createHotel  // ✅ Chỉ gọi controller
);

// controllers/my-hotels.controller.ts
export const createHotel = async (req: Request, res: Response) => {
  // ✅ Logic nghiệp vụ nằm trong Controller
  const imageFiles = (req as any).files;
  const newHotel = req.body;
  
  // Upload images
  const imageUrls = await uploadImages(imageFiles);
  newHotel.imageUrls = imageUrls;
  newHotel.userId = req.userId;
  
  // Save to database
  const hotel = new Hotel(newHotel);
  await hotel.save();
  
  res.status(201).json(hotel);
};
```

**Ưu điểm:**
- Routes file ngắn gọn, dễ đọc
- Controller có thể test độc lập
- Logic có thể tái sử dụng
- Tuân thủ Single Responsibility Principle
- Dễ maintain và scale

---

## 🧩 Các Thành Phần Cần Thiết

### 1. **Model** (Schema Definition)
Định nghĩa cấu trúc dữ liệu trong MongoDB

### 2. **Routes** (API Endpoints Definition)
- Chỉ định nghĩa endpoints
- Gọi Controller functions
- Không có business logic

### 3. **Controller** (Business Logic)
- Xử lý business logic
- Gọi Model để thao tác database
- Trả về response

### 4. **Middleware**
- **Authentication**: Xác thực user (verifyToken)
- **Validation**: Kiểm tra dữ liệu đầu vào (express-validator)

### 5. **Request/Response**
- **Request**: Dữ liệu từ client gửi lên
- **Response**: Dữ liệu trả về cho client

---

## 📝 Hướng Dẫn Tạo API CRUD Từng Bước (Đúng MVC Pattern)

### Bước 1: Tạo Model (Schema)

**File:** `src/models/your-model.ts`

```typescript
import mongoose from "mongoose";
import { YourType } from "../../../shared/types";

const yourSchema = new mongoose.Schema<YourType>(
  {
    // Định nghĩa các fields
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    userId: { type: String, required: true, index: true },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

// Tạo indexes để tăng tốc tìm kiếm
yourSchema.index({ userId: 1, createdAt: -1 });

// Export model
const YourModel = mongoose.model<YourType>("YourModel", yourSchema);
export default YourModel;
```

---

### Bước 2: Tạo Controller (Business Logic)

**File:** `src/controllers/your-resource.controller.ts`

```typescript
import { Request, Response } from "express";
import YourModel from "../models/your-model";

// ============================================
// CREATE - Tạo mới
// ============================================
export const createItem = async (req: Request, res: Response) => {
    try {
    // 1. Lấy dữ liệu từ request body
      const newData = {
        ...req.body,
        userId: req.userId, // Lấy userId từ middleware
      };

    // 2. Tạo document mới
      const item = new YourModel(newData);
      await item.save();

    // 3. Trả về response
      res.status(201).json(item);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
};

// ============================================
// READ - Lấy danh sách (List)
// ============================================
export const getItems = async (req: Request, res: Response) => {
  try {
    // Lấy tất cả items của user hiện tại
    const items = await YourModel.find({ userId: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items" });
  }
};

// ============================================
// READ - Lấy một item (Detail)
// ============================================
export const getItemById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Tìm item theo ID và userId (đảm bảo user chỉ xem được item của mình)
    const item = await YourModel.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item" });
  }
};

// ============================================
// UPDATE - Cập nhật
// ============================================
export const updateItem = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      // Tìm và cập nhật item
      const item = await YourModel.findOneAndUpdate(
        { _id: id, userId: req.userId }, // Điều kiện: ID và userId
        req.body, // Dữ liệu mới
        { new: true } // Trả về document mới (sau khi update)
      );

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Error updating item" });
    }
};

// ============================================
// DELETE - Xóa
// ============================================
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Xóa item (chỉ xóa được item của chính user)
    const item = await YourModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
};
```

---

### Bước 3: Tạo Route File (Chỉ định nghĩa endpoints)

**File:** `src/routes/your-resource.routes.ts`

```typescript
import express from "express";
import { body, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import * as yourController from "../controllers/your-resource.controller";

const router = express.Router();

// ============================================
// CREATE - Tạo mới
// ============================================
router.post(
  "/",
  verifyToken, // Middleware: Kiểm tra đăng nhập
  [
    // Validation: Kiểm tra dữ liệu đầu vào
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  (req, res, next) => {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Chuyển sang controller
  },
  yourController.createItem // Gọi controller
);

// ============================================
// READ - Lấy danh sách (List)
// ============================================
router.get("/", verifyToken, yourController.getItems);

// ============================================
// READ - Lấy một item (Detail)
// ============================================
router.get("/:id", verifyToken, yourController.getItemById);

// ============================================
// UPDATE - Cập nhật
// ============================================
router.put(
  "/:id",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  yourController.updateItem
);

// ============================================
// DELETE - Xóa
// ============================================
router.delete("/:id", verifyToken, yourController.deleteItem);

export default router;
```

**Giải thích:**
- **Routes**: Chỉ định nghĩa endpoints, middleware, validation
- **Controller**: Xử lý toàn bộ business logic
- **Tách biệt rõ ràng**: Routes không có logic, Controller không có routing

---

### Bước 4: Đăng Ký Route trong index.ts

**File:** `backend/index.ts`

```typescript
import yourRoutes from "./src/routes/your-resource";

// ... các imports khác ...

// Đăng ký route
app.use("/api/your-resource", yourRoutes);
```

---

## 💡 Ví Dụ Thực Tế Từ Code

### Ví Dụ 1: GET - Lấy thông tin user hiện tại

**File:** `src/routes/users.ts`

```typescript
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId; // Lấy từ middleware verifyToken

  try {
    // Tìm user theo ID, loại bỏ password
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
```

**Giải thích:**
- `verifyToken`: Middleware kiểm tra user đã đăng nhập chưa
- `req.userId`: ID của user (được set bởi middleware)
- `.select("-password")`: Loại bỏ field password khỏi kết quả
- `res.json(user)`: Trả về dữ liệu dạng JSON

---

### Ví Dụ 2: POST - Tạo hotel mới

**File:** `src/routes/my-hotels.ts`

```typescript
router.post(
  "/",
  verifyToken, // 1. Kiểm tra đăng nhập
  [
    // 2. Validation
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
  ],
  upload.array("imageFiles", 6), // 3. Middleware upload file
  async (req: Request, res: Response) => {
    try {
      // 4. Lấy dữ liệu từ request
      const newHotel: HotelType = req.body;
      
      // 5. Xử lý dữ liệu (upload images, format data)
      const imageUrls = await uploadImages(imageFiles);
      newHotel.imageUrls = imageUrls;
      newHotel.userId = req.userId; // Gán userId
      
      // 6. Tạo và lưu vào database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      
      // 7. Trả về response
      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
```

**Giải thích:**
1. **verifyToken**: Kiểm tra authentication
2. **Validation**: Kiểm tra dữ liệu đầu vào
3. **upload.array()**: Middleware xử lý upload nhiều file
4. **req.body**: Dữ liệu từ client gửi lên
5. **Business Logic**: Xử lý nghiệp vụ (upload ảnh, format data)
6. **Database**: Lưu vào MongoDB
7. **Response**: Trả về kết quả

---

### Ví Dụ 3: GET - Lấy danh sách hotels của user

```typescript
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Tìm tất cả hotels có userId = req.userId
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
```

**Giải thích:**
- `Hotel.find({ userId: req.userId })`: Tìm tất cả hotels của user hiện tại
- Đảm bảo user chỉ xem được hotels của chính mình

---

### Ví Dụ 4: GET - Lấy một hotel cụ thể

```typescript
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  
  try {
    // Tìm hotel theo ID và userId (đảm bảo security)
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId, // Chỉ lấy hotel của chính user
    });
    
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
});
```

**Giải thích:**
- `req.params.id`: Lấy ID từ URL (`/api/my-hotels/:id`)
- `Hotel.findOne()`: Tìm một document
- Kiểm tra cả `_id` và `userId` để đảm bảo user chỉ xem được hotel của mình

---

### Ví Dụ 5: PUT - Cập nhật hotel

```typescript
router.put(
  "/:id",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    // ... các validation khác
  ],
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Tìm và cập nhật
      const hotel = await Hotel.findOneAndUpdate(
        { _id: id, userId: req.userId }, // Điều kiện
        req.body, // Dữ liệu mới
        { new: true } // Trả về document mới
      );
      
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Error updating hotel" });
    }
  }
);
```

**Giải thích:**
- `findOneAndUpdate()`: Tìm và cập nhật trong một lần
- `{ new: true }`: Trả về document sau khi update (mặc định trả về document cũ)

---

### Ví Dụ 6: DELETE - Xóa hotel

```typescript
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    // Xóa hotel
    const hotel = await Hotel.findOneAndDelete({
      _id: id,
      userId: req.userId, // Chỉ xóa được hotel của chính user
    });
    
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel" });
  }
});
```

---

## 🔐 Middleware: Authentication

**File:** `src/middleware/auth.ts`

```typescript
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Mở rộng type Request để có userId
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // 1. Lấy token từ header hoặc cookie
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies["session_id"];
  }

  // 2. Kiểm tra có token không
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    
    // 4. Gán userId vào request
    req.userId = (decoded as JwtPayload).userId;
    
    // 5. Tiếp tục đến route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export default verifyToken;
```

**Cách sử dụng:**
```typescript
router.get("/", verifyToken, async (req, res) => {
  // req.userId đã có sẵn từ middleware
  const userId = req.userId;
});
```

---

## ✅ Validation với express-validator

```typescript
import { body, validationResult } from "express-validator";

router.post(
  "/",
  [
    // Validation rules
    body("email")
      .isEmail()
      .withMessage("Email must be valid"),
    
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    
    body("age")
      .isInt({ min: 0, max: 120 })
      .withMessage("Age must be between 0 and 120"),
    
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
  ],
  async (req: Request, res: Response) => {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Nếu không có lỗi, tiếp tục xử lý
    // ...
  }
);
```

**Các validation methods phổ biến:**
- `notEmpty()`: Không được để trống
- `isEmail()`: Phải là email hợp lệ
- `isLength({ min, max })`: Độ dài chuỗi
- `isNumeric()`: Phải là số
- `isInt()`: Phải là số nguyên
- `isArray()`: Phải là mảng
- `isBoolean()`: Phải là boolean

---

## 📊 HTTP Status Codes

| Code | Ý nghĩa | Khi nào dùng |
|------|---------|--------------|
| **200** | OK | Request thành công (GET, PUT, DELETE) |
| **201** | Created | Tạo mới thành công (POST) |
| **400** | Bad Request | Dữ liệu đầu vào không hợp lệ |
| **401** | Unauthorized | Chưa đăng nhập hoặc token không hợp lệ |
| **403** | Forbidden | Đã đăng nhập nhưng không có quyền |
| **404** | Not Found | Không tìm thấy resource |
| **500** | Internal Server Error | Lỗi server (database, code, ...) |

---

## 🎯 Best Practices

### 1. **Luôn dùng try-catch**

```typescript
async (req: Request, res: Response) => {
  try {
    // Code xử lý
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
```

### 2. **Kiểm tra quyền truy cập**

```typescript
// Luôn kiểm tra userId khi query
const item = await Model.findOne({
  _id: id,
  userId: req.userId, // Đảm bảo user chỉ truy cập được data của mình
});
```

### 3. **Validation trước khi xử lý**

```typescript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

### 4. **Trả về status code đúng**

```typescript
res.status(201).json(item); // POST: 201 Created
res.status(200).json(item); // GET, PUT, DELETE: 200 OK
res.status(404).json({ message: "Not found" }); // 404 Not Found
```

### 5. **Không trả về password**

```typescript
const user = await User.findById(id).select("-password");
```

### 6. **Logging để debug**

```typescript
console.log("Creating hotel:", req.body);
console.log("Error:", error);
```

### 7. **Sử dụng async/await**

```typescript
// ✅ Đúng
const user = await User.findById(id);

// ❌ Sai (không dùng callback)
User.findById(id, (err, user) => { ... });
```

---

## 📋 Checklist Tạo API Mới (Đúng MVC)

- [ ] Tạo Model trong `src/models/`
- [ ] Tạo Controller trong `src/controllers/`
  - [ ] Implement các CRUD functions:
    - [ ] `createItem()` - Create
    - [ ] `getItems()` - List
    - [ ] `getItemById()` - Detail
    - [ ] `updateItem()` - Update
    - [ ] `deleteItem()` - Delete
- [ ] Tạo Route file trong `src/routes/`
  - [ ] Định nghĩa endpoints
  - [ ] Gọi controller functions
- [ ] Thêm middleware `verifyToken` cho các route cần auth
  - [ ] Thêm validation với express-validator
- [ ] Đăng ký route trong `index.ts`
- [ ] Test API với Postman hoặc frontend

---

## 🚀 Ví Dụ Hoàn Chỉnh: Tạo API "Products" (Đúng MVC)

### 1. Model: `src/models/product.ts`

```typescript
import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;
```

### 2. Controller: `src/controllers/product.controller.ts`

```typescript
import { Request, Response } from "express";
import Product from "../models/product";

// CREATE
export const createProduct = async (req: Request, res: Response) => {
    try {
      const product = new Product({
        ...req.body,
        userId: req.userId,
      });
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
};

// READ ALL
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ userId: req.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// READ ONE
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error updating product" });
    }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
```

### 3. Routes: `src/routes/product.routes.ts`

```typescript
import express from "express";
import { body, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import * as productController from "../controllers/product.controller";

const router = express.Router();

// CREATE
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  productController.createProduct
);

// READ ALL
router.get("/", verifyToken, productController.getProducts);

// READ ONE
router.get("/:id", verifyToken, productController.getProductById);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  productController.updateProduct
);

// DELETE
router.delete("/:id", verifyToken, productController.deleteProduct);

export default router;
```

### 4. Đăng ký trong `index.ts`

```typescript
import productRoutes from "./src/routes/product.routes";

app.use("/api/products", productRoutes);
```

**Kết quả:**
- ✅ Routes file ngắn gọn, chỉ định nghĩa endpoints
- ✅ Controller file chứa toàn bộ business logic
- ✅ Dễ test từng phần riêng biệt
- ✅ Dễ maintain và scale

---

## 🎓 Tóm Tắt

### **Kiến Trúc**

1. **Layered Architecture (3-Tier)**
   - Presentation Layer (Routes)
   - Business Logic Layer (Middleware)
   - Data Access Layer (Models)

2. **Design Patterns**
   - MVC Pattern
   - Middleware Pattern
   - Repository Pattern
   - Singleton Pattern

3. **Separation of Concerns**
   - Mỗi layer có trách nhiệm riêng
   - Dễ maintain và test

### **CRUD Operations**

1. **Model**: Định nghĩa cấu trúc dữ liệu
2. **Route**: Xử lý HTTP requests
3. **Middleware**: Authentication và Validation
4. **CRUD**: Create, Read, Update, Delete
5. **Best Practices**: Error handling, Security, Validation

### **Luồng Tạo API Mới**

```
1. Tạo Model (Schema)
   ↓
2. Tạo Route (Controller)
   ↓
3. Thêm Middleware (Auth, Validation)
   ↓
4. Implement CRUD Operations
   ↓
5. Đăng ký Route trong index.ts
   ↓
6. Test API
```

**Chúc bạn code vui vẻ! 🚀**

