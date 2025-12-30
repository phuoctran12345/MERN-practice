# 📋 CHECKLIST HOÀN THIỆN DỰ ÁN SMART HOTEL
**Thời gian:** 30/12/2025 - 5/1/2026 (6 ngày)  
**Mục tiêu:** Hoàn thành tất cả 14 Use Cases theo rule.md

---

## ✅ ĐÁNH GIÁ HIỆN TRẠNG

### ✅ BACKEND - ĐÃ HOÀN THÀNH
- [x] API Routes cho tất cả 14 Use Cases
- [x] Controllers đã implement
- [x] Models đã có
- [x] Middleware Auth & Role Check
- [x] PayOS Service đã setup
- [x] Database Models (Mongoose)

### ✅ FRONTEND - ĐÃ CÓ
- [x] React 18 + TypeScript + Vite setup
- [x] Tailwind CSS + Ant Design
- [x] React Router setup
- [x] API Client với Axios
- [x] Context API (AppContext, SearchContext)
- [x] React Query v3 (đang dùng)
- [x] Pages: Home, Search, Detail, Booking, MyBookings, Register, SignIn
- [x] Components: Header, Footer, Hero, SearchBar, AdvancedSearch, etc.
- [x] Forms: BookingForm, GuestInfoForm, ManageHotelForm

### ❌ FRONTEND - CHƯA CÓ (CẦN PHÁT TRIỂN)

#### 🔴 CRITICAL - PHẢI CÓ
- [ ] **Dashboards cho 3 roles** (Owner, Manager, Receptionist)
- [ ] **Service Request Page** (UC 8)
- [ ] **Check-in/Check-out Pages** (UC 9, 10)
- [ ] **Promotions Management UI** (UC 12)
- [ ] **Employees Management UI** (UC 13)
- [ ] **PayOS Integration** (UC 5) - Đang dùng Stripe, cần thay bằng PayOS
- [ ] **Role-based Route Protection**
- [ ] **Zustand Store** (Rule nói dùng Zustand nhưng đang dùng Context)

#### 🟡 IMPORTANT - NÊN CÓ
- [ ] **React Query v5** (Upgrade từ v3)
- [ ] **Neo Brutalism Styling** cho dashboards
- [ ] **Sidebar Navigation** component
- [ ] **ProtectedRoute** component
- [ ] **ErrorBoundary** component
- [ ] **Loading States** (Skeleton, Spinners)
- [ ] **Empty States** components

#### 🟢 NICE TO HAVE
- [ ] **Analytics Charts** (Recharts)
- [ ] **Export Features** (CSV, PDF)
- [ ] **Advanced Filters**
- [ ] **Email Notifications** (optional)

---

## 📅 KẾ HOẠCH 6 NGÀY (30/12 - 5/1)

### 🗓️ NGÀY 1: 30/12/2025 - FOUNDATION & SETUP ✅ HOÀN THÀNH
**Mục tiêu:** Setup foundation để bắt đầu phát triển features

#### Task List:
- [x] **1.1 Upgrade Dependencies** ✅
  - [x] Upgrade React Query từ v3 → v5 (`@tanstack/react-query`)
  - [x] Install Zustand (`npm install zustand`) - Đã có sẵn
  - [x] Install Zod (`npm install zod`)
  - [x] Install Recharts cho charts (`npm install recharts`) - Đã có sẵn
  - [x] Test sau khi upgrade - Đã fix lỗi Search page

- [x] **1.2 Setup Zustand Stores** ✅
  - [x] Tạo `src/stores/authStore.ts` (thay thế AppContext)
  - [x] Tạo `src/stores/userStore.ts` (quản lý user info)
  - [x] Tạo `src/stores/configStore.ts` (cấu hình hệ thống)
  - [x] Migrate logic từ Context → Zustand (Stores đã tạo, chưa migrate hoàn toàn - có thể làm sau)
  - [x] Update components đang dùng Context (SignIn đã dùng userStore)

- [x] **1.3 Setup React Query v5 Provider** ✅
  - [x] Update `main.tsx` với QueryClient mới
  - [x] Update tất cả imports từ `react-query` → `@tanstack/react-query`
  - [x] Update query keys sang array format
  - [x] Fix `useQueryWithLoading` và `useMutationWithLoading` hooks
  - [x] Test các queries hiện tại vẫn hoạt động - Đã fix lỗi Search page

- [x] **1.4 Create ProtectedRoute Component** ✅
  - [x] Tạo `src/components/ProtectedRoute.tsx`
  - [x] Implement role-based protection
  - [x] Test với các routes hiện tại (Component đã tạo, chưa tích hợp vào App.tsx - sẽ tích hợp khi làm dashboards)

- [x] **1.5 Fix Login Redirect** ✅
  - [x] Update SignIn để fetch user info sau login
  - [x] Lưu user info vào userStore
  - [x] Redirect theo role (Owner → /dashboard/owner, Manager → /dashboard/manager, etc.)

**Kết quả mong đợi:** ✅ Foundation sẵn sàng, có thể bắt đầu làm dashboards

---

### 🗓️ NGÀY 2: 31/12/2025 - OWNER DASHBOARD
**Mục tiêu:** Hoàn thành Owner Dashboard với UC 11, 12, 13, 14

#### Task List:
- [ ] **2.1 Create Dashboard Layout**
  - [ ] Tạo `src/layouts/DashboardLayout.tsx`
  - [ ] Tạo `src/components/dashboard/Sidebar.tsx` với menu theo role
  - [ ] Apply Neo Brutalism styling
  - [ ] Responsive (mobile → hamburger menu)

- [ ] **2.2 Owner Dashboard Page**
  - [ ] Tạo `src/pages/dashboard/owner/OwnerDashboard.tsx`
  - [ ] Tạo route `/dashboard/owner` trong App.tsx
  - [ ] Stats Cards component (Revenue, Bookings, Hotels, Employees)
  - [ ] Revenue Chart (Recharts)
  - [ ] Bookings Chart (Pie/Bar)

- [ ] **2.3 Hotels Management Section (UC 11)**
  - [ ] Tạo `src/pages/dashboard/owner/HotelsSection.tsx`
  - [ ] List hotels với filters
  - [ ] CRUD operations (đã có AddHotel, EditHotel, cần integrate)

- [ ] **2.4 Employees Management Section (UC 13)**
  - [ ] Tạo `src/pages/dashboard/owner/EmployeesSection.tsx`
  - [ ] Tạo `src/components/forms/EmployeeForm.tsx`
  - [ ] List employees với filters
  - [ ] CRUD operations (Create, Read, Update, Delete/Deactivate)
  - [ ] Change password functionality

- [ ] **2.5 Promotions Management Section (UC 12)**
  - [ ] Tạo `src/pages/dashboard/owner/PromotionsSection.tsx`
  - [ ] Tạo `src/components/forms/PromotionForm.tsx`
  - [ ] List promotions với filters
  - [ ] CRUD operations

- [ ] **2.6 Analytics Section (UC 14)**
  - [ ] Tạo `src/pages/dashboard/owner/AnalyticsSection.tsx`
  - [ ] Revenue charts (daily/weekly/monthly)
  - [ ] Occupancy rate charts
  - [ ] Performance metrics

**Kết quả mong đợi:** Owner Dashboard hoàn chỉnh với tất cả sections

---

### 🗓️ NGÀY 3: 1/1/2026 - MANAGER & RECEPTIONIST DASHBOARDS
**Mục tiêu:** Hoàn thành Manager và Receptionist Dashboards

#### Task List:
- [ ] **3.1 Manager Dashboard (UC 7, 11, 12, 13, 14)**
  - [ ] Tạo `src/pages/dashboard/manager/ManagerDashboard.tsx`
  - [ ] Tạo route `/dashboard/manager`
  - [ ] Today's Overview stats
  - [ ] Bookings Management table (UC 7) - Edit/Cancel bookings
  - [ ] Rooms Management grid (UC 11)
  - [ ] Promotions Management (UC 12) - Reuse components từ Owner
  - [ ] Employees Management (UC 13) - Reuse components từ Owner
  - [ ] Analytics (UC 14) - Reuse components từ Owner

- [ ] **3.2 Receptionist Dashboard (UC 7, 8, 9, 10)**
  - [ ] Tạo `src/pages/dashboard/receptionist/ReceptionistDashboard.tsx`
  - [ ] Tạo route `/dashboard/receptionist`
  - [ ] Today's Tasks stats
  - [ ] All Bookings table (UC 7) - View/Edit bookings
  - [ ] Service Requests table (UC 8) - View/Update status

- [ ] **3.3 Check-in Page (UC 9)**
  - [ ] Tạo `src/pages/dashboard/receptionist/CheckInPage.tsx`
  - [ ] Tạo route `/dashboard/receptionist/check-in`
  - [ ] Form để nhập booking code hoặc room number
  - [ ] Display booking details
  - [ ] Confirm check-in button
  - [ ] Update booking status → "checked_in"

- [ ] **3.4 Check-out Page (UC 10)**
  - [ ] Tạo `src/pages/dashboard/receptionist/CheckOutPage.tsx`
  - [ ] Tạo route `/dashboard/receptionist/check-out`
  - [ ] Form để nhập booking code hoặc room number
  - [ ] Display booking details + service requests total
  - [ ] Input extra charges
  - [ ] Calculate total cost
  - [ ] Confirm check-out button
  - [ ] Update booking status → "checked_out"

**Kết quả mong đợi:** Manager và Receptionist Dashboards hoàn chỉnh

---

### 🗓️ NGÀY 4: 2/1/2026 - SERVICE REQUEST & PAYOS INTEGRATION
**Mục tiêu:** Hoàn thành Service Request và tích hợp PayOS

#### Task List:
- [ ] **4.1 Service Request Page (UC 8)**
  - [ ] Tạo `src/pages/ServiceRequest.tsx` hoặc modal
  - [ ] Tạo route `/service-request`
  - [ ] Tạo `src/components/forms/ServiceRequestForm.tsx`
  - [ ] Form với Service Type, Description, Price
  - [ ] List service requests với filters
  - [ ] Update status (Pending → In Progress → Completed)
  - [ ] Customer có thể tạo request từ MyBookings page

- [ ] **4.2 PayOS Integration (UC 5)**
  - [ ] Remove Stripe dependencies (nếu có)
  - [ ] Tạo `src/services/payos.service.ts` (frontend)
  - [ ] Update `src/pages/Booking.tsx` để dùng PayOS
  - [ ] Tạo payment link từ PayOS
  - [ ] Handle PayOS redirect (success/cancel)
  - [ ] Tạo `src/pages/PaymentSuccess.tsx`
  - [ ] Tạo `src/pages/PaymentCancel.tsx`
  - [ ] Update booking flow để tích hợp PayOS
  - [ ] Test payment flow end-to-end

- [ ] **4.3 Apply Promotion Code trong Booking**
  - [ ] Update BookingForm để có input promotion code
  - [ ] Validate promotion code
  - [ ] Calculate discount
  - [ ] Apply vào total cost

**Kết quả mong đợi:** Service Request hoạt động, PayOS tích hợp thành công

---

### 🗓️ NGÀY 5: 3/1/2026 - REFINEMENT & POLISHING
**Mục tiêu:** Hoàn thiện UI/UX, fix bugs, testing

#### Task List:
- [ ] **5.1 UI/UX Improvements**
  - [ ] Apply Neo Brutalism styling cho tất cả dashboards
  - [ ] Loading states (Skeleton loaders, Spinners)
  - [ ] Error states (ErrorBoundary)
  - [ ] Empty states components
  - [ ] Toast notifications cho actions
  - [ ] Responsive design cho mobile/tablet

- [ ] **5.2 Role-based Navigation**
  - [ ] Update Header để redirect theo role sau login
  - [ ] Owner → `/dashboard/owner`
  - [ ] Manager → `/dashboard/manager`
  - [ ] Receptionist → `/dashboard/receptionist`
  - [ ] Customer → `/` (Home)

- [ ] **5.3 Route Protection**
  - [ ] Protect all dashboard routes
  - [ ] Protect booking routes (chỉ customer)
  - [ ] Protect hotel management routes (chỉ owner/manager)
  - [ ] Test unauthorized access

- [ ] **5.4 Form Validation**
  - [ ] Add Zod schemas cho tất cả forms
  - [ ] React Hook Form integration
  - [ ] Error messages hiển thị rõ ràng

- [ ] **5.5 API Integration**
  - [ ] Test tất cả API calls
  - [ ] Handle error cases (401, 403, 500)
  - [ ] Refresh token logic (nếu cần)
  - [ ] Optimistic updates với React Query

**Kết quả mong đợi:** UI/UX hoàn thiện, không có bugs nghiêm trọng

---

### 🗓️ NGÀY 6: 4-5/1/2026 - FINAL TESTING & DOCUMENTATION
**Mục tiêu:** Test toàn bộ hệ thống, fix bugs cuối cùng

#### Task List:
- [ ] **6.1 End-to-End Testing**
  - [ ] Test tất cả 14 Use Cases
  - [ ] Test với các roles khác nhau
  - [ ] Test payment flow với PayOS
  - [ ] Test check-in/check-out flow
  - [ ] Test service request flow
  - [ ] Test CRUD operations cho tất cả entities

- [ ] **6.2 Bug Fixes**
  - [ ] Fix các bugs phát hiện được
  - [ ] Fix console errors
  - [ ] Fix TypeScript errors
  - [ ] Fix linter warnings

- [ ] **6.3 Performance Optimization**
  - [ ] Check bundle size
  - [ ] Optimize images
  - [ ] Lazy load components
  - [ ] Code splitting

- [ ] **6.4 Documentation**
  - [ ] Update README.md với hướng dẫn setup
  - [ ] Document API endpoints (nếu chưa có)
  - [ ] Document component structure
  - [ ] Document state management (Zustand)

- [ ] **6.5 Final Checklist**
  - [ ] Tất cả 14 Use Cases đã implement
  - [ ] Tất cả dashboards hoạt động
  - [ ] PayOS integration hoạt động
  - [ ] Role-based access hoạt động
  - [ ] Responsive design hoạt động
  - [ ] No critical bugs

**Kết quả mong đợi:** Dự án hoàn thiện, sẵn sàng demo/present

---

## 📊 CHECKLIST THEO USE CASES

### ✅ UC 1: Tìm kiếm Khách sạn/Phòng
- [x] Home page với search bar
- [x] Search page với filters
- [x] Advanced search với facilities, types, stars, price
- [x] Hotel detail page
- [ ] **Cần kiểm tra:** Filters có hoạt động đúng không?

### ✅ UC 2: Đăng ký Tài khoản
- [x] Register page
- [x] Form validation
- [x] API integration
- [ ] **Cần kiểm tra:** Error handling có tốt không?

### ✅ UC 3: Đăng nhập
- [x] SignIn page
- [x] JWT token storage
- [x] Token validation
- [x] **ĐÃ FIX:** Redirect theo role sau login ✅

### ✅ UC 4: Đặt phòng
- [x] Booking page
- [x] BookingForm component
- [x] Guest info form
- [x] API integration
- [ ] **Cần cải thiện:** Apply promotion code

### ❌ UC 5: Thanh toán Trực tuyến
- [x] Backend PayOS service
- [ ] **CHƯA CÓ:** Frontend PayOS integration
- [ ] **CHƯA CÓ:** Payment success/cancel pages
- [ ] **CHƯA CÓ:** Payment flow với PayOS

### ✅ UC 6: Quản lý Đặt phòng (Xem/Hủy) - Customer
- [x] MyBookings page
- [x] View bookings
- [x] Cancel booking (nếu có API)
- [ ] **Cần kiểm tra:** Cancel policy có hiển thị không?

### ❌ UC 7: Quản lý Đặt phòng (Sửa/Hủy Đơn) - Lễ tân/Manager
- [x] Backend API
- [ ] **CHƯA CÓ:** Manager Dashboard với bookings table
- [ ] **CHƯA CÓ:** Receptionist Dashboard với bookings table
- [ ] **CHƯA CÓ:** Edit booking functionality
- [ ] **CHƯA CÓ:** Cancel booking từ dashboard

### ❌ UC 8: Yêu cầu Dịch vụ
- [x] Backend API
- [ ] **CHƯA CÓ:** Service Request page/modal
- [ ] **CHƯA CÓ:** Service Request form
- [ ] **CHƯA CÓ:** List service requests
- [ ] **CHƯA CÓ:** Update status functionality

### ❌ UC 9: Thực hiện Check-in
- [x] Backend API
- [ ] **CHƯA CÓ:** Check-in page
- [ ] **CHƯA CÓ:** Check-in form
- [ ] **CHƯA CÓ:** Update booking status

### ❌ UC 10: Thực hiện Check-out
- [x] Backend API
- [ ] **CHƯA CÓ:** Check-out page
- [ ] **CHƯA CÓ:** Check-out form với extra charges
- [ ] **CHƯA CÓ:** Calculate total cost
- [ ] **CHƯA CÓ:** Update booking status

### ⚠️ UC 11: Quản lý Danh mục Phòng & KS
- [x] AddHotel page
- [x] EditHotel page
- [x] MyHotels page
- [ ] **CHƯA CÓ:** Owner Dashboard với Hotels section
- [ ] **CHƯA CÓ:** Manager Dashboard với Rooms section
- [ ] **Cần kiểm tra:** CRUD operations có đầy đủ không?

### ❌ UC 12: Quản lý Giá & Khuyến mãi
- [x] Backend API
- [ ] **CHƯA CÓ:** Promotions Management UI
- [ ] **CHƯA CÓ:** Create/Edit/Delete promotions
- [ ] **CHƯA CÓ:** List promotions với filters
- [ ] **CHƯA CÓ:** Apply promotion trong booking

### ❌ UC 13: Quản lý Tài khoản Nhân viên
- [x] Backend API
- [ ] **CHƯA CÓ:** Employees Management UI
- [ ] **CHƯA CÓ:** Create/Edit/Delete employees
- [ ] **CHƯA CÓ:** List employees với filters
- [ ] **CHƯA CÓ:** Activate/Deactivate employees
- [ ] **CHƯA CÓ:** Change password functionality

### ⚠️ UC 14: Xem Báo cáo Thống kê
- [x] Backend API (business-insights)
- [x] AnalyticsDashboard page (có vẻ đã có)
- [ ] **CHƯA CÓ:** Owner Dashboard với Analytics section
- [ ] **CHƯA CÓ:** Manager Dashboard với Analytics section
- [ ] **Cần kiểm tra:** Charts có hiển thị đúng không?

---

## 🎯 PRIORITY ORDER

### 🔴 CRITICAL (Làm ngay)
1. **Dashboards** (Owner, Manager, Receptionist)
2. **Service Request** (UC 8)
3. **Check-in/Check-out** (UC 9, 10)
4. **PayOS Integration** (UC 5)
5. **Role-based Route Protection**

### 🟡 HIGH (Làm sau Critical)
6. **Promotions Management** (UC 12)
7. **Employees Management** (UC 13)
8. **Zustand Migration** (Foundation)
9. **React Query v5 Upgrade** (Foundation)

### 🟢 MEDIUM (Có thể làm sau)
10. **Neo Brutalism Styling**
11. **Loading/Error/Empty States**
12. **Analytics Charts Enhancement**

---

## 📝 NOTES QUAN TRỌNG

### ⚠️ LƯU Ý KHI PHÁT TRIỂN:
1. **Git Workflow:** Nhớ `git add`, `git commit` trước khi chuyển nhánh!
2. **TypeScript:** Không dùng `any`, tất cả phải có type rõ ràng
3. **Component Size:** Tách component nếu > 200 dòng
4. **Error Handling:** Sử dụng ErrorBoundary và Axios Interceptors
5. **Security:** Masking PII trên UI và logs
6. **Testing:** Test từng feature sau khi làm xong

### 🔧 TECHNICAL DEBT:
- [ ] Migrate Context → Zustand
- [ ] Upgrade React Query v3 → v5
- [ ] Replace Stripe → PayOS
- [ ] Add ErrorBoundary
- [ ] Add Loading States
- [ ] Add Empty States

---

## ✅ CHECKLIST TRƯỚC KHI BẮT ĐẦU MỖI NGÀY

- [ ] Đã commit code ngày hôm trước
- [ ] Đã pull latest code (nếu làm team)
- [ ] Backend đang chạy
- [ ] Frontend đang chạy
- [ ] Đã đọc task list của ngày hôm nay
- [ ] Đã hiểu rõ mục tiêu

---

## 🎉 CHECKLIST HOÀN THÀNH DỰ ÁN

- [ ] Tất cả 14 Use Cases đã implement
- [ ] Tất cả dashboards hoạt động
- [ ] PayOS integration hoạt động
- [ ] Role-based access hoạt động
- [ ] Responsive design hoạt động
- [ ] No critical bugs
- [ ] Code đã được review (self-review)
- [ ] Documentation đã update
- [ ] README đã update
- [ ] **SẴN SÀNG DEMO!** 🚀

---

**Chúc bạn code vui vẻ và hoàn thành đúng deadline! 💪**

