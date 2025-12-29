# 🧪 Hướng Dẫn Test APIs

## ⚠️ QUAN TRỌNG

**MongoDB Compass Shell (mongosh) ≠ Terminal!**
- ❌ **KHÔNG THỂ** chạy `curl` trong MongoDB Compass Shell
- ✅ **CHỈ CÓ THỂ** chạy MongoDB commands trong mongosh
- ✅ **Test APIs** phải dùng **Terminal** hoặc **Postman**

---

## 📊 Đánh Giá Use Cases (Theo rule.md)

| STT | Use Case | Tác nhân | Trạng thái | APIs |
|:---:|:---------|:---------|:----------:|:-----|
| 1 | **Tìm kiếm Khách sạn/Phòng** | Khách hàng | ✅ **SẴN SÀNG** | `GET /api/hotels/search`<br>`GET /api/v2/rooms/available` |
| 2 | **Đăng ký Tài khoản** | Khách hàng | ✅ **SẴN SÀNG** | `POST /api/users/register` |
| 3 | **Đăng nhập** | Khách hàng, Lễ tân, Quản lý | ✅ **SẴN SÀNG** | `POST /api/auth/login` |
| 4 | **Đặt phòng** | Khách hàng | ✅ **SẴN SÀNG** | `POST /api/hotels/:hotelId/bookings` |
| 5 | **Thanh toán Trực tuyến (PayOS)** | Khách hàng | ✅ **SẴN SÀNG** | `POST /api/hotels/:hotelId/bookings/payment-intent` |
| 6 | **Quản lý Đặt phòng (Xem/Hủy)** | Khách hàng | ✅ **SẴN SÀNG** | `GET /api/my-bookings`<br>`DELETE /api/my-bookings/:id` |
| 7 | **Quản lý Đặt phòng (Sửa/Hủy Đơn)** | Lễ tân | ✅ **SẴN SÀNG** | `PUT /api/bookings/:id`<br>`PATCH /api/bookings/:id/status`<br>`GET /api/bookings` |
| 8 | **Yêu cầu Dịch vụ** | Khách hàng | ✅ **SẴN SÀNG** | `POST /api/v2/service-requests`<br>`GET /api/v2/service-requests` |
| 9 | **Thực hiện Check-in** | Lễ tân | ✅ **SẴN SÀNG** | `POST /api/v2/booking-operations/check-in` |
| 10 | **Thực hiện Check-out** | Lễ tân | ✅ **SẴN SÀNG** | `POST /api/v2/booking-operations/check-out` |
| 11 | **Quản lý Danh mục Phòng & KS** | Quản lý | ✅ **SẴN SÀNG** | `POST /api/my-hotels`<br>`GET /api/my-hotels`<br>`PUT /api/my-hotels/:hotelId`<br>`POST /api/v2/rooms`<br>`PATCH /api/v2/rooms/:id`<br>`DELETE /api/v2/rooms/:id` |
| 12 | **Quản lý Giá & Khuyến mãi** | Quản lý | ✅ **SẴN SÀNG** | `POST /api/v2/promotions`<br>`GET /api/v2/promotions`<br>`GET /api/v2/promotions/active`<br>`PATCH /api/v2/promotions/:id`<br>`DELETE /api/v2/promotions/:id` |
| 13 | **Quản lý Tài khoản Nhân viên** | Quản lý | ✅ **SẴN SÀNG** | `POST /api/v2/employees`<br>`GET /api/v2/employees`<br>`PATCH /api/v2/employees/:id`<br>`DELETE /api/v2/employees/:id` |
| 14 | **Xem Báo cáo Thống kê** | Quản lý | ✅ **SẴN SÀNG** | `GET /api/business-insights/dashboard`<br>`GET /api/business-insights/forecast`<br>`GET /api/business-insights/performance` |

### 📈 Tổng Kết
- ✅ **Đã sẵn sàng:** 14/14 use cases (100%) 🎉
- ✅ **Hoàn thành:** Tất cả use cases đã có APIs đầy đủ trong Express backend

---

## 📋 Danh Sách APIs Đầy Đủ (Đã Xác Nhận ✅)

### **Express APIs (Core)**
```
# Authentication & Users
POST   /api/auth/login                 # ✅ UC 3
POST   /api/users/register             # ✅ UC 2
GET    /api/auth/validate-token
POST   /api/auth/logout

# Hotels & Search
GET    /api/hotels/search              # ✅ UC 1
GET    /api/hotels                     # ✅ UC 1
GET    /api/hotels/:id                 # ✅ UC 1
POST   /api/my-hotels                  # ✅ UC 11
GET    /api/my-hotels                  # ✅ UC 11
GET    /api/my-hotels/:id              # ✅ UC 11
PUT    /api/my-hotels/:hotelId         # ✅ UC 11

# Bookings
POST   /api/hotels/:hotelId/bookings/payment-intent  # ✅ UC 5
POST   /api/hotels/:hotelId/bookings   # ✅ UC 4
GET    /api/my-bookings                # ✅ UC 6
DELETE /api/my-bookings/:id            # ✅ UC 6
GET    /api/bookings                   # ✅ UC 7 (Receptionist/Manager/Hotel Owner)
PUT    /api/bookings/:id                # ✅ UC 7 (Receptionist)
PATCH  /api/bookings/:id/status        # ✅ UC 7 (Receptionist)

# Rooms
POST   /api/v2/rooms                   # ✅ UC 11
GET    /api/v2/rooms                   # ✅ UC 1, UC 11
GET    /api/v2/rooms/available         # ✅ UC 1
GET    /api/v2/rooms/:id               # ✅ UC 11
PATCH  /api/v2/rooms/:id               # ✅ UC 11
PATCH  /api/v2/rooms/:id/status       # ✅ UC 11
DELETE /api/v2/rooms/:id               # ✅ UC 11

# Service Requests
POST   /api/v2/service-requests        # ✅ UC 8
GET    /api/v2/service-requests        # ✅ UC 8
GET    /api/v2/service-requests/:id   # ✅ UC 8
GET    /api/v2/service-requests/booking/:bookingId/total  # ✅ UC 8
PATCH  /api/v2/service-requests/:id   # ✅ UC 8
DELETE /api/v2/service-requests/:id   # ✅ UC 8

# Booking Operations
POST   /api/v2/booking-operations/check-in   # ✅ UC 9
POST   /api/v2/booking-operations/check-out   # ✅ UC 10

# Business Insights
GET    /api/business-insights/dashboard       # ✅ UC 14
GET    /api/business-insights/forecast        # ✅ UC 14
GET    /api/business-insights/performance    # ✅ UC 14

# Payments
POST   /api/payments/payos-webhook

# Health
GET    /api/health
GET    /api/health/detailed
```

### **Promotions APIs (Use Case 12)**
```
POST   /api/v2/promotions              # ✅ Tạo khuyến mãi mới (Manager)
GET    /api/v2/promotions              # ✅ Lấy danh sách khuyến mãi (Manager)
GET    /api/v2/promotions/active       # ✅ Lấy khuyến mãi đang hoạt động (Public)
GET    /api/v2/promotions/:id          # ✅ Lấy thông tin khuyến mãi
PATCH  /api/v2/promotions/:id          # ✅ Cập nhật khuyến mãi (Manager)
DELETE /api/v2/promotions/:id          # ✅ Xóa khuyến mãi (Manager)
POST   /api/v2/promotions/:id/increment-usage  # ✅ Tăng số lần sử dụng
```

### **Employees APIs (Use Case 13)**
```
POST   /api/v2/employees               # ✅ Tạo nhân viên mới (Manager)
GET    /api/v2/employees               # ✅ Lấy danh sách nhân viên (Manager)
GET    /api/v2/employees/role/:role  # ✅ Lấy nhân viên theo role (Manager)
GET    /api/v2/employees/:id          # ✅ Lấy thông tin nhân viên (Manager)
PATCH  /api/v2/employees/:id          # ✅ Cập nhật nhân viên (Manager)
DELETE /api/v2/employees/:id          # ✅ Xóa (deactivate) nhân viên (Manager)
PATCH  /api/v2/employees/:id/password # ✅ Đổi mật khẩu nhân viên (Manager)
PATCH  /api/v2/employees/:id/activate # ✅ Kích hoạt nhân viên (Manager)
```

---

## 🧪 Cách Test APIs

### **Cách 1: Dùng Terminal (Mac/Linux)**

Mở **Terminal** (không phải MongoDB Compass Shell) và chạy:


### **Cách 2: Dùng Postman (Khuyến Nghị ✅)**

1. **Tải Postman:** https://www.postman.com/downloads/
2. **Tạo Collection mới:** "Smart Hotel APIs"
3. **Thêm các requests:**

#### **Request 1: Register User**
- Method: `POST`
- URL: `http://localhost:7002/api/users/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

#### **Request 2: Login**
- Method: `POST`
- URL: `http://localhost:7002/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Lưu ý:** Sau khi login, JWT token sẽ được lưu trong cookie. Postman sẽ tự động lưu cookie.

#### **Request 3: Create Room**
- Method: `POST`
- URL: `http://localhost:7002/api/v2/rooms`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "hotelId": "YOUR_HOTEL_ID_HERE",
  "roomNumber": "101",
  "roomType": "DOUBLE",
  "basePrice": 500000,
  "maxOccupancy": 2
}
```

#### **Request 4: Get Rooms**
- Method: `GET`
- URL: `http://localhost:7002/api/v2/rooms?hotelId=YOUR_HOTEL_ID_HERE`

### **Cách 3: Dùng Swagger UI (Dễ Nhất ✅)**

1. **Chạy backend:** `npm run dev`
2. **Mở browser:** `http://localhost:7002/api-docs`
3. **Test trực tiếp trên Swagger UI** - Không cần Postman!

---

## 🗄️ Tạo Database Bằng MongoDB Shell

### **Cách 1: Tự Động (Khuyến Nghị) ✅**

**MongoDB tự động tạo database và collections khi bạn insert document đầu tiên!**

Chỉ cần chạy backend và gọi APIs, MongoDB sẽ tự động tạo mọi thứ.

### **Cách 2: Tạo Thủ Công**

#### **Option A: Copy Script vào MongoDB Compass Shell**

1. Mở MongoDB Compass
2. Click vào tab "mongosh" (shell)
3. Copy toàn bộ nội dung từ `scripts/create-database.js`
4. Paste vào shell và Enter

#### **Option B: Chạy Script từ Terminal**

```bash
# Từ thư mục backend
mongosh < scripts/create-database.js
```

---

## 📝 Lệnh MongoDB Shell Hữu Ích

### **Kiểm Tra Database**
```javascript
// Xem tất cả databases
show dbs;

// Chuyển sang database
use SmartHotel;

// Xem tất cả collections
show collections;

// Đếm số documents
db.users.countDocuments();
db.hotels.countDocuments();
db.bookings.countDocuments();

// Xem documents (5 đầu tiên)
db.users.find().limit(5).pretty();
db.hotels.find().limit(5).pretty();
```

### **Xóa Dữ Liệu (Cẩn Thận!)**
```javascript
// Xóa tất cả documents trong collection
db.users.deleteMany({});

// Xóa collection
db.users.drop();

// Xóa database (phải chuyển sang database khác trước)
use admin;
db.dropDatabase("SmartHotel");
```

---

## ✅ Checklist Trước Khi Test

- [ ] Backend đang chạy (`npm run dev`)
- [ ] MongoDB đang chạy (localhost:27017)
- [ ] Database `SmartHotel` đã được tạo (tự động hoặc thủ công)
- [ ] Đã có ít nhất 1 hotel trong database (để test rooms)
- [ ] Đã có JWT token (sau khi login)

---

## 🎯 Tóm Tắt

1. **MongoDB tự động tạo database/collections** khi insert document đầu tiên
2. **Test APIs** bằng Terminal, Postman, hoặc Swagger UI
3. **KHÔNG thể test APIs** trong MongoDB Compass Shell
4. **MongoDB Shell** chỉ dùng để query/update data, không phải test HTTP APIs

---

**🚀 Bắt đầu test ngay tại:** `http://localhost:7002/api-docs` (Swagger UI)

---

## 📝 Hướng Dẫn Test Từng API Chi Tiết

### **API 1: Health Check (Không cần auth)**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/health`  
**Headers:** Không cần  
**Body:** Không cần

**Kết quả mong đợi:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

---

### **API 2: Đăng ký User**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/users/register`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "User đăng kí thành công"
}
```
**Lưu ý:** Cookie JWT sẽ được set tự động.

---

### **API 3: Đăng nhập (Lưu cookie)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Lưu ý về Cookies trong Postman:**
- Postman **mặc định tự động quản lý cookies** - không cần bật setting
- Sau khi login, cookie JWT sẽ được lưu tự động
- Để xem cookies: Click vào tab **"Cookies"** ở dưới URL bar (sau khi gửi request)
- Hoặc: Settings → **"Data"** tab → "Manage Cookies"

**Kết quả mong đợi:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

**⚠️ QUAN TRỌNG:**
1. **Copy token** từ response (field `token`)
2. **Dùng token này** cho các API cần authentication:
   - Tab **"Authorization"** → Chọn **"Bearer Token"** → Dán token
   - HOẶC tab **"Headers"** → Thêm `Authorization: Bearer YOUR_TOKEN`

---

### **API 4: Tạo Hotel (Cần đăng nhập) ⚠️**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/my-hotels` ⚠️ **Có chữ "s" ở cuối!**  

**⚠️ QUAN TRỌNG - Authentication:**
1. **Login trước** (API 3) để lấy token
2. **Thêm Authorization header:**
   - Tab **"Authorization"** → Chọn **"Bearer Token"** → Dán token
   - HOẶC tab **"Headers"** → Thêm:
     - Key: `Authorization`
     - Value: `Bearer YOUR_TOKEN_HERE`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer YOUR_TOKEN_HERE
```

**⚠️ LƯU Ý:**
- API này **YÊU CẦU** `multipart/form-data` (có upload file)
- **KHÔNG THỂ** dùng JSON raw!
- **BẮT BUỘC** phải có Authorization header với Bearer token

**Body (form-data trong Postman):**
1. Chọn tab **"Body"**
2. Chọn **"form-data"** (KHÔNG phải raw JSON!)
3. **⚠️ BẮT BUỘC** - Thêm các fields sau (KHÔNG được thiếu):
   - `name`: `My Test Hotel` ⚠️ **BẮT BUỘC**
   - `city`: `Hồ Chí Minh` ⚠️ **BẮT BUỘC**
   - `country`: `Việt Nam` ⚠️ **BẮT BUỘC**
   - `description`: `Khách sạn test đẹp` ⚠️ **BẮT BUỘC**
   - `type`: `business,luxury` (hoặc `["business","luxury"]`)
   - `adultCount`: `2`
   - `childCount`: `1`
   - `facilities`: `WiFi,Pool,Gym` (hoặc `["WiFi","Pool","Gym"]`)
   - `pricePerNight`: `2000000`
   - `starRating`: `5`
   - `imageFiles`: Chọn file (Key phải là `imageFiles`, Type: **File**)

**⚠️ LƯU Ý:**
- `name`, `city`, `country`, `description` là **BẮT BUỘC** - thiếu sẽ báo lỗi 400
- `imageFiles` phải chọn Type là **"File"** (không phải Text)

**Hoặc dùng raw JSON (nếu không có ảnh):**
```json
{
  "name": "My Test Hotel",
  "city": "Hồ Chí Minh",
  "country": "Việt Nam",
  "description": "Khách sạn test đẹp",
  "type": ["business", "luxury"],
  "adultCount": 2,
  "childCount": 1,
  "facilities": ["WiFi", "Pool", "Gym"],
  "pricePerNight": 2000000,
  "starRating": 5
}
```
⚠️ **Lưu ý:** Nếu dùng JSON, không có `imageUrls` - API sẽ tự tạo mảng rỗng.

**Kết quả:** Hotel đã được tạo  
**⚠️ QUAN TRỌNG:** Copy `_id` của hotel để dùng cho các API sau (thay `YOUR_HOTEL_ID`).

---

### **API 5: Lấy danh sách Hotels**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/hotels/search?city=Hồ Chí Minh`  
**Headers:** Không cần

**Kết quả:** Danh sách hotels

---

### **API 6: Tạo Room (V2 - Cần hotelId)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/rooms`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON) - Thay `YOUR_HOTEL_ID` bằng hotelId từ API 4:**
```json
{
  "hotelId": "YOUR_HOTEL_ID",
  "roomNumber": "101",
  "roomType": "DOUBLE",
  "basePrice": 2000000,
  "maxOccupancy": 2,
  "bedType": "King Size",
  "amenities": ["WiFi", "TV", "Mini Bar"],
  "floor": 1
}
```

**Kết quả:** Room đã được tạo

---

### **API 7: Lấy danh sách Rooms**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/rooms?hotelId=YOUR_HOTEL_ID`  
**Headers:** Không cần

**Kết quả:** Danh sách rooms

**Query params tùy chọn:**
- `status`: Filter theo status (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)

---

### **API 8: Tìm phòng trống**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/rooms/available?hotelId=YOUR_HOTEL_ID&checkIn=2024-12-25&checkOut=2024-12-27`  
**Headers:** Không cần

**Query params:**
- `hotelId`: ID của hotel (bắt buộc)
- `checkIn`: Ngày check-in (bắt buộc)
- `checkOut`: Ngày check-out (bắt buộc)

**Kết quả:** Danh sách phòng trống trong khoảng thời gian

---

### **API 9: Tạo Booking**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/hotels/YOUR_HOTEL_ID/bookings`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "checkIn": "2024-12-25T14:00:00.000Z",
  "checkOut": "2024-12-27T11:00:00.000Z",
  "adultCount": 2,
  "childCount": 1,
  "totalCost": 4000000
}
```

**Kết quả:** Booking đã được tạo  
**⚠️ QUAN TRỌNG:** Copy `_id` của booking để dùng cho các API sau (thay `YOUR_BOOKING_ID`).

---

### **API 10: Lấy danh sách Bookings của User**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/my-bookings`  
**Headers:** Không cần (cookie tự động)

**Kết quả:** Danh sách bookings của user hiện tại

---

### **API 11: Tạo Service Request (V2 - Cần bookingId)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/service-requests`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON) - Thay `YOUR_BOOKING_ID`, `YOUR_USER_ID`, `YOUR_HOTEL_ID`:**
```json
{
  "bookingId": "YOUR_BOOKING_ID",
  "userId": "YOUR_USER_ID",
  "hotelId": "YOUR_HOTEL_ID",
  "serviceType": "room_service",
  "description": "Yêu cầu dọn phòng vào 10h sáng",
  "price": 200000
}
```

**Service types hợp lệ:**
- `room_service`
- `laundry`
- `cleaning`
- `food`
- `transport`
- `minibar`
- `other`

**Kết quả:** Service request đã được tạo

---

### **API 12: Lấy danh sách Service Requests**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/service-requests?bookingId=YOUR_BOOKING_ID`  
**Headers:** Không cần

**Query params tùy chọn:**
- `bookingId`: Filter theo booking
- `userId`: Filter theo user
- `hotelId`: Filter theo hotel
- `status`: Filter theo status (pending, in_progress, completed, cancelled)

**Kết quả:** Danh sách service requests

---

### **API 13: Tính tổng chi phí Service Requests**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/service-requests/booking/YOUR_BOOKING_ID/total`  
**Headers:** Không cần

**Kết quả:**
```json
{
  "bookingId": "...",
  "totalCost": 200000,
  "serviceCount": 1
}
```

---

### **API 14: Check-in (V2 - Cần bookingId)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/booking-operations/check-in`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "bookingId": "YOUR_BOOKING_ID",
  "roomId": "YOUR_ROOM_ID"
}
```

**Lưu ý:**
- `roomId` là tùy chọn
- Booking phải có `paymentStatus = "paid"` và `status = "confirmed"`
- Nếu có `roomId`, room sẽ được update status = "OCCUPIED"

**Kết quả:** Booking đã được check-in

---

### **API 15: Check-out (V2 - Cần bookingId)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/booking-operations/check-out`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "bookingId": "YOUR_BOOKING_ID",
  "extraCharges": 500000
}
```

**Lưu ý:**
- `extraCharges` là tùy chọn
- Booking phải có `status = "checked_in"`
- Sẽ tính `finalTotalCost = totalCost + serviceRequestsTotal + extraCharges`
- Room sẽ được update status = "AVAILABLE"

**Kết quả:**
```json
{
  "message": "Check-out thành công",
  "booking": { ... },
  "summary": {
    "originalCost": 4000000,
    "serviceRequestsTotal": 200000,
    "additionalCharges": 500000,
    "finalTotalCost": 4700000
  },
  "serviceRequests": [ ... ]
}
```

---

### **API 16: Xem Tất Cả Bookings (Receptionist/Manager/Hotel Owner)**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/bookings`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Lưu ý:**
- **Receptionist & Manager:** Xem tất cả bookings trong hệ thống
- **Hotel Owner:** Chỉ xem bookings của khách sạn mình sở hữu
- Cần role: `receptionist`, `manager`, hoặc `hotel_owner`

**Kết quả:**
```json
{
  "message": "Lấy danh sách bookings thành công",
  "count": 10,
  "bookings": [
    {
      "_id": "...",
      "userId": { "firstName": "...", "lastName": "...", "email": "..." },
      "hotelId": { "name": "...", "city": "...", "country": "..." },
      "status": "confirmed",
      "checkIn": "...",
      "checkOut": "...",
      ...
    }
  ]
}
```

---

### **API 17: Update Booking Status (Receptionist)**

**Method:** `PATCH`  
**URL:** `http://localhost:7002/api/bookings/YOUR_BOOKING_ID/status`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "status": "confirmed",
  "cancellationReason": null
}
```

**Status hợp lệ:**
- `pending`
- `confirmed`
- `cancelled`
- `checked_in`
- `completed`

**Kết quả:** Booking status đã được update

---

### **API 18: Update Booking (Receptionist)**

**Method:** `PUT`  
**URL:** `http://localhost:7002/api/bookings/YOUR_BOOKING_ID`  
**Headers:**
```
Content-Type: application/json
```
**Body (raw JSON):**
```json
{
  "checkIn": "2024-12-25T14:00:00.000Z",
  "checkOut": "2024-12-27T11:00:00.000Z",
  "adultCount": 2,
  "childCount": 1,
  "totalCost": 4000000
}
```

**Kết quả:** Booking đã được update

---

### **API 19: Xóa Booking (Customer/Receptionist)**

**Method:** `DELETE`  
**URL:** `http://localhost:7002/api/my-bookings/YOUR_BOOKING_ID`  
**Headers:** Không cần (cookie tự động)

**Kết quả:** Booking đã được xóa

---

### **API 20: Tạo Khuyến mãi (Manager - UC 12)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/promotions`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```
**Body (raw JSON):**
```json
{
  "hotelId": "YOUR_HOTEL_ID",
  "name": "Giảm giá 20%",
  "description": "Khuyến mãi đặc biệt cho khách hàng",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "startDate": "2024-12-25T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "minStay": 2,
  "maxUsage": 100,
  "isActive": true
}
```

**Lưu ý:**
- `hotelId` là tùy chọn (null = áp dụng cho tất cả hotels)
- `discountType`: `PERCENTAGE` hoặc `FIXED_AMOUNT`
- `discountValue`: Nếu PERCENTAGE thì <= 100
- `startDate` phải trước `endDate` và không thể là quá khứ

**Kết quả:** Khuyến mãi đã được tạo

---

### **API 21: Lấy danh sách Khuyến mãi (Manager - UC 12)**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/promotions?hotelId=YOUR_HOTEL_ID&isActive=true`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query params tùy chọn:**
- `hotelId`: Filter theo hotel
- `isActive`: Filter theo trạng thái (true/false)
- `currentDate`: Filter khuyến mãi đang hoạt động tại ngày này

**Kết quả:** Danh sách khuyến mãi

---

### **API 22: Lấy Khuyến mãi Đang Hoạt Động (Public - UC 12)**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/promotions/active?hotelId=YOUR_HOTEL_ID`  
**Headers:** Không cần auth

**Query params tùy chọn:**
- `hotelId`: Filter theo hotel

**Kết quả:** Danh sách khuyến mãi đang hoạt động

---

### **API 23: Tạo Nhân viên (Manager - UC 13)**

**Method:** `POST`  
**URL:** `http://localhost:7002/api/v2/employees`  
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```
**Body (raw JSON):**
```json
{
  "email": "receptionist@hotel.com",
  "password": "password123",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "role": "receptionist",
  "phone": "0123456789",
  "isActive": true
}
```

**Lưu ý:**
- `role` phải là: `receptionist`, `manager`, hoặc `hotel_owner`
- `password` phải có ít nhất 6 ký tự
- Email phải unique

**Kết quả:** Nhân viên đã được tạo

---

### **API 24: Lấy danh sách Nhân viên (Manager - UC 13)**

**Method:** `GET`  
**URL:** `http://localhost:7002/api/v2/employees?role=receptionist&page=1&limit=10`  
**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Query params tùy chọn:**
- `companyId`: Filter theo company
- `role`: Filter theo role (`receptionist`, `manager`, `hotel_owner`)
- `isActive`: Filter theo trạng thái (true/false)
- `page`: Số trang (mặc định: 1)
- `limit`: Số items mỗi trang (mặc định: 10, max: 100)

**Kết quả:** Danh sách nhân viên với pagination

---

## 🔄 Thứ Tự Test Khuyến Nghị

### **Flow Cơ Bản (Customer)**
1. **API 1** - Health Check (kiểm tra server)
2. **API 2** - Register User
3. **API 3** - Login (lưu token)
4. **API 4** - Tìm kiếm Hotels (`GET /api/hotels/search`)
5. **API 5** - Tạo Booking (`POST /api/hotels/:hotelId/bookings/payment-intent`)
6. **API 6** - Thanh toán PayOS (redirect)
7. **API 7** - Tạo Booking sau thanh toán (`POST /api/hotels/:hotelId/bookings`)
8. **API 8** - Xem Bookings của mình (`GET /api/my-bookings`)
9. **API 9** - Tạo Service Request (`POST /api/v2/service-requests`)
10. **API 10** - Hủy Booking (`DELETE /api/my-bookings/:id`)

### **Flow Quản Lý (Manager/Hotel Owner)**
1. **API 3** - Login với role `manager` hoặc `hotel_owner`
2. **API 11** - Tạo Hotel (`POST /api/my-hotels`)
3. **API 12** - Tạo Room (`POST /api/v2/rooms`)
4. **API 13** - Xem Tất Cả Bookings (`GET /api/bookings`)
5. **API 14** - Xem Business Insights (`GET /api/business-insights/dashboard`)
6. **API 20** - Tạo Khuyến mãi (`POST /api/v2/promotions`)
7. **API 21** - Tạo Nhân viên (`POST /api/v2/employees`)

### **Flow Lễ Tân (Receptionist)**
1. **API 3** - Login với role `receptionist`
2. **API 13** - Xem Tất Cả Bookings (`GET /api/bookings`)
3. **API 15** - Check-in (`POST /api/v2/booking-operations/check-in`)
4. **API 16** - Check-out (`POST /api/v2/booking-operations/check-out`)
5. **API 17** - Update Booking Status (`PATCH /api/bookings/:id/status`)
6. **API 18** - Update Booking (`PUT /api/bookings/:id`)

---

## ⚠️ Lưu Ý Quan Trọng

1. **Cookie JWT trong Postman:**
   - Postman **mặc định tự động quản lý cookies** - không cần bật setting
   - Sau khi login (API 3), cookie JWT sẽ được lưu tự động
   - Các API cần auth sẽ tự động dùng cookie này
   - **Xem cookies:** Click tab **"Cookies"** ở dưới URL bar (sau khi gửi request)
   - **Quản lý cookies:** Settings → **"Data"** tab → "Manage Cookies"

2. **ID Variables:** 
   - `YOUR_HOTEL_ID` - Lấy từ API 4
   - `YOUR_BOOKING_ID` - Lấy từ API 9
   - `YOUR_USER_ID` - Lấy từ API 2 hoặc API 3
   - `YOUR_ROOM_ID` - Lấy từ API 6 hoặc API 7

3. **Thứ tự thao tác:**
   - Phải có Hotel trước khi tạo Room
   - Phải có Booking trước khi tạo Service Request
   - Phải có Booking với status "confirmed" và payment "paid" trước khi check-in
   - Phải check-in trước khi check-out

4. **Status Flow:**
   - Booking: `pending` → `confirmed` → `checked_in` → `completed`
   - Service Request: `pending` → `in_progress` → `completed`
   - Room: `AVAILABLE` → `OCCUPIED` → `AVAILABLE` (sau check-out)

5. **Role Permissions:**
   - **Customer:** Xem/hủy booking của mình, tạo service request
   - **Receptionist:** Xem tất cả bookings, update booking, check-in/out, hủy booking
   - **Manager:** Xem tất cả bookings, quản lý hotels/rooms/promotions/employees, xem báo cáo
   - **Hotel Owner:** Xem bookings của hotel mình, quản lý hotels/rooms

6. **Use Cases Đã Hoàn Thành:**
   - ✅ **UC 12 - Quản lý Giá & Khuyến mãi:** Đã có đầy đủ APIs `/api/v2/promotions`
   - ✅ **UC 13 - Quản lý Tài khoản Nhân viên:** Đã có đầy đủ APIs `/api/v2/employees`

