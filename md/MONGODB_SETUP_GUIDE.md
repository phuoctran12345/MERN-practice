# 🗄️ Hướng Dẫn Tạo Database MongoDB Bằng Dòng Lệnh

## ⚠️ LƯU Ý QUAN TRỌNG

**MongoDB Compass Shell (mongosh) ≠ Terminal!**
- ❌ **KHÔNG THỂ** chạy `curl` trong MongoDB shell
- ✅ **CHỈ CÓ THỂ** chạy MongoDB commands (CRUD, queries, indexes)
- ✅ Để test APIs, dùng **Terminal** hoặc **Postman**

---

## 📋 Danh Sách APIs (Đã Xác Nhận ✅)

### **Express APIs (Legacy)**
```
POST   /api/auth/login
POST   /api/users/register
GET    /api/hotels/search
POST   /api/hotels/:id/bookings
GET    /api/my-bookings
DELETE /api/my-bookings/:id
PUT    /api/bookings/:id              # ✅ UC 7
PATCH  /api/bookings/:id/status      # ✅ UC 7
GET    /api/business-insights/dashboard
```

### **NestJS APIs (New Features)**
```
# Rooms
POST   /api/v2/rooms
GET    /api/v2/rooms
GET    /api/v2/rooms/available

# Service Requests  
POST   /api/v2/service-requests
GET    /api/v2/service-requests

# Check-in/out
POST   /api/v2/booking-operations/check-in
POST   /api/v2/booking-operations/check-out

# Promotions (UC 12)
POST   /api/v2/promotions
GET    /api/v2/promotions
GET    /api/v2/promotions/active
PATCH  /api/v2/promotions/:id
DELETE /api/v2/promotions/:id

# Pricing (UC 12)
POST   /api/v2/pricing/seasonal
GET    /api/v2/pricing/seasonal
GET    /api/v2/pricing/current
GET    /api/v2/pricing/range
PATCH  /api/v2/pricing/seasonal/:id
DELETE /api/v2/pricing/seasonal/:id

# Employees (UC 13)
POST   /api/v2/employees            # Admin/Manager only
GET    /api/v2/employees            # Admin/Manager only
PATCH  /api/v2/employees/:id        # Admin/Manager only
DELETE /api/v2/employees/:id        # Admin/Manager only
PATCH  /api/v2/employees/:id/password
```

---

## 🗄️ Tạo Database & Collections Bằng MongoDB Shell

### **Cách 1: Tự Động (Khuyến Nghị) ✅**

**MongoDB tự động tạo database và collections khi bạn insert document đầu tiên!**

Khi bạn chạy backend và gọi API:
```bash
# Backend tự động tạo:
- Database: SmartHotel (hoặc tên trong connection string)
- Collections: users, hotels, bookings, rooms, etc.
```

**Không cần tạo thủ công!** Mongoose sẽ tự động tạo khi cần.

---

### **Cách 2: Tạo Thủ Công Bằng MongoDB Shell**

Nếu bạn muốn tạo trước, mở **MongoDB Compass Shell** và chạy:

```javascript
// 1. Chuyển sang database SmartHotel (tự động tạo nếu chưa có)
use SmartHotel;

// 2. Tạo collections (tự động tạo khi insert document đầu tiên)
// Nhưng bạn có thể tạo trước với schema validation:

// ============================================
// COLLECTION: users
// ============================================
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "firstName", "lastName"],
      properties: {
        email: { bsonType: "string", description: "Email phải là string và unique" },
        password: { bsonType: "string", description: "Password phải là string" },
        firstName: { bsonType: "string", description: "Tên phải là string" },
        lastName: { bsonType: "string", description: "Họ phải là string" },
        role: {
          enum: ["user", "admin", "hotel_owner", "receptionist", "manager"],
          description: "Role phải là một trong các giá trị cho phép"
        }
      }
    }
  }
});

// Tạo index cho email (unique)
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ companyId: 1 });
db.users.createIndex({ role: 1 });

// ============================================
// COLLECTION: companies
// ============================================
db.createCollection("companies");
db.companies.createIndex({ taxId: 1 }, { unique: true });
db.companies.createIndex({ isActive: 1 });

// ============================================
// COLLECTION: hotels
// ============================================
db.createCollection("hotels");
db.hotels.createIndex({ userId: 1 });
db.hotels.createIndex({ companyId: 1 });
db.hotels.createIndex({ city: 1 });
db.hotels.createIndex({ city: 1, starRating: 1 });
db.hotels.createIndex({ pricePerNight: 1, starRating: 1 });

// ============================================
// COLLECTION: rooms
// ============================================
db.createCollection("rooms");
db.rooms.createIndex({ hotelId: 1, roomNumber: 1 }, { unique: true });
db.rooms.createIndex({ hotelId: 1, status: 1 });
db.rooms.createIndex({ roomType: 1 });

// ============================================
// COLLECTION: bookings
// ============================================
db.createCollection("bookings");
db.bookings.createIndex({ userId: 1, createdAt: -1 });
db.bookings.createIndex({ hotelId: 1, checkIn: 1 });
db.bookings.createIndex({ roomId: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ paymentStatus: 1 });

// ============================================
// COLLECTION: servicerequests
// ============================================
db.createCollection("servicerequests");
db.servicerequests.createIndex({ bookingId: 1, status: 1 });
db.servicerequests.createIndex({ userId: 1, createdAt: -1 });
db.servicerequests.createIndex({ hotelId: 1 });

// ============================================
// COLLECTION: promotions
// ============================================
db.createCollection("promotions");
db.promotions.createIndex({ hotelId: 1, isActive: 1 });
db.promotions.createIndex({ startDate: 1, endDate: 1 });
db.promotions.createIndex({ isActive: 1, startDate: 1, endDate: 1 });

// ============================================
// COLLECTION: seasonalpricings
// ============================================
db.createCollection("seasonalpricings");
db.seasonalpricings.createIndex({ hotelId: 1, roomType: 1, isActive: 1 });
db.seasonalpricings.createIndex({ startDate: 1, endDate: 1 });
db.seasonalpricings.createIndex({ hotelId: 1, startDate: 1, endDate: 1 });

// ============================================
// COLLECTION: employees (sử dụng chung với users)
// ============================================
// Employees được lưu trong collection "users" với role khác nhau
// Không cần tạo collection riêng

// ============================================
// COLLECTION: contracts
// ============================================
db.createCollection("contracts");
db.contracts.createIndex({ companyId: 1, status: 1 });
db.contracts.createIndex({ customerId: 1 });
db.contracts.createIndex({ contractCode: 1 }, { unique: true });
db.contracts.createIndex({ expiryDate: 1 });

// ============================================
// COLLECTION: contractfinancials
// ============================================
db.createCollection("contractfinancials");
db.contractfinancials.createIndex({ contractId: 1 }, { unique: true });

// ============================================
// COLLECTION: aicontractanalyses
// ============================================
db.createCollection("aicontractanalyses");
db.aicontractanalyses.createIndex({ contractId: 1 }, { unique: true });
db.aicontractanalyses.createIndex({ riskLevel: 1 });

// ============================================
// COLLECTION: auditlogs
// ============================================
db.createCollection("auditlogs");
db.auditlogs.createIndex({ userId: 1, timestamp: -1 });
db.auditlogs.createIndex({ targetType: 1, targetId: 1 });
db.auditlogs.createIndex({ action: 1, timestamp: -1 });

// ============================================
// COLLECTION: reviews
// ============================================
db.createCollection("reviews");
db.reviews.createIndex({ hotelId: 1, rating: 1 });
db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ bookingId: 1 });

// ============================================
// COLLECTION: analytics
// ============================================
db.createCollection("analytics");
db.analytics.createIndex({ date: 1 }, { unique: true });

// ============================================
// Xác nhận đã tạo xong
// ============================================
show collections;
```

---

## 🧪 Test APIs Bằng Terminal (KHÔNG PHẢI MongoDB Shell)

### **Cách 1: Dùng Terminal (Mac/Linux)**

Mở **Terminal** (không phải MongoDB Compass Shell) và chạy:

```bash
# Test tạo Room
curl -X POST http://localhost:7002/api/v2/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": "YOUR_HOTEL_ID_HERE",
    "roomNumber": "101",
    "roomType": "DOUBLE",
    "basePrice": 500000,
    "maxOccupancy": 2
  }'
```

### **Cách 2: Dùng Postman**

1. Mở Postman
2. Tạo request mới
3. Chọn method: `POST`
4. URL: `http://localhost:7002/api/v2/rooms`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON):
```json
{
  "hotelId": "YOUR_HOTEL_ID_HERE",
  "roomNumber": "101",
  "roomType": "DOUBLE",
  "basePrice": 500000,
  "maxOccupancy": 2
}
```

---

## 📝 Lệnh MongoDB Shell Hữu Ích

### **Kiểm Tra Database & Collections**
```javascript
// Xem tất cả databases
show dbs;

// Chuyển sang database
use SmartHotel;

// Xem tất cả collections
show collections;

// Đếm số documents trong collection
db.users.countDocuments();

// Xem documents
db.users.find().limit(5);
db.hotels.find().limit(5);
db.bookings.find().limit(5);
```

### **Tạo Index**
```javascript
// Tạo index đơn
db.users.createIndex({ email: 1 });

// Tạo unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Tạo compound index
db.bookings.createIndex({ userId: 1, createdAt: -1 });
```

### **Xóa Collection/Database**
```javascript
// Xóa collection
db.users.drop();

// Xóa database (phải chuyển sang database khác trước)
use admin;
db.dropDatabase("SmartHotel");
```

---

## ✅ Tóm Tắt

1. **MongoDB tự động tạo database và collections** khi bạn insert document đầu tiên
2. **Không cần tạo thủ công** - Mongoose sẽ tự động tạo
3. **MongoDB Shell ≠ Terminal** - Không thể chạy `curl` trong mongosh
4. **Test APIs** bằng Terminal hoặc Postman, không phải MongoDB Compass Shell

---

**🎯 Khuyến Nghị:** Chỉ cần chạy backend và gọi APIs, MongoDB sẽ tự động tạo mọi thứ! 🚀

