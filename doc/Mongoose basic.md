# 📚 Hướng Dẫn Mongoose cho Người Biết SQL

## 🎯 So Sánh Nhanh: SQL vs MongoDB

| SQL (MySQL/PostgreSQL) | MongoDB |
|------------------------|---------|
| **Database** | **Database** |
| **Table** | **Collection** |
| **Row/Record** | **Document** |
| **Column** | **Field** |
| **Primary Key** | **_id** (tự động tạo) |
| **Foreign Key** | **Reference** (ObjectId) |
| **JOIN** | **Populate** hoặc **Aggregation** |
| **Transaction** | **Transaction** (từ MongoDB 4.0+) |

---

## 📊 Ví Dụ So Sánh Cụ Thể

### SQL: Tạo Table Users
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin', 'hotel_owner') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### MongoDB/Mongoose: Tạo Schema Users
```typescript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'hotel_owner'],
    default: 'user'
  }
}, {
  timestamps: true  // Tự động tạo createdAt và updatedAt
});

const User = mongoose.model('User', userSchema);
```

**Giải thích:**
- `mongoose.Schema()` = định nghĩa cấu trúc (giống CREATE TABLE)
- `mongoose.model()` = tạo model để sử dụng (giống class/interface)
- `timestamps: true` = tự động thêm `createdAt` và `updatedAt`

---

## 🔍 CRUD Operations: SQL vs Mongoose

### 1. CREATE (Thêm dữ liệu)

#### SQL:
```sql
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('user@example.com', 'hashed_password', 'John', 'Doe', 'user');
```

#### Mongoose:
```typescript
// Cách 1: Tạo object rồi save
const newUser = new User({
  email: 'user@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
});
await newUser.save();

// Cách 2: Tạo và save luôn (ngắn gọn hơn)
const newUser = await User.create({
  email: 'user@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
});
```

---

### 2. READ (Đọc dữ liệu)

#### SQL:
```sql
-- Lấy tất cả users
SELECT * FROM users;

-- Lấy user theo ID
SELECT * FROM users WHERE id = 1;

-- Lấy user theo email
SELECT * FROM users WHERE email = 'user@example.com';

-- Lấy users có role = 'admin'
SELECT * FROM users WHERE role = 'admin';

-- Lấy users và sắp xếp
SELECT * FROM users ORDER BY created_at DESC;

-- Lấy 10 users đầu tiên
SELECT * FROM users LIMIT 10;
```

#### Mongoose:
```typescript
// Lấy tất cả users
const users = await User.find();

// Lấy user theo ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Lấy user theo email
const user = await User.findOne({ email: 'user@example.com' });

// Lấy users có role = 'admin'
const admins = await User.find({ role: 'admin' });

// Lấy users và sắp xếp
const users = await User.find().sort({ createdAt: -1 });

// Lấy 10 users đầu tiên
const users = await User.find().limit(10);
```

**So sánh:**
- `find()` = `SELECT *`
- `findOne()` = `SELECT * ... LIMIT 1`
- `findById()` = `SELECT * WHERE id = ?`
- `find({ field: value })` = `SELECT * WHERE field = value`
- `.sort()` = `ORDER BY`
- `.limit()` = `LIMIT`

---

### 3. UPDATE (Cập nhật dữ liệu)

#### SQL:
```sql
-- Update một field
UPDATE users 
SET first_name = 'Jane' 
WHERE id = 1;

-- Update nhiều fields
UPDATE users 
SET first_name = 'Jane', last_name = 'Smith', role = 'admin'
WHERE id = 1;

-- Update với điều kiện
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

#### Mongoose:
```typescript
// Update một field
await User.findByIdAndUpdate('507f1f77bcf86cd799439011', {
  firstName: 'Jane'
});

// Update nhiều fields
await User.findByIdAndUpdate('507f1f77bcf86cd799439011', {
  firstName: 'Jane',
  lastName: 'Smith',
  role: 'admin'
});

// Update với điều kiện
await User.findOneAndUpdate(
  { email: 'admin@example.com' },
  { role: 'admin' }
);

// Update và trả về document đã update
const updatedUser = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { firstName: 'Jane' },
  { new: true }  // Trả về document mới, không phải document cũ
);
```

**Lưu ý quan trọng:**
- `findByIdAndUpdate()` mặc định trả về document **CŨ** (trước khi update)
- Thêm `{ new: true }` để lấy document **MỚI** (sau khi update)

---

### 4. DELETE (Xóa dữ liệu)

#### SQL:
```sql
-- Xóa user theo ID
DELETE FROM users WHERE id = 1;

-- Xóa nhiều users
DELETE FROM users WHERE role = 'guest';

-- Xóa tất cả users (nguy hiểm!)
DELETE FROM users;
```

#### Mongoose:
```typescript
// Xóa user theo ID
await User.findByIdAndDelete('507f1f77bcf86cd799439011');

// Xóa user theo điều kiện
await User.findOneAndDelete({ email: 'user@example.com' });

// Xóa nhiều users
await User.deleteMany({ role: 'guest' });

// Xóa tất cả users (nguy hiểm!)
await User.deleteMany({});
```

---

## 🔗 Relationships (Quan hệ giữa các bảng)

### SQL: Foreign Key

```sql
-- Table hotels có foreign key đến users
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Lấy hotel kèm thông tin user (JOIN)
SELECT h.*, u.email, u.first_name, u.last_name
FROM hotels h
INNER JOIN users u ON h.user_id = u.id
WHERE h.id = 1;
```

### Mongoose: Reference & Populate

```typescript
// Schema Hotel có reference đến User
const hotelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Kiểu ObjectId (giống foreign key)
    ref: 'User',  // Tham chiếu đến model User
    required: true
  },
  name: { type: String, required: true },
  city: { type: String, required: true }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Lấy hotel kèm thông tin user (Populate)
const hotel = await Hotel.findById('hotel_id')
  .populate('userId');  // Tự động JOIN và lấy thông tin user

// Kết quả:
// hotel.userId sẽ là object User đầy đủ, không phải chỉ là ID
```

**So sánh:**
- `ref: 'User'` = `FOREIGN KEY REFERENCES users(id)`
- `.populate('userId')` = `INNER JOIN users`

---

## 📝 Các Khái Niệm Quan Trọng trong Mongoose

### 1. Schema (Định nghĩa cấu trúc)

```typescript
const userSchema = new mongoose.Schema({
  // Field bắt buộc
  email: { type: String, required: true },
  
  // Field có giá trị mặc định
  role: { type: String, default: 'user' },
  
  // Field unique (không trùng lặp)
  email: { type: String, unique: true },
  
  // Field có index (tăng tốc tìm kiếm)
  email: { type: String, index: true },
  
  // Field optional (không bắt buộc)
  phone: { type: String },  // hoặc phone: String
  
  // Array
  tags: [String],  // Mảng các string
  
  // Object lồng nhau
  address: {
    street: String,
    city: String,
    country: String
  },
  
  // Enum (chỉ cho phép các giá trị nhất định)
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true,  // Tự động thêm createdAt, updatedAt
  collection: 'users'  // Tên collection (mặc định là 'users' - số nhiều của model name)
});
```

---

### 2. Model (Class để thao tác với Collection)

```typescript
// Tạo model từ schema
const User = mongoose.model('User', userSchema);

// 'User' = tên model (số ít)
// MongoDB sẽ tự động tạo collection tên 'users' (số nhiều)
```

---

### 3. Document (Một bản ghi trong collection)

```typescript
// Tạo document mới
const user = new User({
  email: 'test@example.com',
  firstName: 'Test'
});

// Document có các methods:
await user.save();           // Lưu vào database
user.toJSON();               // Chuyển thành JSON
user.toObject();             // Chuyển thành plain object
user.isModified('email');    // Kiểm tra field có thay đổi không
```

---

### 4. Query Methods (Các phương thức truy vấn)

```typescript
// Query Builder Pattern (có thể chain nhiều methods)
const users = await User
  .find({ role: 'admin' })      // Tìm users có role = 'admin'
  .sort({ createdAt: -1 })      // Sắp xếp theo createdAt giảm dần
  .limit(10)                    // Chỉ lấy 10 kết quả
  .select('email firstName');   // Chỉ lấy các field email và firstName

// Tương đương SQL:
// SELECT email, first_name 
// FROM users 
// WHERE role = 'admin' 
// ORDER BY created_at DESC 
// LIMIT 10;
```

---

### 5. Middleware (Hooks) - Tương tự Triggers trong SQL

#### Pre-save Hook (Chạy trước khi save)

```typescript
// Tự động hash password trước khi lưu
userSchema.pre('save', async function(next) {
  // this = document đang được save
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();  // Tiếp tục quá trình save
});
```

**Tương đương SQL Trigger:**
```sql
CREATE TRIGGER hash_password_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  SET NEW.password = SHA2(NEW.password, 256);
END;
```

#### Post-save Hook (Chạy sau khi save)

```typescript
userSchema.post('save', function(doc, next) {
  console.log('User đã được lưu:', doc.email);
  next();
});
```

---

## 🎯 Ví Dụ Thực Tế: User và Hotel

### Schema Definitions

```typescript
// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'hotel_owner'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Hotel Schema (có reference đến User)
const hotelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  city: { type: String, required: true },
  pricePerNight: { type: Number, required: true }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', hotelSchema);
```

### CRUD Operations

```typescript
// 1. CREATE: Tạo user mới
const newUser = await User.create({
  email: 'owner@hotel.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  role: 'hotel_owner'
});

// 2. CREATE: Tạo hotel cho user đó
const newHotel = await Hotel.create({
  userId: newUser._id,  // Sử dụng _id của user vừa tạo
  name: 'Grand Hotel',
  city: 'Ho Chi Minh',
  pricePerNight: 100
});

// 3. READ: Lấy hotel kèm thông tin owner
const hotel = await Hotel.findById('hotel_id')
  .populate('userId', 'email firstName lastName');  // Chỉ lấy các field này của user

// 4. READ: Lấy tất cả hotels của một user
const userHotels = await Hotel.find({ userId: 'user_id' });

// 5. UPDATE: Cập nhật giá phòng
await Hotel.findByIdAndUpdate('hotel_id', {
  pricePerNight: 150
}, { new: true });

// 6. DELETE: Xóa hotel
await Hotel.findByIdAndDelete('hotel_id');
```

---

## 🔍 Query Operators (Toán tử truy vấn)

### So sánh với SQL WHERE

| SQL | Mongoose |
|-----|----------|
| `WHERE age = 25` | `{ age: 25 }` |
| `WHERE age > 25` | `{ age: { $gt: 25 } }` |
| `WHERE age >= 25` | `{ age: { $gte: 25 } }` |
| `WHERE age < 25` | `{ age: { $lt: 25 } }` |
| `WHERE age <= 25` | `{ age: { $lte: 25 } }` |
| `WHERE age != 25` | `{ age: { $ne: 25 } }` |
| `WHERE age IN (25, 30, 35)` | `{ age: { $in: [25, 30, 35] } }` |
| `WHERE name LIKE '%hotel%'` | `{ name: { $regex: 'hotel', $options: 'i' } }` |
| `WHERE age BETWEEN 20 AND 30` | `{ age: { $gte: 20, $lte: 30 } }` |
| `WHERE age IS NULL` | `{ age: null }` hoặc `{ age: { $exists: false } }` |

### Ví dụ:

```typescript
// Tìm hotels có giá từ 50 đến 200
const hotels = await Hotel.find({
  pricePerNight: { $gte: 50, $lte: 200 }
});

// Tìm hotels ở các thành phố cụ thể
const hotels = await Hotel.find({
  city: { $in: ['Ho Chi Minh', 'Ha Noi', 'Da Nang'] }
});

// Tìm hotels có tên chứa "resort" (không phân biệt hoa thường)
const hotels = await Hotel.find({
  name: { $regex: 'resort', $options: 'i' }
});
```

---

## 📊 Aggregation (Tương tự GROUP BY, COUNT, SUM trong SQL)

### SQL:
```sql
SELECT city, COUNT(*) as total_hotels, AVG(price_per_night) as avg_price
FROM hotels
GROUP BY city;
```

### Mongoose:
```typescript
const result = await Hotel.aggregate([
  {
    $group: {
      _id: '$city',
      totalHotels: { $sum: 1 },
      avgPrice: { $avg: '$pricePerNight' }
    }
  }
]);
```

---

## ⚡ Indexes (Chỉ mục - Tăng tốc tìm kiếm)

### SQL:
```sql
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_city ON hotels(city);
```

### Mongoose:
```typescript
// Tạo index trong schema
userSchema.index({ email: 1 });  // 1 = ascending, -1 = descending
hotelSchema.index({ city: 1 });

// Tạo compound index (nhiều fields)
hotelSchema.index({ city: 1, pricePerNight: 1 });
```

---

## 🎓 Tóm Tắt Kiến Thức

### 1. **Collection = Table**
- Collection chứa các documents (giống table chứa rows)
- Tên collection thường là số nhiều của model name (User → users)

### 2. **Document = Row**
- Một document là một bản ghi trong collection
- Document là JSON object, linh hoạt hơn SQL row

### 3. **Schema = Table Structure**
- Định nghĩa cấu trúc và validation rules
- Không bắt buộc (MongoDB là NoSQL, linh hoạt)

### 4. **Model = Class để thao tác**
- Dùng model để CRUD operations
- `User.find()`, `User.create()`, `User.findByIdAndUpdate()`

### 5. **Populate = JOIN**
- Lấy thông tin từ collection khác thông qua reference
- `.populate('userId')` = JOIN với collection users

### 6. **Middleware = Triggers**
- `pre('save')` = BEFORE INSERT/UPDATE
- `post('save')` = AFTER INSERT/UPDATE

---

## 🚀 Best Practices

1. **Luôn dùng async/await** với Mongoose operations
2. **Validate data** trong schema (required, enum, etc.)
3. **Tạo indexes** cho các field thường query
4. **Dùng populate** thay vì nhiều queries riêng lẻ
5. **Handle errors** với try-catch
6. **Dùng timestamps** để tự động track createdAt/updatedAt

---

## 📚 Tài Liệu Tham Khảo

- [Mongoose Official Docs](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB vs SQL Cheat Sheet](https://www.mongodb.com/docs/manual/reference/sql-comparison/)

---

**Chúc bạn học tốt! 🎉**

