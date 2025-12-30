# ⚡ QUICK CHECKLIST - SMART HOTEL PROJECT
**Deadline:** 5/1/2026 | **Ngày bắt đầu:** 30/12/2025

---

## 🎯 TÓM TẮT NHANH

### ✅ ĐÃ CÓ
- Backend APIs (14 use cases) ✅
- Frontend cơ bản (Home, Search, Booking, Auth) ✅
- Components cơ bản ✅

### ❌ CHƯA CÓ (CẦN LÀM)
1. **Dashboards** (Owner, Manager, Receptionist)
2. **Service Request** page
3. **Check-in/Check-out** pages
4. **PayOS Integration** (đang dùng Stripe)
5. **Promotions Management** UI
6. **Employees Management** UI
7. **Zustand Store** (đang dùng Context)
8. **Role-based Protection**

---

## 📅 KẾ HOẠCH 6 NGÀY

### Ngày 1 (30/12): Foundation
- [ ] Upgrade React Query v5
- [ ] Setup Zustand
- [ ] Create ProtectedRoute

### Ngày 2 (31/12): Owner Dashboard
- [ ] Dashboard Layout + Sidebar
- [ ] Owner Dashboard page
- [ ] Hotels, Employees, Promotions, Analytics sections

### Ngày 3 (1/1): Manager & Receptionist Dashboards
- [ ] Manager Dashboard
- [ ] Receptionist Dashboard
- [ ] Check-in/Check-out pages

### Ngày 4 (2/1): Service Request & PayOS
- [ ] Service Request page
- [ ] PayOS Integration
- [ ] Apply promotion code

### Ngày 5 (3/1): Polish & Refinement
- [ ] UI/UX improvements
- [ ] Role-based navigation
- [ ] Form validation
- [ ] Error handling

### Ngày 6 (4-5/1): Testing & Final
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Documentation

---

## 🔥 TOP PRIORITY (Làm trước)

1. ✅ **Dashboards** - Không có dashboards = không có gì!
2. ✅ **Service Request** - UC 8
3. ✅ **Check-in/Check-out** - UC 9, 10
4. ✅ **PayOS** - UC 5
5. ✅ **Role Protection** - Security!

---

## 📊 USE CASES STATUS

| UC | Tên | Status | Note |
|:---|:----|:-------|:-----|
| 1 | Tìm kiếm | ✅ | Đã có |
| 2 | Đăng ký | ✅ | Đã có |
| 3 | Đăng nhập | ✅ | Cần redirect theo role |
| 4 | Đặt phòng | ✅ | Cần apply promotion |
| 5 | Thanh toán | ❌ | **Cần PayOS** |
| 6 | My Bookings | ✅ | Đã có |
| 7 | Quản lý Booking | ❌ | **Cần Dashboard** |
| 8 | Service Request | ❌ | **Cần Page** |
| 9 | Check-in | ❌ | **Cần Page** |
| 10 | Check-out | ❌ | **Cần Page** |
| 11 | Quản lý KS/Phòng | ⚠️ | Cần Dashboard section |
| 12 | Khuyến mãi | ❌ | **Cần UI** |
| 13 | Nhân viên | ❌ | **Cần UI** |
| 14 | Báo cáo | ⚠️ | Cần Dashboard section |

**Legend:** ✅ Done | ⚠️ Partial | ❌ Missing

---

## 🚨 LƯU Ý QUAN TRỌNG

1. **Git:** Nhớ commit trước khi chuyển nhánh!
2. **TypeScript:** Không dùng `any`
3. **Testing:** Test từng feature sau khi làm xong
4. **Backend:** Đã có API, chỉ cần tích hợp frontend

---

**Xem chi tiết:** `CHECKLIST_PROJECT.md`

