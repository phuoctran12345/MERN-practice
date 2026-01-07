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

### 🗓️ NGÀY 2: 31/12/2025 - OWNER DASHBOARD ✅ HOÀN THÀNH
**Mục tiêu:** Hoàn thành Owner Dashboard với UC 11, 12, 13, 14

#### Task List:
- [x] **2.1 Create Dashboard Layout** ✅
  - [x] Tạo `src/layouts/DashboardLayout.tsx`
  - [x] Tạo `src/components/dashboard/Sidebar.tsx` với menu theo role
  - [x] Apply Neo Brutalism styling
  - [x] Responsive (mobile → hamburger menu)

- [x] **2.2 Owner Dashboard Page** ✅
  - [x] Tạo `src/pages/dashboard/owner/OwnerDashboard.tsx`
  - [x] Tạo route `/dashboard/owner` trong App.tsx
  - [x] Stats Cards component (Revenue, Bookings, Hotels, Employees)
  - [x] Revenue Chart (Recharts)
  - [x] Bookings Chart (Pie/Bar)

- [x] **2.3 Hotels Management Section (UC 11)** ✅
  - [x] Tạo `src/pages/dashboard/owner/HotelsSection.tsx`
  - [x] List hotels với filters
  - [x] CRUD operations (đã có AddHotel, EditHotel, đã integrate)

- [x] **2.4 Employees Management Section (UC 13)** ✅
  - [x] Tạo `src/pages/dashboard/owner/EmployeesSection.tsx`
  - [x] Tạo `src/components/forms/EmployeeForm.tsx`
  - [x] List employees với filters
  - [x] CRUD operations (Create, Read, Update, Delete/Deactivate)
  - [x] Change password functionality (có trong form, có thể thêm API riêng sau)

- [x] **2.5 Promotions Management Section (UC 12)** ✅
  - [x] Tạo `src/pages/dashboard/owner/PromotionsSection.tsx`
  - [x] Tạo `src/components/forms/PromotionForm.tsx`
  - [x] List promotions với filters
  - [x] CRUD operations

- [x] **2.6 Analytics Section (UC 14)** ✅
  - [x] Tạo `src/pages/dashboard/owner/AnalyticsSection.tsx`
  - [x] Revenue charts (daily/weekly/monthly)
  - [x] Occupancy rate charts
  - [x] Performance metrics

**Kết quả mong đợi:** ✅ Owner Dashboard hoàn chỉnh với tất cả sections

---

### 🗓️ NGÀY 3: 1/1/2026 - MANAGER & RECEPTIONIST DASHBOARDS ✅ HOÀN THÀNH
**Mục tiêu:** Hoàn thành Manager và Receptionist Dashboards

#### Task List:
- [x] **3.1 Manager Dashboard (UC 7, 11, 12, 13, 14)** ✅
  - [x] Tạo `src/pages/dashboard/manager/ManagerDashboard.tsx` ✅
  - [x] Tạo route `/dashboard/manager` ✅
  - [x] Today's Overview stats ✅
  - [x] Bookings Management table (UC 7) - Edit/Cancel bookings ✅
  - [x] Rooms Management grid (UC 11) - Reuse HotelsSection từ Owner ✅
  - [x] Promotions Management (UC 12) - Reuse components từ Owner ✅
  - [x] Employees Management (UC 13) - Reuse components từ Owner ✅
  - [x] Analytics (UC 14) - Reuse components từ Owner ✅

- [x] **3.2 Receptionist Dashboard (UC 7, 8, 9, 10)** ✅
  - [x] Tạo `src/pages/dashboard/receptionist/ReceptionistDashboard.tsx` ✅
  - [x] Tạo route `/dashboard/receptionist` ✅
  - [x] Today's Tasks stats ✅
  - [x] All Bookings table (UC 7) - View/Edit bookings ✅
  - [x] Service Requests table (UC 8) - View/Update status ✅

- [x] **3.3 Check-in Page (UC 9)** ✅
  - [x] Tạo `src/pages/dashboard/receptionist/CheckInPage.tsx` ✅
  - [x] Tạo route `/dashboard/receptionist/check-in` ✅
  - [x] Form để nhập booking code hoặc room number ✅
  - [x] Display booking details ✅
  - [x] Confirm check-in button ✅
  - [x] Update booking status → "checked_in" ✅

- [x] **3.4 Check-out Page (UC 10)** ✅
  - [x] Tạo `src/pages/dashboard/receptionist/CheckOutPage.tsx` ✅
  - [x] Tạo route `/dashboard/receptionist/check-out` ✅
  - [x] Form để nhập booking code hoặc room number ✅
  - [x] Display booking details + service requests total ✅
  - [x] Input extra charges ✅
  - [x] Calculate total cost ✅
  - [x] Confirm check-out button ✅
  - [x] Update booking status → "checked_out" ✅

**Kết quả mong đợi:** ✅ Manager và Receptionist Dashboards hoàn chỉnh

---

### 🗓️ NGÀY 4: 2/1/2026 - SERVICE REQUEST & PAYOS INTEGRATION
**Mục tiêu:** Hoàn thành Service Request và tích hợp PayOS

#### Task List:
- [x] **4.1 Service Request Page (UC 8)** ✅
  - [x] Service Request section trong Receptionist Dashboard ✅
  - [x] List service requests với filters ✅
  - [x] Update status (Pending → In Progress → Completed) ✅
  - [ ] Customer có thể tạo request từ MyBookings page (có thể làm sau)

- [x] **4.2 PayOS Integration (UC 5)** ✅ (95% - chỉ còn test)
  - [x] Tạo `src/services/payos.service.ts` (frontend) ✅
  - [x] Update `src/pages/Booking.tsx` để dùng PayOS ✅
  - [x] Tạo payment link từ PayOS ✅
  - [x] Handle PayOS redirect (success/cancel) ✅
  - [x] Tạo `src/pages/PaymentSuccess.tsx` ✅
  - [x] Tạo `src/pages/PaymentCancel.tsx` ✅
  - [x] Update booking flow để tích hợp PayOS ✅
  - [x] Remove Stripe dependencies ✅ (Đã xóa khỏi package.json, configStore.ts, và xóa BookingForm.tsx)
  - [ ] Test payment flow end-to-end (Cần test thực tế với PayOS)

- [x] **4.3 Apply Promotion Code trong Booking (UC 12)** ✅
  - [x] Update BookingForm để có input promotion code ✅
  - [x] Validate promotion code (check active, date range, hotelId) ✅
  - [x] Calculate discount (PERCENTAGE hoặc FIXED_AMOUNT) ✅
  - [x] Apply vào total cost ✅
  - [x] Hiển thị discount amount và final price ✅
  - [x] Lưu promotion code vào booking ✅

- [x] **4.4 Check-out UI Enhancement (UC 10)** ✅
  - [x] Hiển thị breakdown chi phí rõ ràng (đã thanh toán vs chưa thanh toán) ✅
  - [x] Hiển thị chi tiết service requests ✅
  - [x] Payment method selector cho phần thanh toán bổ sung ✅
  - [x] Tính toán số tiền cần thanh toán thêm ✅
  - [x] Validation payment method khi có số tiền cần thanh toán ✅

**Kết quả mong đợi:** Service Request hoạt động, PayOS tích hợp thành công, Check-out UI hoàn thiện

---

### 🗓️ NGÀY 5: 3/1/2026 - REFINEMENT & POLISHING
**Mục tiêu:** Hoàn thiện UI/UX, fix bugs, testing

#### Task List:
- [x] **5.1 UI/UX Improvements** ✅ (60% - một số phần đã có)
  - [x] Apply Neo Brutalism styling cho tất cả dashboards ✅ (Đã có trong DashboardLayout, Sidebar, Header)
  - [x] Loading states (Skeleton loaders, Spinners) ✅ (Đã có LoadingSpinner component, sử dụng trong nhiều pages)
  - [ ] Error states (ErrorBoundary) ❌ (Chưa có ErrorBoundary component)
  - [ ] Empty states components ❌ (Chưa có EmptyState component riêng)
  - [x] Toast notifications cho actions ✅ (Đã có Toaster component, sử dụng showToast trong AppContext)
  - [x] Responsive design cho mobile/tablet ✅ (Đã có responsive trong Layout, Sidebar có hamburger menu)

- [x] **5.2 Role-based Navigation** ✅ (100% - ĐÃ HOÀN THÀNH)
  - [x] Update Header để redirect theo role sau login ✅ (SignIn.tsx đã có redirect logic)
  - [x] Owner → `/dashboard/owner` ✅
  - [x] Manager → `/dashboard/manager` ✅
  - [x] Receptionist → `/dashboard/receptionist` ✅
  - [x] Customer → `/` (Home) ✅

- [x] **5.3 Route Protection** ✅ (90% - ĐÃ HOÀN THÀNH)
  - [x] Protect all dashboard routes ✅ (Tất cả dashboard routes đã có ProtectedRoute với allowedRoles)
  - [x] Protect booking routes (chỉ customer) ✅ (Route `/hotel/:hotelId/booking` đã có ProtectedRoute)
  - [x] Protect hotel management routes (chỉ owner/manager) ✅ (Routes `/add-hotel`, `/edit-hotel` cần kiểm tra thêm)
  - [ ] Test unauthorized access ⚠️ (Cần test thực tế)

- [ ] **5.4 Form Validation** ⚠️ (30% - React Hook Form đã có, thiếu Zod)
  - [ ] Add Zod schemas cho tất cả forms ❌ (Chưa thấy Zod schemas trong forms)
  - [x] React Hook Form integration ✅ (Đã có trong SignIn, Register, BookingForm, GuestInfoForm, etc.)
  - [x] Error messages hiển thị rõ ràng ✅ (Đã có formState.errors trong các forms)

- [x] **5.5 API Integration** ✅ (80% - ĐÃ CÓ ERROR HANDLING)
  - [ ] Test tất cả API calls ⚠️ (Cần test thực tế)
  - [x] Handle error cases (401, 403, 500) ✅ (Đã có axios interceptors xử lý 401, 429, network errors)
  - [ ] Refresh token logic (nếu cần) ⚠️ (Chưa có refresh token logic, chỉ có xóa token khi 401)
  - [ ] Optimistic updates với React Query ⚠️ (Chưa thấy optimistic updates)

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

### ✅ UC 7: Quản lý Đặt phòng (Sửa/Hủy Đơn) - Lễ tân/Manager
- [x] Backend API
- [x] **ĐÃ CÓ:** Manager Dashboard với bookings table ✅
- [x] **ĐÃ CÓ:** Receptionist Dashboard với bookings table ✅
- [x] **ĐÃ CÓ:** Edit booking functionality ✅
- [x] **ĐÃ CÓ:** Cancel booking từ dashboard ✅

### ✅ UC 8: Yêu cầu Dịch vụ
- [x] Backend API
- [x] **ĐÃ CÓ:** Service Request section trong Receptionist Dashboard ✅
- [x] **ĐÃ CÓ:** Service Request form (có thể tạo từ API) ✅
- [x] **ĐÃ CÓ:** List service requests ✅
- [x] **ĐÃ CÓ:** Update status functionality ✅

### ✅ UC 9: Thực hiện Check-in
- [x] Backend API
- [x] **ĐÃ CÓ:** Check-in page ✅
- [x] **ĐÃ CÓ:** Check-in form ✅
- [x] **ĐÃ CÓ:** Update booking status → "checked_in" ✅

### ✅ UC 10: Thực hiện Check-out
- [x] Backend API
- [x] **ĐÃ CÓ:** Check-out page ✅
- [x] **ĐÃ CÓ:** Check-out form với extra charges ✅
- [x] **ĐÃ CÓ:** Calculate total cost ✅
- [x] **ĐÃ CÓ:** Update booking status → "checked_out" ✅
- [x] **ĐÃ CÓ:** Hiển thị breakdown chi phí rõ ràng (đã thanh toán vs chưa thanh toán) ✅
- [x] **ĐÃ CÓ:** Payment method selector cho phần thanh toán bổ sung ✅
- [x] **ĐÃ CÓ:** Hiển thị chi tiết service requests ✅

### ✅ UC 11: Quản lý Danh mục Phòng & KS
- [x] AddHotel page
- [x] EditHotel page
- [x] MyHotels page
- [x] **ĐÃ CÓ:** Owner Dashboard với Hotels section ✅
- [x] **ĐÃ CÓ:** Manager Dashboard với Hotels section ✅
- [x] **ĐÃ CÓ:** CRUD operations đầy đủ ✅

### ✅ UC 12: Quản lý Giá & Khuyến mãi
- [x] Backend API
- [x] **ĐÃ CÓ:** Promotions Management UI (Owner & Manager) ✅
- [x] **ĐÃ CÓ:** Create/Edit/Delete promotions ✅
- [x] **ĐÃ CÓ:** List promotions với filters ✅
- [ ] **CHƯA CÓ:** Apply promotion code trong booking form (Task 4.3 - NGÀY 4)
  - [ ] Input promotion code trong BookingForm
  - [ ] Validate promotion (active, date range, hotelId)
  - [ ] Calculate discount (PERCENTAGE hoặc FIXED_AMOUNT)
  - [ ] Apply vào total cost
  - [ ] Lưu promotion code vào booking

### ✅ UC 13: Quản lý Tài khoản Nhân viên
- [x] Backend API
- [x] **ĐÃ CÓ:** Employees Management UI (Owner & Manager) ✅
- [x] **ĐÃ CÓ:** Create/Edit/Delete employees ✅
- [x] **ĐÃ CÓ:** List employees với filters ✅
- [x] **ĐÃ CÓ:** Activate/Deactivate employees ✅
- [x] **ĐÃ CÓ:** Change password functionality ✅

### ✅ UC 14: Xem Báo cáo Thống kê
- [x] Backend API (business-insights)
- [x] AnalyticsDashboard page (đã có nhưng không dùng nữa)
- [x] **ĐÃ CÓ:** Owner Dashboard với Analytics section ✅
- [x] **ĐÃ CÓ:** Manager Dashboard với Analytics section ✅
- [x] **ĐÃ CÓ:** Charts hiển thị đúng ✅

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

