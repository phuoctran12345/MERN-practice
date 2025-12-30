# MERN-HOTEL-BOOKING

*Transform Your Hotel Experience, Seamlessly Managed*

![license](https://img.shields.io/badge/license-ISC-blue)
![last commit](https://img.shields.io/badge/last%20commit-today-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)
![languages](https://img.shields.io/badge/languages-TypeScript%20%7C%20JavaScript-yellow)

*Built with the tools and technologies:*

![Express](https://img.shields.io/badge/Express-4.18.2-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.2.0-green?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.0.0-red?logo=mongoose)
![Node.js](https://img.shields.io/badge/Node.js-20.9.0-green?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.1-purple?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.11.0-purple?logo=axios)
![PayOS](https://img.shields.io/badge/PayOS-2.0.3-orange?logo=paypal)
![Zustand](https://img.shields.io/badge/Zustand-5.0.9-purple?logo=zustand)
![React Query](https://img.shields.io/badge/React%20Query-3.39.3-orange?logo=react-query)
![Cloudinary](https://img.shields.io/badge/Cloudinary-1.41.0-blue?logo=cloudinary)

---

## 📋 Tổng Quan Dự Án

Hệ thống quản lý đặt phòng khách sạn toàn diện được xây dựng với MERN Stack (MongoDB, Express, React, Node.js) và TypeScript. Hệ thống hỗ trợ quản lý 14 công ty khách sạn với đầy đủ tính năng từ tìm kiếm, đặt phòng, thanh toán đến quản lý nhân viên và khuyến mãi.

### ✨ Tính Năng Chính

- **🔍 Tìm Kiếm Thông Minh**: Tìm kiếm khách sạn và phòng trống theo địa điểm, ngày, giá, số người
- **📅 Quản Lý Đặt Phòng**: Đặt phòng, check-in, check-out, hủy đơn với quy trình hoàn chỉnh
- **💳 Thanh Toán Trực Tuyến**: Tích hợp PayOS cho thanh toán an toàn
- **👥 Quản Lý Người Dùng**: Đăng ký, đăng nhập với phân quyền (Khách hàng, Lễ tân, Quản lý, Chủ khách sạn)
- **🏨 Quản Lý Khách Sạn**: CRUD đầy đủ cho khách sạn, phòng, dịch vụ
- **💰 Quản Lý Giá & Khuyến Mãi**: Thiết lập giá theo mùa và các chương trình khuyến mãi
- **👨‍💼 Quản Lý Nhân Viên**: Tạo và quản lý tài khoản nhân viên
- **📊 Báo Cáo & Thống Kê**: Dashboard với các báo cáo doanh thu, tỷ lệ lấp đầy
- **📱 Responsive Design**: Giao diện tối ưu cho mọi thiết bị

---

## 🏗️ Kiến Trúc Dự Án

```
MERN-HOTEL-BOOKING/
├── backend/                 # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── express/         # Express routes, controllers, middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── services/       # Business logic services
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── .env
├── frontend/                # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── shared/                  # Shared types between frontend & backend
│   └── types.ts
└── README.md
```

---

## 🚀 Bắt Đầu

### Yêu Cầu Hệ Thống

- Node.js >= 18.x
- npm hoặc yarn
- MongoDB (local hoặc MongoDB Atlas)
- Tài khoản Cloudinary (cho upload ảnh)
- Tài khoản PayOS (cho thanh toán)

### 1. Clone Repository

```bash
git clone <repository-url>
cd MERN-HOTEL-BOOKING
```

### 2. Cài Đặt Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Cấu Hình Environment Variables

#### Backend (.env)

```env
# Database
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/hotel-booking

# JWT
JWT_SECRET_KEY=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayOS
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key
PAYOS_ENV=sandbox

# Server
PORT=7000
```

#### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:7000
```

### 4. Chạy Ứng Dụng

#### Backend

```bash
cd backend
npm run dev
```

Server sẽ chạy tại `http://localhost:7000`

#### Frontend

```bash
cd frontend
npm run dev
```

Ứng dụng sẽ mở tại `http://localhost:5174`

---

## 📚 API Documentation

API documentation có sẵn tại `/api/docs` khi chạy backend server.

### Các Endpoint Chính

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/hotels` - Tìm kiếm khách sạn
- `GET /api/v2/rooms/available` - Tìm phòng trống
- `POST /api/my-hotels` - Tạo khách sạn mới
- `POST /api/my-bookings` - Đặt phòng
- `POST /api/payments/create-payment-intent` - Tạo payment link
- `GET /api/bookings` - Xem tất cả bookings (Receptionist/Manager/Owner)
- `PUT /api/bookings/:id` - Cập nhật booking (Receptionist)
- `PATCH /api/bookings/:id/status` - Cập nhật trạng thái (Receptionist)
- `POST /api/v2/promotions` - Tạo khuyến mãi (Manager)
- `POST /api/v2/employees` - Tạo nhân viên (Manager)

Xem chi tiết tại [TEST_APIS.md](./backend/TEST_APIS.md)

---

## 🎨 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **PayOS** - Payment gateway
- **Cloudinary** - Image storage
- **Express Validator** - Input validation
- **Multer** - File upload

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Server state management
- **Zustand** - Global state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icons

---

## 👥 Phân Quyền Người Dùng

| Vai Trò | Quyền Hạn |
|---------|-----------|
| **Khách hàng** | Tìm kiếm, đặt phòng, xem booking của mình, hủy booking |
| **Lễ tân (Receptionist)** | Xem tất cả bookings, cập nhật booking, check-in/out, hủy booking |
| **Quản lý (Manager)** | Xem tất cả bookings, quản lý khách sạn/phòng, quản lý khuyến mãi, quản lý nhân viên |
| **Chủ khách sạn (Hotel Owner)** | Xem bookings của khách sạn mình, quản lý khách sạn/phòng của mình |

---

## 📝 Use Cases

Hệ thống hỗ trợ 14 use cases chính:

1. Tìm kiếm Khách sạn/Phòng
2. Đăng ký Tài khoản
3. Đăng nhập
4. Đặt phòng
5. Thanh toán Trực tuyến
6. Quản lý Đặt phòng (Xem/Hủy) - Khách hàng
7. Quản lý Đặt phòng (Sửa/Hủy Đơn) - Lễ tân
8. Yêu cầu Dịch vụ
9. Thực hiện Check-in
10. Thực hiện Check-out
11. Quản lý Danh mục Phòng & KS
12. Quản lý Giá & Khuyến mãi
13. Quản lý Tài khoản Nhân viên
14. Xem Báo cáo Thống kê

Chi tiết xem tại [rule.md](./rule.md)

---

## 🧪 Testing

### Test API với Postman

Xem hướng dẫn chi tiết tại [backend/TEST_APIS.md](./backend/TEST_APIS.md)

### Test Flow Cơ Bản

1. Đăng ký tài khoản
2. Đăng nhập và lấy token
3. Tạo khách sạn (Hotel Owner)
4. Tìm kiếm khách sạn
5. Đặt phòng
6. Thanh toán
7. Check-in/Check-out

---

## 📦 Scripts

### Backend

```bash
npm run dev      # Chạy development server
npm run build    # Build TypeScript
npm start        # Chạy production server
```

### Frontend

```bash
npm run dev      # Chạy development server (port 5174)
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

## 🔒 Security

- JWT authentication
- Password hashing với bcryptjs
- Input validation với express-validator
- CORS configuration
- Helmet.js cho security headers
- Rate limiting
- Environment variables cho sensitive data

---

## 📄 License

ISC

---

## 👨‍💻 Author

**Email: de180577tranhongphuoc@gmail.com**
**Facebook: https://www.facebook.com/tran.hong.phuoc.947381/**

---

## 🙏 Acknowledgments

- PayOS - Payment gateway integration
- Cloudinary - Image storage service
- MongoDB Atlas - Cloud database
- React Query - Server state management
- Zustand - State management

---

*Built with ❤️ using MERN Stack*
