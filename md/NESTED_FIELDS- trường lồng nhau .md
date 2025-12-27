# 📚 Nested Fields trong MongoDB/Mongoose - Hướng Dẫn Cho Người Mới

## 🎯 Nested Fields là gì?

**Nested Fields** = Trường lồng nhau = Object/Array nằm bên trong một document.

Trong MongoDB, bạn có thể lưu **object** hoặc **array** bên trong một document, không cần tách ra nhiều bảng như SQL.

---

## 📊 So Sánh: SQL vs MongoDB

### **SQL (Relational Database)**

Trong SQL, bạn phải tách thành nhiều bảng:

```sql
-- Bảng hotels
CREATE TABLE hotels (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255)
);

-- Bảng hotel_contact (tách riêng)
CREATE TABLE hotel_contact (
  hotel_id INT,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Bảng hotel_policies (tách riêng)
CREATE TABLE hotel_policies (
  hotel_id INT,
  check_in_time VARCHAR(10),
  check_out_time VARCHAR(10),
  FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
```

**Để lấy thông tin đầy đủ:**
```sql
SELECT h.*, c.phone, c.email, p.check_in_time
FROM hotels h
LEFT JOIN hotel_contact c ON h.id = c.hotel_id
LEFT JOIN hotel_policies p ON h.id = p.hotel_id;
```

### **MongoDB (Document Database)**

Trong MongoDB, bạn có thể lưu tất cả trong 1 document:

```javascript
{
  _id: "123",
  name: "Grand Hotel",
  city: "London",
  country: "UK",
  contact: {              // ← Nested Object
    phone: "123-456-7890",
    email: "info@grandhotel.com",
    website: "www.grandhotel.com"
  },
  policies: {             // ← Nested Object
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation"
  }
}
```

**Để lấy thông tin đầy đủ:**
```javascript
const hotel = await Hotel.findById(id);
// Đã có tất cả thông tin trong 1 document!
```

---

## 🏗️ Định Nghĩa Nested Fields trong Mongoose

### **1. Nested Object (Object lồng nhau)**

```typescript
// models/hotel.ts
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  
  // Nested Object - Contact information
  contact: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  
  // Nested Object - Policies
  policies: {
    checkInTime: { type: String, default: "" },
    checkOutTime: { type: String, default: "" },
    cancellationPolicy: { type: String, default: "" },
    petPolicy: { type: String, default: "" },
    smokingPolicy: { type: String, default: "" }
  }
});

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
```

### **2. Nested Array (Array lồng nhau)**

```typescript
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Nested Array - Image URLs
  imageUrls: [String],  // Array of strings
  
  // Nested Array - Facilities
  facilities: [String],  // ["WiFi", "Pool", "Gym"]
  
  // Nested Array of Objects - Room types
  roomTypes: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      capacity: { type: Number, required: true }
    }
  ]
});
```

### **3. Nested Array of Objects (Array chứa Objects)**

```typescript
const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  hotelId: { type: String, required: true },
  
  // Nested Array of Objects - Guests
  guests: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      age: { type: Number, required: true },
      email: { type: String }
    }
  ],
  
  // Nested Array of Objects - Services
  services: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});
```

---

## 📝 Ví Dụ Thực Tế: Hotel Booking

### **Schema với Nested Fields:**

```typescript
// models/hotel.ts
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  
  // Nested Object 1: Contact
  contact: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  
  // Nested Object 2: Policies
  policies: {
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },
    cancellationPolicy: { type: String, default: "" },
    petPolicy: { type: String, default: "" },
    smokingPolicy: { type: String, default: "" }
  },
  
  // Nested Array: Image URLs
  imageUrls: [String],
  
  // Nested Array: Facilities
  facilities: [String],
  
  // Nested Array of Objects: Reviews
  reviews: [
    {
      userId: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });
```

### **Document mẫu:**

```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "Grand Hotel",
  city: "London",
  country: "UK",
  pricePerNight: 150,
  
  contact: {
    phone: "123-456-7890",
    email: "info@grandhotel.com",
    website: "www.grandhotel.com"
  },
  
  policies: {
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Free cancellation within 24 hours",
    petPolicy: "Pets allowed",
    smokingPolicy: "Non-smoking"
  },
  
  imageUrls: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  
  facilities: ["WiFi", "Pool", "Gym", "Spa"],
  
  reviews: [
    {
      userId: "user123",
      rating: 5,
      comment: "Great hotel!",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      userId: "user456",
      rating: 4,
      comment: "Nice place",
      createdAt: "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## 🔍 Query Nested Fields

### **1. Query Nested Object**

```typescript
// Tìm hotels có email cụ thể trong contact
const hotels = await Hotel.find({
  "contact.email": "info@grandhotel.com"
});

// Tìm hotels có check-in time cụ thể
const hotels = await Hotel.find({
  "policies.checkInTime": "14:00"
});

// Query nhiều điều kiện trong nested object
const hotels = await Hotel.find({
  "contact.phone": { $exists: true },
  "policies.petPolicy": "Pets allowed"
});
```

**Giải thích:**
- `"contact.email"` = Dùng dấu chấm (`.`) để truy cập nested field
- `$exists: true` = Kiểm tra field có tồn tại không

### **2. Query Nested Array**

```typescript
// Tìm hotels có facility "Pool"
const hotels = await Hotel.find({
  facilities: "Pool"  // Tìm trong array
});

// Tìm hotels có TẤT CẢ facilities trong array
const hotels = await Hotel.find({
  facilities: { $all: ["WiFi", "Pool"] }  // Phải có cả WiFi VÀ Pool
});

// Tìm hotels có ÍT NHẤT 1 facility trong array
const hotels = await Hotel.find({
  facilities: { $in: ["WiFi", "Gym"] }  // Có WiFi HOẶC Gym
});
```

### **3. Query Nested Array of Objects**

```typescript
// Tìm hotels có review với rating >= 4
const hotels = await Hotel.find({
  "reviews.rating": { $gte: 4 }
});

// Tìm hotels có review từ user cụ thể
const hotels = await Hotel.find({
  "reviews.userId": "user123"
});

// Tìm hotels có review với rating = 5 VÀ comment chứa "great"
const hotels = await Hotel.find({
  "reviews.rating": 5,
  "reviews.comment": { $regex: "great", $options: "i" }
});
```

---

## ✏️ Update Nested Fields

### **1. Update Nested Object**

```typescript
// Cách 1: Update toàn bộ nested object
await Hotel.findByIdAndUpdate(hotelId, {
  contact: {
    phone: "999-999-9999",
    email: "newemail@hotel.com",
    website: "www.newwebsite.com"
  }
});

// Cách 2: Update chỉ 1 field trong nested object (dùng $set)
await Hotel.findByIdAndUpdate(hotelId, {
  $set: {
    "contact.phone": "999-999-9999"  // Chỉ update phone, giữ nguyên email, website
  }
});

// Cách 3: Update nhiều fields trong nested object
await Hotel.findByIdAndUpdate(hotelId, {
  $set: {
    "contact.phone": "999-999-9999",
    "policies.checkInTime": "15:00"
  }
});
```

### **2. Update Nested Array**

```typescript
// Thêm phần tử vào array
await Hotel.findByIdAndUpdate(hotelId, {
  $push: {
    facilities: "Parking"  // Thêm "Parking" vào array facilities
  }
});

// Xóa phần tử khỏi array
await Hotel.findByIdAndUpdate(hotelId, {
  $pull: {
    facilities: "Pool"  // Xóa "Pool" khỏi array facilities
  }
});

// Thêm nhiều phần tử vào array
await Hotel.findByIdAndUpdate(hotelId, {
  $push: {
    imageUrls: { $each: ["url1", "url2", "url3"] }  // Thêm nhiều URLs
  }
});
```

### **3. Update Nested Array of Objects**

```typescript
// Thêm review mới vào array
await Hotel.findByIdAndUpdate(hotelId, {
  $push: {
    reviews: {
      userId: "user789",
      rating: 5,
      comment: "Excellent!",
      createdAt: new Date()
    }
  }
});

// Update review cụ thể trong array (dùng $)
await Hotel.updateOne(
  { _id: hotelId, "reviews.userId": "user123" },  // Tìm review của user123
  {
    $set: {
      "reviews.$.rating": 5,  // $ = review được tìm thấy
      "reviews.$.comment": "Updated comment"
    }
  }
);

// Xóa review cụ thể
await Hotel.findByIdAndUpdate(hotelId, {
  $pull: {
    reviews: { userId: "user123" }  // Xóa review của user123
  }
});
```

---

## 💡 Ví Dụ Thực Tế: Controller Code

### **Ví Dụ 1: Tạo Hotel với Nested Fields**

```typescript
// controllers/my-hotels.controller.ts
export const createHotel = async (req: Request, res: Response) => {
  try {
    const newHotel = {
      name: req.body.name,
      city: req.body.city,
      country: req.body.country,
      pricePerNight: req.body.pricePerNight,
      
      // Nested Object: Contact
      contact: {
        phone: req.body["contact.phone"] || "",  // FormData gửi dạng "contact.phone"
        email: req.body["contact.email"] || "",
        website: req.body["contact.website"] || ""
      },
      
      // Nested Object: Policies
      policies: {
        checkInTime: req.body["policies.checkInTime"] || "",
        checkOutTime: req.body["policies.checkOutTime"] || "",
        cancellationPolicy: req.body["policies.cancellationPolicy"] || "",
        petPolicy: req.body["policies.petPolicy"] || "",
        smokingPolicy: req.body["policies.smokingPolicy"] || ""
      },
      
      // Nested Array: Image URLs
      imageUrls: imageUrls,  // Array từ upload
      
      // Nested Array: Facilities
      facilities: Array.isArray(req.body.facilities) 
        ? req.body.facilities 
        : [req.body.facilities],
      
      userId: req.userId
    };
    
    const hotel = new Hotel(newHotel);
    await hotel.save();
    
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
```

### **Ví Dụ 2: Update Nested Fields**

```typescript
// controllers/my-hotels.controller.ts
export const updateMyHotel = async (req: Request, res: Response) => {
  try {
    const updateData: any = {
      name: req.body.name,
      city: req.body.city,
      
      // Update nested object
      contact: {
        phone: req.body["contact.phone"] || "",
        email: req.body["contact.email"] || "",
        website: req.body["contact.website"] || ""
      },
      
      policies: {
        checkInTime: req.body["policies.checkInTime"] || "",
        checkOutTime: req.body["policies.checkOutTime"] || "",
        cancellationPolicy: req.body["policies.cancellationPolicy"] || ""
      }
    };
    
    // Update chỉ 1 field trong nested object (nếu cần)
    // await Hotel.findByIdAndUpdate(hotelId, {
    //   $set: { "contact.phone": req.body.phone }
    // });
    
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      updateData,
      { new: true }
    );
    
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error updating hotel" });
  }
};
```

### **Ví Dụ 3: Query Nested Fields**

```typescript
// controllers/hotel.controller.ts
export const searchHotels = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    
    // Query nested object
    if (req.query.city) {
      query.city = req.query.city;
    }
    
    // Query nested array
    if (req.query.facilities) {
      query.facilities = {
        $all: Array.isArray(req.query.facilities)
          ? req.query.facilities
          : [req.query.facilities]
      };
    }
    
    // Query nested object field
    if (req.query.petPolicy) {
      query["policies.petPolicy"] = req.query.petPolicy;
    }
    
    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error searching hotels" });
  }
};
```

---

## 🎯 Operators Quan Trọng

### **1. $set - Set giá trị**

```typescript
// Update nested field
await Hotel.findByIdAndUpdate(id, {
  $set: {
    "contact.phone": "123-456-7890"
  }
});
```

### **2. $push - Thêm vào array**

```typescript
// Thêm vào array
await Hotel.findByIdAndUpdate(id, {
  $push: {
    facilities: "WiFi"
  }
});
```

### **3. $pull - Xóa khỏi array**

```typescript
// Xóa khỏi array
await Hotel.findByIdAndUpdate(id, {
  $pull: {
    facilities: "Pool"
  }
});
```

### **4. $addToSet - Thêm nếu chưa có**

```typescript
// Chỉ thêm nếu chưa tồn tại
await Hotel.findByIdAndUpdate(id, {
  $addToSet: {
    facilities: "WiFi"  // Chỉ thêm nếu chưa có "WiFi"
  }
});
```

### **5. $ - Update phần tử trong array**

```typescript
// Update phần tử đầu tiên tìm thấy
await Hotel.updateOne(
  { _id: id, "reviews.userId": "user123" },
  {
    $set: {
      "reviews.$.rating": 5  // $ = phần tử được tìm thấy
    }
  }
);
```

### **6. $all - Tất cả phần tử trong array**

```typescript
// Tìm hotels có TẤT CẢ facilities
await Hotel.find({
  facilities: { $all: ["WiFi", "Pool", "Gym"] }
});
```

### **7. $in - Ít nhất 1 phần tử trong array**

```typescript
// Tìm hotels có ÍT NHẤT 1 facility
await Hotel.find({
  facilities: { $in: ["WiFi", "Pool"] }
});
```

---

## ⚠️ Lưu Ý Quan Trọng

### **1. Dot Notation (Dấu chấm)**

```typescript
// ✅ ĐÚNG - Dùng dấu chấm để truy cập nested field
query["contact.email"] = "test@email.com";
query["policies.checkInTime"] = "14:00";

// ❌ SAI - Không thể dùng object
query.contact.email = "test@email.com";  // Không hoạt động trong query
```

### **2. FormData với Nested Fields**

Khi frontend gửi FormData, nested fields được gửi dạng string:

```typescript
// Frontend gửi:
FormData.append("contact.phone", "123-456-7890");
FormData.append("contact.email", "test@email.com");

// Backend nhận:
req.body["contact.phone"]  // ✅ Đúng
req.body.contact.phone     // ❌ Undefined
```

### **3. Update Nested Object**

```typescript
// ❌ SAI - Sẽ ghi đè toàn bộ nested object
await Hotel.findByIdAndUpdate(id, {
  contact: { phone: "123" }  // Sẽ mất email, website
});

// ✅ ĐÚNG - Update từng field riêng
await Hotel.findByIdAndUpdate(id, {
  $set: {
    "contact.phone": "123"  // Chỉ update phone, giữ nguyên email, website
  }
});
```

### **4. Array vs Object**

```typescript
// Array - Dùng [] trong schema
facilities: [String]  // Array of strings

// Object - Dùng {} trong schema
contact: {
  phone: String,
  email: String
}
```

---

## 📋 Best Practices

### **1. Khi nào dùng Nested Fields?**

✅ **Nên dùng khi:**
- Dữ liệu ít thay đổi
- Dữ liệu chỉ thuộc về 1 document
- Không cần query riêng biệt
- Dữ liệu nhỏ (< 16MB)

❌ **Không nên dùng khi:**
- Dữ liệu thay đổi thường xuyên
- Cần query riêng biệt
- Dữ liệu lớn
- Cần join với documents khác

### **2. Naming Convention**

```typescript
// ✅ TỐT - Tên rõ ràng
contact: {
  phone: String,
  email: String
}

policies: {
  checkInTime: String,
  checkOutTime: String
}

// ❌ KHÔNG TỐT - Tên không rõ ràng
info: {
  a: String,
  b: String
}
```

### **3. Validation**

```typescript
const hotelSchema = new mongoose.Schema({
  contact: {
    phone: { 
      type: String, 
      validate: {
        validator: (v) => /^\d{3}-\d{3}-\d{4}$/.test(v),
        message: "Phone format is invalid"
      }
    },
    email: { 
      type: String, 
      required: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Email format is invalid"
      }
    }
  }
});
```

---

## 🎓 Tóm Tắt

### **Nested Fields = Object/Array trong Document**

1. **Nested Object**: `contact: { phone, email }`
2. **Nested Array**: `facilities: ["WiFi", "Pool"]`
3. **Nested Array of Objects**: `reviews: [{ userId, rating }]`

### **Query:**
- Dùng dot notation: `"contact.email"`
- Operators: `$all`, `$in`, `$push`, `$pull`

### **Update:**
- `$set` để update nested field
- `$push` để thêm vào array
- `$pull` để xóa khỏi array

### **Lưu ý:**
- FormData gửi nested fields dạng `"contact.phone"`
- Dùng dot notation trong query
- Cẩn thận khi update nested object (dùng `$set`)

---

**Chúc bạn học tốt! 🚀**

