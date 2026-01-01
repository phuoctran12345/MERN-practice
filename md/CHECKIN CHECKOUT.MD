# 📖 USER STORIES - UC 9: Thực hiện Check-in

## 🎯 Use Case: Thực hiện Check-in
**Mục tiêu:** Xác nhận mã đặt phòng, làm thủ tục nhận phòng và cập nhật trạng thái đơn đặt phòng sang "Đang ở".  
**Tác nhân:** Nhân viên Lễ tân

---

## 📋 USER STORY 1: Khách đặt phòng ONLINE

### **As a** Nhân viên Lễ tân  
### **I want to** Check-in khách hàng đã đặt phòng online  
### **So that** Khách có thể nhận phòng và cập nhật trạng thái booking

### **Scenario 1.1: Check-in thành công với booking code**

**Given** Khách hàng đã đặt phòng online qua website  
**And** Booking có status = "confirmed"  
**And** Ngày check-in là hôm nay  
**When** Nhân viên Lễ tân:
1. Mở trang Check-in (`/dashboard/receptionist/check-in`)
2. Nhập **booking code** (hoặc booking ID) vào ô tìm kiếm
3. Click nút "TÌM KIẾM"
4. Hệ thống hiển thị thông tin booking:
   - Guest name: "Nguyễn Văn A"
   - Email: "nguyenvana@gmail.com"
   - Phone: "0901234567"
   - Check-in date: "31/12/2025"
   - Check-out date: "02/01/2026"
   - Room type: "Deluxe Double"
   - Total cost: "2,000,000 VND"
   - Status: "Đã xác nhận"
5. Nhân viên xác nhận thông tin đúng
6. Click nút "CONFIRM CHECK-IN"
7. Hệ thống cập nhật status → "checked_in"
8. Hệ thống hiển thị thông báo "Check-in thành công!"

**Then** Booking status được cập nhật thành "checked_in"  
**And** Khách có thể nhận phòng  
**And** Hệ thống ghi nhận thời gian check-in

---

### **Scenario 1.2: Check-in với room number**

**Given** Khách hàng đã đặt phòng online  
**And** Booking đã được assign room number  
**When** Nhân viên Lễ tân:
1. Nhập **room number** (ví dụ: "101") vào ô tìm kiếm
2. Click "TÌM KIẾM"
3. Hệ thống tìm booking có roomId = "101"
4. Hiển thị thông tin booking tương ứng
5. Click "CONFIRM CHECK-IN"

**Then** Booking được check-in thành công  
**And** Room status được cập nhật là "occupied"

---

### **Scenario 1.3: Check-in trước giờ (Early Check-in)**

**Given** Khách đặt phòng online với check-in date = "01/01/2026"  
**And** Hôm nay là "31/12/2025" (1 ngày trước)  
**When** Nhân viên Lễ tân tìm booking và click "CONFIRM CHECK-IN"  
**Then** Hệ thống hiển thị cảnh báo: "Khách check-in sớm 1 ngày. Bạn có muốn tiếp tục?"  
**And** Nếu nhân viên xác nhận → Check-in thành công  
**And** Nếu nhân viên hủy → Không check-in

---

### **Scenario 1.4: Check-in với booking đã check-in rồi**

**Given** Booking đã được check-in (status = "checked_in")  
**When** Nhân viên tìm booking và cố check-in lại  
**Then** Hệ thống hiển thị: "Booking này đã được check-in rồi!"  
**And** Nút "CONFIRM CHECK-IN" bị disable hoặc ẩn

---

### **Scenario 1.5: Không tìm thấy booking**

**Given** Nhân viên nhập booking code không tồn tại  
**When** Click "TÌM KIẾM"  
**Then** Hệ thống hiển thị: "Không tìm thấy booking với mã này"  
**And** Gợi ý: "Vui lòng kiểm tra lại booking code hoặc thử tìm bằng room number"

---

## 📋 USER STORY 2: Khách vãng lai đặt ONSITE

### **As a** Nhân viên Lễ tân  
### **I want to** Tạo booking mới và check-in ngay cho khách vãng lai  
### **So that** Khách có thể ở ngay mà không cần đặt trước online

### **Scenario 2.1: Tạo booking onsite và check-in ngay**

**Given** Khách vãng lai đến khách sạn muốn đặt phòng  
**And** Còn phòng trống  
**When** Nhân viên Lễ tân:
1. Mở trang Check-in
2. Click nút "TẠO BOOKING MỚI" (hoặc "WALK-IN BOOKING")
3. Điền form thông tin khách:
   - First Name: "Trần"
   - Last Name: "Thị B"
   - Email: "tranthib@gmail.com" (optional)
   - Phone: "0912345678"
   - Check-in date: Hôm nay (auto-fill)
   - Check-out date: Chọn ngày (ví dụ: 02/01/2026)
   - Room type: Chọn từ dropdown (ví dụ: "Standard Single")
   - Number of guests: 1
4. Hệ thống tính toán giá:
   - Price per night: 1,000,000 VND
   - Number of nights: 2
   - Total: 2,000,000 VND
5. Click "TẠO BOOKING VÀ CHECK-IN"
6. Hệ thống:
   - Tạo booking mới với status = "checked_in" (skip "confirmed")
   - Assign room number tự động (nếu có)
   - Ghi nhận thời gian check-in = now
7. Hiển thị thông báo: "Đã tạo booking và check-in thành công!"

**Then** Booking được tạo với status = "checked_in"  
**And** Khách có thể nhận phòng ngay  
**And** Booking được lưu vào database

---

### **Scenario 2.2: Tạo booking onsite với thanh toán trước**

**Given** Khách vãng lai muốn đặt phòng  
**When** Nhân viên tạo booking onsite  
**And** Khách thanh toán ngay tại quầy  
**Then** Booking được tạo với:
   - Status = "checked_in"
   - Payment status = "paid"
   - Payment method = "cash" hoặc "card"
   - Receipt được in ngay

---

### **Scenario 2.3: Tạo booking onsite nhưng chưa thanh toán**

**Given** Khách vãng lai muốn đặt phòng  
**When** Nhân viên tạo booking onsite  
**And** Khách chưa thanh toán (sẽ thanh toán khi check-out)  
**Then** Booking được tạo với:
   - Status = "checked_in"
   - Payment status = "pending"
   - Ghi chú: "Thanh toán khi check-out"

---

### **Scenario 2.4: Không còn phòng trống**

**Given** Khách vãng lai muốn đặt phòng  
**And** Tất cả phòng đã được đặt hết  
**When** Nhân viên cố tạo booking onsite  
**Then** Hệ thống hiển thị: "Xin lỗi, hiện tại không còn phòng trống"  
**And** Gợi ý: "Bạn có muốn đặt phòng cho ngày mai không?"

---

## 🔄 SO SÁNH 2 FLOWS

### **Flow 1: Khách đặt ONLINE**
```
1. Khách đặt phòng trên website
   ↓
2. Booking được tạo với status = "pending"
   ↓
3. Khách thanh toán online (PayOS)
   ↓
4. Booking status → "confirmed"
   ↓
5. Khách đến khách sạn
   ↓
6. Lễ tân check-in (UC 9)
   ↓
7. Booking status → "checked_in"
```

### **Flow 2: Khách vãng lai đặt ONSITE**
```
1. Khách đến khách sạn trực tiếp
   ↓
2. Lễ tân tạo booking mới
   ↓
3. Booking được tạo với status = "checked_in" (skip confirmed)
   ↓
4. Khách thanh toán tại quầy (hoặc thanh toán khi check-out)
   ↓
5. Khách nhận phòng ngay
```

---

## 🎨 UI/UX REQUIREMENTS

### **Check-in Page cho Online Booking:**
- ✅ Search box để tìm booking code hoặc room number
- ✅ Hiển thị thông tin booking chi tiết
- ✅ Button "CONFIRM CHECK-IN"
- ✅ Hiển thị cảnh báo nếu check-in sớm/muộn
- ✅ Hiển thị lỗi nếu booking không tồn tại hoặc đã check-in

### **Check-in Page cho Onsite Booking:**
- ✅ Button "TẠO BOOKING MỚI" hoặc "WALK-IN BOOKING"
- ✅ Form điền thông tin khách
- ✅ Auto-fill check-in date = hôm nay
- ✅ Dropdown chọn room type
- ✅ Hiển thị giá tự động
- ✅ Option thanh toán ngay hoặc thanh toán sau
- ✅ Button "TẠO BOOKING VÀ CHECK-IN"

---

## 📝 ACCEPTANCE CRITERIA

### **Cho Online Booking:**
- [ ] Có thể tìm booking bằng booking code
- [ ] Có thể tìm booking bằng room number
- [ ] Hiển thị đầy đủ thông tin booking
- [ ] Chỉ check-in được booking có status = "confirmed"
- [ ] Cập nhật status → "checked_in" thành công
- [ ] Ghi nhận thời gian check-in
- [ ] Hiển thị thông báo thành công/lỗi

### **Cho Onsite Booking:**
- [ ] Có thể tạo booking mới từ trang Check-in
- [ ] Form validation đầy đủ
- [ ] Auto-calculate giá dựa trên room type và số đêm
- [ ] Tạo booking với status = "checked_in" ngay
- [ ] Có option thanh toán ngay hoặc thanh toán sau
- [ ] Assign room number tự động (nếu có)
- [ ] Hiển thị thông báo thành công

---

## 🔧 TECHNICAL NOTES

### **API Endpoints cần có:**

1. **GET /api/bookings/search?code={bookingCode}** - Tìm booking theo code
2. **GET /api/bookings/search?roomId={roomId}** - Tìm booking theo room number
3. **POST /api/bookings/check-in** - Check-in booking
4. **POST /api/bookings/walk-in** - Tạo booking onsite và check-in ngay

### **Database Fields:**
- `booking.status`: "pending" → "confirmed" → "checked_in" → "checked_out"
- `booking.checkInTime`: Thời gian thực tế check-in
- `booking.paymentStatus`: "paid" | "pending"
- `booking.paymentMethod`: "online" | "cash" | "card"

---

---

# 📖 USER STORIES - UC 10: Thực hiện Check-out

## 🎯 Use Case: Thực hiện Check-out
**Mục tiêu:** Tổng hợp chi phí phát sinh, xử lý thanh toán bổ sung (nếu có), in hóa đơn và cập nhật trạng thái đơn đặt phòng sang "Hoàn tất".  
**Tác nhân:** Nhân viên Lễ tân

---

## 📋 USER STORY 3: Check-out khách đặt ONLINE

### **As a** Nhân viên Lễ tân  
### **I want to** Check-out khách hàng đã đặt phòng online  
### **So that** Khách có thể thanh toán các chi phí phát sinh và hoàn tất lưu trú

### **Scenario 3.1: Check-out thành công với booking code**

**Given** Khách hàng đã check-in (status = "checked_in")  
**And** Ngày check-out là hôm nay  
**When** Nhân viên Lễ tân:
1. Mở trang Check-out (`/dashboard/receptionist/check-out`)
2. Nhập **booking code** (hoặc booking ID) vào ô tìm kiếm
3. Click nút "TÌM KIẾM"
4. Hệ thống hiển thị thông tin booking:
   - Guest name: "Nguyễn Văn A"
   - Email: "nguyenvana@gmail.com"
   - Check-in date: "31/12/2025"
   - Check-out date: "02/01/2026"
   - Room number: "101"
   - **Booking cost:** 2,000,000 VND (đã thanh toán online)
   - **Service requests total:** 500,000 VND
     - Room service: 200,000 VND
     - Laundry: 300,000 VND
   - **Extra charges:** (nhân viên nhập)
     - Minibar: 150,000 VND
     - Late checkout: 200,000 VND
   - **Total cost:** 2,850,000 VND
5. Nhân viên nhập extra charges (nếu có)
6. Nhân viên xác nhận tổng chi phí
7. Click nút "CONFIRM CHECK-OUT"
8. Hệ thống:
   - Tính tổng chi phí (booking + service requests + extra charges)
   - Cập nhật booking status → "checked_out"
   - Cập nhật payment status (nếu có thanh toán bổ sung)
   - Ghi nhận thời gian check-out
9. Hiển thị thông báo "Check-out thành công!"
10. In hóa đơn (hoặc hiển thị hóa đơn điện tử)

**Then** Booking status được cập nhật thành "checked_out"  
**And** Tổng chi phí được tính đúng  
**And** Hóa đơn được tạo  
**And** Room status được cập nhật là "available"

---

### **Scenario 3.2: Khách đặt online - Thanh toán online toàn bộ - Nâng cấp dịch vụ - Check-out**

**Flow chi tiết:**

```
1. Khách đặt phòng online: 2,000,000 VND
   ↓
2. Thanh toán online (PayOS): 2,000,000 VND ✅
   - Payment status: "paid"
   - Booking status: "confirmed"
   ↓
3. Check-in: status → "checked_in"
   ↓
4. Trong thời gian lưu trú - Khách nâng cấp dịch vụ:
   - Room service: 200,000 VND
   - Laundry: 300,000 VND
   - Minibar: 150,000 VND
   - Service requests được tạo (status: "pending" hoặc "completed")
   ↓
5. Check-out:
   ┌─────────────────────────────────────┐
   │ COST BREAKDOWN:                     │
   │                                     │
   │ ✅ Booking Cost: 2,000,000 VND    │
   │    (Đã thanh toán online)          │
   │                                     │
   │ ⚠️  Service Requests: 650,000 VND  │
   │    • Room service: 200,000 VND     │
   │    • Laundry: 300,000 VND         │
   │    • Minibar: 150,000 VND         │
   │                                     │
   │ ⚠️  Extra Charges: 200,000 VND    │
   │    (Late checkout, damage, etc.)   │
   │                                     │
   │ ─────────────────────────────────  │
   │ Total Cost: 2,850,000 VND          │
   │ Đã thanh toán: 2,000,000 VND ✅   │
   │ Cần thanh toán thêm: 850,000 VND ⚠️│
   └─────────────────────────────────────┘
   ↓
6. Khách thanh toán thêm 850,000 VND tại quầy
   - Payment method: "cash" hoặc "card"
   ↓
7. Hệ thống cập nhật:
   - Booking status → "checked_out"
   - Payment status → "paid" (full payment)
   - Total cost → 2,850,000 VND
   - Lưu payment method bổ sung
   ↓
8. In hóa đơn với breakdown:
   - Booking: 2,000,000 VND (đã thanh toán online)
   - Service requests: 650,000 VND (thanh toán tại quầy)
   - Extra charges: 200,000 VND (thanh toán tại quầy)
   - Total: 2,850,000 VND
```

**Given** Khách đã đặt phòng online và thanh toán toàn bộ booking cost (2,000,000 VND)  
**And** Khách đã check-in thành công (status = "checked_in")  
**And** Trong thời gian lưu trú, khách đã nâng cấp dịch vụ:
   - Room service: 200,000 VND
   - Laundry: 300,000 VND
   - Minibar: 150,000 VND
   - Service requests được tạo với status = "completed"
**And** Có extra charges khi check-out: 200,000 VND (late checkout, damage, etc.)  
**When** Nhân viên Lễ tân check-out:
1. Mở trang Check-out (`/dashboard/receptionist/check-out`)
2. Tìm booking bằng booking code hoặc room number
3. Hệ thống hiển thị breakdown chi phí rõ ràng:
   - **✅ Booking Cost:** 2,000,000 VND (Đã thanh toán online)
   - **⚠️ Service Requests:** 650,000 VND (chưa thanh toán)
     - Chi tiết từng service:
       - Room service: 200,000 VND
       - Laundry: 300,000 VND
       - Minibar: 150,000 VND
   - **⚠️ Extra Charges:** 200,000 VND (chưa thanh toán)
   - **Total Cost:** 2,850,000 VND
   - **Đã thanh toán:** 2,000,000 VND ✅
   - **Cần thanh toán thêm:** 850,000 VND ⚠️ (highlight màu đỏ/cảnh báo)
4. Nhân viên nhập extra charges (nếu chưa có trong hệ thống)
5. Nhân viên xác nhận với khách về số tiền cần thanh toán thêm (850,000 VND)
6. Khách thanh toán thêm 850,000 VND tại quầy
   - Nhân viên chọn payment method: "cash" hoặc "card"
7. Nhân viên click "CONFIRM CHECK-OUT"
8. Hệ thống:
   - Tính tổng chi phí: 2,850,000 VND
   - Cập nhật booking status → "checked_out"
   - Cập nhật payment status → "paid" (full payment)
   - Lưu payment method bổ sung = "cash" hoặc "card"
   - Ghi nhận tổng chi phí = 2,850,000 VND
   - Ghi nhận thời gian check-out
9. Hiển thị thông báo "Check-out thành công!"
10. In hóa đơn (hoặc hiển thị hóa đơn điện tử) với breakdown đầy đủ:
    - Booking: 2,000,000 VND (đã thanh toán online) ✅
    - Service requests: 650,000 VND (thanh toán tại quầy)
      - Room service: 200,000 VND
      - Laundry: 300,000 VND
      - Minibar: 150,000 VND
    - Extra charges: 200,000 VND (thanh toán tại quầy)
    - Total: 2,850,000 VND

**Then** Booking được check-out thành công  
**And** Payment status = "paid" (full payment)  
**And** Hóa đơn hiển thị rõ ràng phần đã thanh toán online và phần thanh toán tại quầy  
**And** Khách có thể nhận hóa đơn và rời khách sạn

**Kết quả:**
- ✅ Khách đã thanh toán đủ booking cost online
- ⚠️ Khách cần thanh toán thêm phần service requests + extra charges tại quầy khi check-out
- ✅ Hệ thống tính toán và hiển thị breakdown rõ ràng
- ✅ Payment status = "paid" sau khi thanh toán đủ
- ✅ Hóa đơn hiển thị đầy đủ breakdown

---

### **Scenario 3.3: Check-out với room number**

**Given** Khách đã check-in ở room "101"  
**When** Nhân viên nhập **room number** "101" vào ô tìm kiếm  
**Then** Hệ thống tìm booking có roomId = "101"  
**And** Hiển thị thông tin booking tương ứng  
**And** Check-out thành công

---

### **Scenario 3.4: Check-out trước giờ (Early Check-out)**

**Given** Khách đặt phòng với check-out date = "02/01/2026"  
**And** Hôm nay là "01/01/2026" (1 ngày trước)  
**When** Nhân viên tìm booking và click "CONFIRM CHECK-OUT"  
**Then** Hệ thống hiển thị cảnh báo: "Khách check-out sớm 1 ngày. Bạn có muốn tiếp tục?"  
**And** Nếu nhân viên xác nhận → Check-out thành công  
**And** Nếu nhân viên hủy → Không check-out

---

### **Scenario 3.5: Check-out với booking chưa check-in**

**Given** Booking có status = "confirmed" (chưa check-in)  
**When** Nhân viên cố check-out  
**Then** Hệ thống hiển thị: "Booking này chưa được check-in. Vui lòng check-in trước!"  
**And** Nút "CONFIRM CHECK-OUT" bị disable

---

### **Scenario 3.6: Check-out với booking đã check-out rồi**

**Given** Booking đã được check-out (status = "checked_out")  
**When** Nhân viên tìm booking và cố check-out lại  
**Then** Hệ thống hiển thị: "Booking này đã được check-out rồi!"  
**And** Nút "CONFIRM CHECK-OUT" bị disable hoặc ẩn

---

## 📋 USER STORY 4: Check-out khách vãng lai đặt ONSITE

### **As a** Nhân viên Lễ tân  
### **I want to** Check-out khách vãng lai đã đặt phòng onsite  
### **So that** Khách có thể thanh toán và hoàn tất lưu trú

### **Scenario 4.1: Check-out với thanh toán đầy đủ**

**Given** Khách vãng lai đã check-in onsite  
**And** Khách chưa thanh toán (payment status = "pending")  
**When** Nhân viên Lễ tân:
1. Mở trang Check-out
2. Tìm booking bằng booking code hoặc room number
3. Hệ thống hiển thị:
   - **Booking cost:** 2,000,000 VND (chưa thanh toán)
   - **Service requests:** 500,000 VND
   - **Extra charges:** 350,000 VND
   - **Total:** 2,850,000 VND
4. Khách thanh toán đầy đủ tại quầy (cash/card)
5. Nhân viên click "CONFIRM CHECK-OUT"
6. Hệ thống:
   - Cập nhật payment status → "paid"
   - Cập nhật booking status → "checked_out"
   - Ghi nhận payment method = "cash" hoặc "card"
7. In hóa đơn

**Then** Booking được check-out thành công  
**And** Payment status = "paid"  
**And** Hóa đơn được tạo

---

### **Scenario 4.2: Check-out với thanh toán một phần**

**Given** Khách vãng lai đã thanh toán một phần khi check-in (1,000,000 VND)  
**And** Tổng chi phí = 2,850,000 VND  
**When** Nhân viên check-out  
**Then** Hệ thống tính:
   - Đã thanh toán: 1,000,000 VND
   - Cần thanh toán thêm: 1,850,000 VND
   - Total: 2,850,000 VND
**And** Khách thanh toán phần còn lại  
**And** Payment status → "paid"

---

### **Scenario 4.3: Check-out với ghi chú**

**Given** Khách vãng lai check-out  
**When** Nhân viên check-out  
**And** Nhập ghi chú: "Khách yêu cầu late checkout đến 14:00"  
**Then** Ghi chú được lưu vào booking  
**And** Hiển thị trong hóa đơn

---

## 🔄 SO SÁNH CHECK-IN vs CHECK-OUT

### **Check-in Flow:**
```
1. Tìm booking (booking code/room number)
   ↓
2. Hiển thị thông tin booking
   ↓
3. Xác nhận check-in
   ↓
4. Status → "checked_in"
```

### **Check-out Flow:**
```
1. Tìm booking (booking code/room number)
   ↓
2. Hiển thị thông tin booking + service requests
   ↓
3. Tính tổng chi phí (booking + services + extra)
   ↓
4. Nhập extra charges (nếu có)
   ↓
5. Xác nhận thanh toán
   ↓
6. Status → "checked_out"
   ↓
7. In hóa đơn
```

---

## 🎨 UI/UX REQUIREMENTS - CHECK-OUT

### **Check-out Page cho Online Booking:**
- ✅ Search box để tìm booking code/room number
- ✅ Hiển thị thông tin booking chi tiết
- ✅ Hiển thị danh sách service requests và tổng tiền
- ✅ Input field để nhập extra charges
- ✅ Auto-calculate total cost
- ✅ **Hiển thị breakdown chi phí rõ ràng:**
   - **Booking cost:** X VND (đã thanh toán online) ✅
   - **Service requests total:** Y VND (chưa thanh toán) ⚠️
     - Chi tiết từng service request
   - **Extra charges:** Z VND (chưa thanh toán) ⚠️
   - **Total cost:** X + Y + Z VND
   - **Đã thanh toán:** X VND
   - **Cần thanh toán thêm:** Y + Z VND (highlight màu đỏ/cảnh báo)
- ✅ Option chọn payment method cho phần thanh toán bổ sung (cash/card)
- ✅ Button "CONFIRM CHECK-OUT"
- ✅ Hiển thị hóa đơn sau khi check-out với breakdown đầy đủ

### **Check-out Page cho Onsite Booking:**
- ✅ Tương tự Online Booking
- ✅ Hiển thị payment status (paid/pending)
- ✅ Option thanh toán ngay (cash/card)
- ✅ Ghi chú (optional)
- ✅ In hóa đơn ngay

---

## 📝 ACCEPTANCE CRITERIA - CHECK-OUT

### **Cho Online Booking:**
- [ ] Có thể tìm booking bằng booking code
- [ ] Có thể tìm booking bằng room number
- [ ] Hiển thị đầy đủ thông tin booking
- [ ] Hiển thị danh sách service requests và tổng tiền
- [ ] Có thể nhập extra charges
- [ ] Auto-calculate total cost
- [ ] Chỉ check-out được booking có status = "checked_in"
- [ ] Cập nhật status → "checked_out" thành công
- [ ] Ghi nhận thời gian check-out
- [ ] Xử lý thanh toán bổ sung (nếu có)
- [ ] Hiển thị hóa đơn
- [ ] Hiển thị thông báo thành công/lỗi

### **Cho Onsite Booking:**
- [ ] Tương tự Online Booking
- [ ] Xử lý thanh toán đầy đủ hoặc một phần
- [ ] Có option thanh toán cash/card
- [ ] Có thể thêm ghi chú
- [ ] In hóa đơn ngay

---

## 🔧 TECHNICAL NOTES - CHECK-OUT

### **API Endpoints cần có:**

1. **GET /api/bookings/search?code={bookingCode}** - Tìm booking theo code (reuse từ check-in)
2. **GET /api/bookings/search?roomId={roomId}** - Tìm booking theo room number (reuse từ check-in)
3. **GET /api/service-requests?bookingId={bookingId}** - Lấy service requests của booking
4. **POST /api/bookings/check-out** - Check-out booking
   - Body: `{ bookingId, extraCharges?, notes?, paymentMethod?, paymentStatus? }`

### **Database Fields:**
- `booking.status`: "checked_in" → "checked_out"
- `booking.checkOutTime`: Thời gian thực tế check-out
- `booking.extraCharges`: Array các chi phí phát sinh
- `booking.totalCost`: Tổng chi phí (booking + services + extra)
- `booking.paymentStatus`: "paid" | "pending" | "partial"
- `booking.paymentMethod`: "online" | "cash" | "card"
- `booking.notes`: Ghi chú khi check-out

### **Calculation Logic:**
```typescript
// Tính tổng chi phí
bookingCost = booking.totalCost // Đã thanh toán online
serviceRequestsTotal = sum(serviceRequests.map(req => req.price))
extraChargesTotal = extraCharges || 0
totalCost = bookingCost + serviceRequestsTotal + extraChargesTotal

// Tính số tiền cần thanh toán thêm
alreadyPaid = booking.paymentStatus === "paid" ? bookingCost : 0
amountToPay = totalCost - alreadyPaid

// Nếu amountToPay > 0 → Khách cần thanh toán thêm tại quầy
// Nếu amountToPay === 0 → Khách đã thanh toán đủ (không có service/extra)
// Nếu amountToPay < 0 → Lỗi logic (không nên xảy ra)
```

### **Payment Status Logic:**
```typescript
// Trước check-out
if (booking.paymentStatus === "paid" && booking.totalCost === bookingCost) {
  // Đã thanh toán đủ booking cost
  // Nhưng có thể có service requests hoặc extra charges chưa thanh toán
}

// Sau check-out
if (amountToPay > 0) {
  // Khách thanh toán thêm tại quầy
  paymentStatus = "paid" // Full payment
  paymentMethod = "cash" | "card" // Phương thức thanh toán bổ sung
  // Lưu thông tin: booking đã thanh toán online + thanh toán bổ sung tại quầy
} else {
  // Không có chi phí phát sinh → Không cần thanh toán thêm
  paymentStatus = "paid" // Giữ nguyên
}
```

---

## ✅ KẾT LUẬN

### **Check-in (UC 9):**
- **User Story 1 (Online):** Khách đặt online → Lễ tân check-in bằng booking code
- **User Story 2 (Onsite):** Khách vãng lai → Lễ tân tạo booking mới và check-in ngay

### **Check-out (UC 10):**
- **User Story 3 (Online):** Khách đặt online → Lễ tân check-out, tính tổng chi phí, xử lý thanh toán bổ sung
- **User Story 4 (Onsite):** Khách vãng lai → Lễ tân check-out, thanh toán đầy đủ, in hóa đơn

**Cả 2 flows (Check-in & Check-out) đều cần được support đầy đủ!** 🎯

