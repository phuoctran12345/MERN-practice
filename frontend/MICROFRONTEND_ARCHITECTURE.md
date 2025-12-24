# 🏗️ Micro-Frontend Architecture - SmartHotel

## ❌ Vấn đề với cấu trúc hiện tại

Cấu trúc hiện tại **CHƯA** tuân thủ micro-frontend pattern:
- Components được tổ chức theo type (booking/, room/, payment/)
- Không có domain logic tách biệt
- Không có module isolation

## ✅ Cấu trúc Micro-Frontend đúng chuẩn

Theo `rule.md`, cần tổ chức theo **modules** với domain logic riêng:

```
src/
├── modules/                    # Micro-frontend modules
│   ├── booking/               # Booking Module (Use Case 4, 6, 7, 9, 10)
│   │   ├── domain/            # Domain Layer - Business Logic
│   │   │   ├── BookingDomain.js
│   │   │   ├── CheckInDomain.js
│   │   │   └── CheckOutDomain.js
│   │   └── components/        # UI Components riêng cho module
│   │       ├── BookingCard.js
│   │       ├── BookingForm.js
│   │       ├── BookingList.js
│   │       ├── CheckInForm.js
│   │       └── CheckOutForm.js
│   │
│   ├── room/                  # Room Module (Use Case 1, 11)
│   │   ├── domain/
│   │   │   ├── RoomDomain.js
│   │   │   └── SearchDomain.js
│   │   └── components/
│   │       ├── RoomCard.js
│   │       ├── RoomList.js
│   │       ├── RoomFilter.js
│   │       └── RoomDetail.js
│   │
│   ├── payment/               # Payment Module (Use Case 5)
│   │   ├── domain/
│   │   │   └── PaymentDomain.js
│   │   └── components/
│   │       ├── PaymentForm.js
│   │       ├── PaymentMethod.js
│   │       └── PaymentHistory.js
│   │
│   ├── service/               # Service Module (Use Case 8)
│   │   ├── domain/
│   │   │   └── ServiceDomain.js
│   │   └── components/
│   │       ├── ServiceRequest.js
│   │       └── ServiceList.js
│   │
│   ├── hotel/                 # Hotel Module (Use Case 11)
│   │   ├── domain/
│   │   │   └── HotelDomain.js
│   │   └── components/
│   │       ├── HotelCard.js
│   │       └── HotelForm.js
│   │
│   ├── staff/                 # Staff Module (Use Case 13)
│   │   ├── domain/
│   │   │   └── StaffDomain.js
│   │   └── components/
│   │       ├── StaffList.js
│   │       └── StaffForm.js
│   │
│   └── auth/                  # Auth Module (Use Case 2, 3)
│       ├── domain/
│       │   └── AuthDomain.js
│       └── components/
│           ├── LoginForm.js
│           └── RegisterForm.js
│
├── pages/                      # Pages sử dụng modules
│   ├── customer/
│   ├── receptionist/
│   └── manager/
│
├── components/                 # Shared components (không thuộc module nào)
│   ├── layout/
│   └── common/
│
├── services/                  # Shared API services
│   └── api.js
│
├── hooks/                      # Shared hooks
├── context/                    # Shared context
├── types/                      # Shared types
├── utils/                      # Shared utils
└── styles/                     # Shared styles
```

## 🎯 Nguyên tắc Micro-Frontend

### 1. Module Independence
Mỗi module là **độc lập**:
- Có domain logic riêng
- Có components riêng
- Có thể test riêng
- Có thể deploy riêng (trong tương lai)

### 2. Domain Layer trong Module
Mỗi module có `domain/` chứa business logic:
```javascript
// modules/booking/domain/BookingDomain.js
export class BookingDomain {
  calculateTotal(roomPrice, nights, services) {
    // Business logic tính tổng tiền
  }
  
  validateBookingDates(checkIn, checkOut) {
    // Business logic validate ngày
  }
  
  canCancel(booking) {
    // Business logic kiểm tra có thể hủy không
  }
}
```

### 3. Component Isolation
Components trong module chỉ dùng cho module đó:
```javascript
// modules/booking/components/BookingForm.js
import { BookingDomain } from '../domain/BookingDomain';

// Component này chỉ dùng trong Booking module
```

### 4. Shared Resources
Chỉ share những gì thực sự cần:
- `components/common/` - UI components chung
- `components/layout/` - Layout components
- `services/api.js` - API config
- `utils/` - Utility functions
- `types/` - Shared types

## 📋 Mapping Use Cases → Modules

| Use Case | Module | Domain Logic | Components |
|----------|--------|--------------|------------|
| 1. Tìm kiếm | `room` | SearchDomain | RoomFilter, RoomList |
| 2. Đăng ký | `auth` | AuthDomain | RegisterForm |
| 3. Đăng nhập | `auth` | AuthDomain | LoginForm |
| 4. Đặt phòng | `booking` | BookingDomain | BookingForm |
| 5. Thanh toán | `payment` | PaymentDomain | PaymentForm |
| 6. Xem/Hủy đặt phòng | `booking` | BookingDomain | BookingList |
| 7. Sửa/Hủy đơn | `booking` | BookingDomain | BookingForm |
| 8. Yêu cầu dịch vụ | `service` | ServiceDomain | ServiceRequest |
| 9. Check-in | `booking` | CheckInDomain | CheckInForm |
| 10. Check-out | `booking` | CheckOutDomain | CheckOutForm |
| 11. Quản lý Phòng/KS | `room`, `hotel` | RoomDomain, HotelDomain | RoomForm, HotelForm |
| 12. Quản lý Giá | `room` | PricingDomain | PricingForm |
| 13. Quản lý Nhân viên | `staff` | StaffDomain | StaffForm |
| 14. Báo cáo | `booking`, `room` | ReportDomain | ReportCharts |

## 🔄 Workflow

### Khi tạo feature mới:
1. Xác định module (hoặc tạo module mới)
2. Tạo domain logic trong `module/domain/`
3. Tạo components trong `module/components/`
4. Sử dụng module trong pages

### Ví dụ: Tạo Booking feature
```javascript
// 1. Domain Logic
// modules/booking/domain/BookingDomain.js
export class BookingDomain {
  // Business logic
}

// 2. Component
// modules/booking/components/BookingForm.js
import { BookingDomain } from '../domain/BookingDomain';

// 3. Sử dụng trong Page
// pages/customer/Booking.js
import { BookingForm } from '../../modules/booking/components/BookingForm';
```

## ✅ Checklist để đạt Micro-Frontend

- [x] Tạo cấu trúc `modules/` với domain và components
- [ ] Refactor components hiện tại vào modules
- [ ] Tạo domain logic cho từng module
- [ ] Đảm bảo module independence
- [ ] Tách biệt shared vs module-specific code
- [ ] Document module boundaries

## 🚀 Lợi ích

1. **Maintainability**: Dễ maintain, mỗi module độc lập
2. **Scalability**: Dễ thêm module mới
3. **Testability**: Test từng module riêng
4. **Team Collaboration**: Nhiều team có thể làm việc song song
5. **Future-proof**: Có thể tách thành micro-frontend thực sự sau

