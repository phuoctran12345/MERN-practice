# 📐 Code Structure - Toàn bộ Dự án MERN

Tài liệu mô tả cấu trúc code cho toàn bộ dự án MERN Stack (MongoDB, Express, React, Node.js) có thể tái sử dụng cho các dự án khác.

---

## 📁 Cấu trúc Tổng quan

```
MERN-project/
├── frontend/                    # React Frontend Application
├── backend/                     # Express Backend API
├── shared-library/              # Shared reusable code (NEW)
├── shared/                      # Shared types giữa FE và BE
├── data/                        # Test data và seed data
├── doc/                         # Documentation
├── .cursor/                     # Cursor IDE rules
├── package.json                 # Root package.json (cho monorepo)
├── README.md                    # Main README
└── PROJECT_STRUCTURE.md         # File này
```

---

## 🎨 Frontend Structure (`frontend/`)

### Tổng quan
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Ant Design
- **State Management**: 
  - Global: Redux (User, Config)
  - Server: TanStack React Query (API data)
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios

### Cấu trúc chi tiết

```
frontend/
├── public/                      # Static files
│   └── vite.svg
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles
│   │
│   ├── components/              # React Components
│   │   ├── ui/                  # Base UI components (reusable)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── forms/               # Form components
│   │   │   ├── EmployeeForm.tsx
│   │   │   ├── PromotionForm.tsx
│   │   │   └── UserForm.tsx
│   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── Header.tsx           # App header
│   │   ├── Footer.tsx           # App footer
│   │   ├── ErrorBoundary.tsx    # Error boundary
│   │   ├── LoadingSpinner.tsx   # Loading component
│   │   ├── ProtectedRoute.tsx   # Route protection
│   │   └── ...
│   │
│   ├── pages/                   # Page Components (Routes)
│   │   ├── Home.tsx             # Trang chủ
│   │   ├── Search.tsx           # Tìm kiếm khách sạn
│   │   ├── Detail.tsx            # Chi tiết khách sạn
│   │   ├── Booking.tsx          # Đặt phòng
│   │   ├── SignIn.tsx            # Đăng nhập
│   │   ├── Register.tsx         # Đăng ký
│   │   ├── customer/            # Customer pages
│   │   │   └── MyBookings.tsx
│   │   └── dashboard/           # Dashboard pages
│   │       ├── owner/           # Owner dashboard
│   │       ├── manager/         # Manager dashboard
│   │       └── receptionist/    # Receptionist dashboard
│   │
│   ├── layouts/                 # Layout Components
│   │   ├── Layout.tsx           # Main layout
│   │   ├── AuthLayout.tsx       # Auth pages layout
│   │   └── DashboardLayout.tsx       # Dashboard layout
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useAppContext.ts     # App context hook
│   │   ├── useSearchContext.ts  # Search context hook
│   │   ├── useLoadingHooks.ts   # Loading state hook
│   │   └── use-toast.ts         # Toast notification hook
│   │
│   ├── lib/                     # Core Libraries
│   │   ├── api-client.ts        # Axios instance với interceptors
│   │   ├── utils.ts             # Utility functions (cn, etc.)
│   │   └── socket.ts            # Socket.IO client
│   │
│   ├── services/                # API Services
│   │   └── payos.service.ts     # PayOS payment service
│   │
│   ├── stores/                  # State Management (Zustand/Redux)
│   │   ├── authStore.ts         # Auth state
│   │   ├── userStore.ts         # User state
│   │   ├── configStore.ts       # Config state
│   │   └── advancedSearchStore.ts
│   │
│   ├── contexts/                # React Contexts
│   │   ├── AppContext.tsx       # App-wide context
│   │   └── SearchContext.tsx    # Search context
│   │
│   ├── types/                   # TypeScript Types
│   │   └── common.types.ts      # Common types
│   │
│   ├── schemas/                 # Zod Validation Schemas
│   │   └── auth.schemas.ts      # Auth validation
│   │
│   ├── utils/                   # Utility Functions
│   │   ├── formatCurrency.ts    # Format currency
│   │   └── consoleFilter.ts     # Console filter
│   │
│   ├── forms/                   # Complex Form Components
│   │   ├── BookingForm/
│   │   │   └── BookingFormPayOS.tsx
│   │   ├── GuestInfoForm/
│   │   │   └── GuestInfoForm.tsx
│   │   └── ManageHotelForm/     # Multi-section form
│   │       ├── ManageHotelForm.tsx
│   │       ├── DetailsSection.tsx
│   │       ├── ContactSection.tsx
│   │       ├── FacilitiesSection.tsx
│   │       └── ...
│   │
│   └── config/                  # Configuration
│       └── hotel-options-config.ts
│
├── .eslintrc.cjs                # ESLint config
├── .gitignore
├── index.html                   # HTML entry
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── tsconfig.node.json           # TS config for Node
└── vite.config.ts               # Vite config
```

### Quy tắc Frontend

1. **Components**
   - Tách nhỏ nếu > 200 dòng
   - Functional components only
   - Props interface rõ ràng

2. **State Management**
   - Server state → React Query
   - Global state → Redux/Zustand
   - Local state → useState/useReducer

3. **API Calls**
   - Dùng React Query hooks
   - Tất cả API calls qua `api-client.ts`

4. **Error Handling**
   - ErrorBoundary cho UI errors
   - Axios interceptors cho API errors

---

## ⚙️ Backend Structure (`backend/`)

### Tổng quan
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Payment**: PayOS
- **Real-time**: Socket.IO
- **Documentation**: Swagger

### Cấu trúc chi tiết

```
backend/
├── src/
│   ├── index.ts                 # Entry point - Express app setup
│   │
│   ├── express/                 # Express application
│   │   ├── routes/              # API Routes
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── users.ts         # User management routes
│   │   │   ├── hotels.ts        # Hotel CRUD routes
│   │   │   ├── my-hotels.ts     # User's hotels routes
│   │   │   ├── bookings.ts      # Booking management routes
│   │   │   ├── my-bookings.ts   # User's bookings routes
│   │   │   ├── payments.ts      # Payment routes
│   │   │   ├── rooms.ts         # Room routes (v2)
│   │   │   ├── service-requests.ts  # Service request routes (v2)
│   │   │   ├── booking-operations.ts # Check-in/out routes (v2)
│   │   │   ├── promotions.ts    # Promotion routes (v2)
│   │   │   ├── employees.ts     # Employee routes (v2)
│   │   │   ├── business-insights.ts # Analytics routes
│   │   │   └── health.ts        # Health check route
│   │   │
│   │   ├── controllers/         # Route Controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── hotel.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── room.controller.ts
│   │   │   ├── service-request.controller.ts
│   │   │   ├── booking-operations.controller.ts
│   │   │   ├── promotion.controller.ts
│   │   │   ├── employee.controller.ts
│   │   │   ├── business-insights.controller.ts
│   │   │   └── health.controller.ts
│   │   │
│   │   └── middleware/          # Express Middleware
│   │       ├── auth.ts          # JWT authentication middleware
│   │       └── roleCheck.ts     # Role-based access control
│   │
│   ├── models/                  # Mongoose Models
│   │   ├── user.ts              # User model
│   │   ├── hotel.ts             # Hotel model
│   │   ├── booking.ts           # Booking model
│   │   ├── room.ts              # Room model
│   │   ├── service-request.ts   # Service request model
│   │   ├── promotion.ts         # Promotion model
│   │   ├── company.ts           # Company model
│   │   ├── analytics.ts         # Analytics model
│   │   ├── audit-log.ts         # Audit log model
│   │   └── ...
│   │
│   ├── services/                # Business Logic Services
│   │   └── payos.service.ts     # PayOS payment service
│   │
│   └── shared/                  # Shared Backend Code
│       ├── socket.ts            # Socket.IO setup
│       ├── swagger.ts           # Swagger documentation config
│       └── types.ts             # Shared types
│
├── scripts/                     # Utility Scripts
│   ├── create-database.js       # Database setup script
│   └── reset-manager-password.ts # Password reset script
│
├── .gitignore
├── CLOUDINARY_SETUP.md          # Cloudinary setup guide
├── PAYOS_SETUP.md               # PayOS setup guide
├── index.ts                     # Entry point (alias)
├── nixpacks.toml                # Nixpacks config (deployment)
├── nodemon.json                 # Nodemon config
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

### Quy tắc Backend

1. **Routes**
   - Mỗi resource có file route riêng
   - Routes chỉ định nghĩa endpoints, không có business logic
   - Validation ở route level (express-validator)

2. **Controllers**
   - Xử lý request/response
   - Gọi services để thực hiện business logic
   - Trả về response chuẩn: `{ success, data, message }`

3. **Models**
   - Mongoose schemas
   - Type-safe với TypeScript
   - Validation ở schema level

4. **Services**
   - Business logic phức tạp
   - Có thể tái sử dụng
   - Không phụ thuộc vào Express

5. **Middleware**
   - Authentication: `verifyToken`
   - Authorization: `roleCheck`
   - Validation: express-validator

---

## 📚 Shared Library Structure (`shared-library/`)

Thư viện code có thể tái sử dụng cho các dự án khác.

```
shared-library/
├── README.md                    # Documentation
├── components/                  # Reusable UI Components
│   ├── ui/                      # Base components
│   ├── forms/                   # Form components
│   ├── layout/                  # Layout components
│   └── feedback/                # Toast, Modal, Alert
├── hooks/                       # Custom React Hooks
│   ├── useApi.ts                # API hook với React Query
│   ├── useAuth.ts               # Auth hook
│   ├── useForm.ts               # Form hook wrapper
│   └── useDebounce.ts           # Debounce hook
├── lib/                         # Core Libraries
│   ├── api-client.ts            # Axios instance
│   ├── utils.ts                 # Utilities
│   └── constants.ts             # Constants
├── types/                       # TypeScript Types
│   ├── api.types.ts             # API types
│   ├── common.types.ts          # Common types
│   └── form.types.ts            # Form types
├── schemas/                     # Zod Schemas
│   ├── common.schemas.ts        # Common schemas
│   └── auth.schemas.ts          # Auth schemas
├── utils/                       # Utility Functions
│   ├── format.ts                # Format functions
│   ├── validation.ts            # Validation helpers
│   └── error-handler.ts         # Error handling
├── patterns/                    # Code Patterns
│   ├── error-boundary.tsx       # ErrorBoundary
│   ├── protected-route.tsx     # ProtectedRoute
│   └── api-service.ts           # API service pattern
└── config/                      # Configuration
    ├── api.config.ts            # API config
    └── app.config.ts            # App config
```

---

## 🔄 Shared Types (`shared/`)

Types được chia sẻ giữa Frontend và Backend.

```
shared/
├── types.ts                     # Shared TypeScript types
└── types.js                     # JavaScript types (legacy)
```

---

## 📝 Naming Conventions

### Files & Folders
- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase với prefix `use` (`useAuth.ts`, `useApi.ts`)
- **Utils**: camelCase (`formatCurrency.ts`, `validation.ts`)
- **Routes**: kebab-case (`my-bookings.ts`, `service-requests.ts`)
- **Models**: PascalCase (`User.ts`, `Hotel.ts`)

### Code
- **Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)
- **Functions**: camelCase (`getUser`, `formatCurrency`)

---

## 🚀 Best Practices

### Frontend
1. ✅ Luôn định nghĩa TypeScript types, không dùng `any`
2. ✅ Tách component nếu > 200 dòng
3. ✅ Dùng React Query cho server state
4. ✅ Error handling với ErrorBoundary
5. ✅ Comment bằng tiếng Việt, thuật ngữ chuyên ngành tiếng Anh

### Backend
1. ✅ Routes → Controllers → Services pattern
2. ✅ Validation ở route level (express-validator)
3. ✅ Business logic trong services
4. ✅ Error handling chuẩn hóa
5. ✅ Swagger documentation cho tất cả APIs

### General
1. ✅ Environment variables cho config
2. ✅ Git ignore node_modules, .env, dist
3. ✅ README cho mỗi module lớn
4. ✅ Consistent code formatting (ESLint, Prettier)

---

## 📦 Dependencies Chính

### Frontend
- `react`, `react-dom` - React framework
- `@tanstack/react-query` - Server state management
- `react-hook-form` + `zod` - Form handling
- `axios` - HTTP client
- `tailwindcss` - Styling
- `zustand` / `redux` - Global state

### Backend
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cloudinary` - Image upload
- `@payos/node` - Payment gateway
- `socket.io` - Real-time communication

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:7002
```

### Backend (.env)
```env
MONGODB_CONNECTION_STRING=mongodb://...
JWT_SECRET_KEY=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...
FRONTEND_URL=http://localhost:5174
PORT=7002
NODE_ENV=development
```

---

## 📖 Tài liệu Tham khảo

- [Frontend README](./frontend/README.md)
- [Backend Setup Guide](./doc/MONGODB_SETUP_GUIDE.md)
- [API Guide](./doc/CRUD_API_GUIDE.md)
- [Shared Library README](./shared-library/README.md)

---

**Lưu ý**: Cấu trúc này có thể tái sử dụng cho các dự án MERN khác. Chỉ cần copy và customize theo nhu cầu dự án mới.
