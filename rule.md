dự án của tui sài typesript

neo brutalims bây chừ ở trang dashboard hãy cho tui 
--------------------------------------------------------------------------------
📜 Quy định Triển khai Dự án Smart Hotel (rule.md)
1. ⚙️ Nền tảng Công nghệ & Framework
Hệ thống tuân thủ stack công nghệ hiện đại để đảm bảo tính mở rộng cho quản lý 14 công ty và tích hợp AI.
• Frontend: React 18, Vite, TypeScript.
• Styling: Tailwind CSS + Ant Design (UI Components).
• Quản lý trạng thái:
    ◦ Global State: Zustand (Dùng cho thông tin User, cấu hình hệ thống).
    ◦ Server State: TanStack React Query (Quản lý caching và đồng bộ dữ liệu API).
• Form & Validation: React Hook Form kết hợp Zod để đảm bảo kiểu dữ liệu an toàn từ client đến server.
• HTTP Client: Axios (Cấu hình base URL và Interceptors cho JWT).


# Danh sách Use Case - Hệ thống Quản lý Đặt phòng Khách sạn

| STT | Tên Use Case | Mục tiêu Chi tiết (Goals) | Tác nhân Chính (Primary Actor) |
| :-- | :--- | :--- | :--- |
| 1 | **Tìm kiếm Khách sạn/Phòng** | Tra cứu danh sách khách sạn và phòng trống theo các tiêu chí (địa điểm, ngày, giá, số người). | Khách hàng |
| 2 | **Đăng ký Tài khoản** | Tạo mới tài khoản người dùng trên hệ thống với các thông tin cá nhân cơ bản. | Khách hàng |
| 3 | **Đăng nhập** | Truy cập hệ thống bằng tài khoản đã đăng ký (Khách hàng, Lễ tân, Quản lý). | Khách hàng, Nhân viên Lễ tân, Quản lý |
| 4 | **Đặt phòng** | Thực hiện quy trình chọn phòng, thêm dịch vụ, xác nhận và gửi yêu cầu đặt phòng. | Khách hàng |
| 5 | **Thanh toán Trực tuyến** | Gửi yêu cầu thanh toán đến Cổng Thanh toán và ghi nhận kết quả giao dịch.Sử dụng PayOs trực quan trên | Khách hàng, Hệ thống Thanh toán |
| 6 | **Quản lý Đặt phòng (Xem/Hủy)** | Khách hàng xem lịch sử đặt phòng và hủy đơn đặt phòng (theo chính sách). | Khách hàng |
| 7 | **Quản lý Đặt phòng (Sửa/Hủy Đơn)** | Lễ tân sửa đổi thông tin đặt phòng (nếu cần) và hủy đơn đặt phòng. | Nhân viên Lễ tân |
| 8 | **Yêu cầu Dịch vụ** | Gửi yêu cầu thêm dịch vụ (ăn uống, giặt ủi, dọn phòng...) trong thời gian lưu trú. | Khách hàng |
| 9 | **Thực hiện Check-in** | Xác nhận mã đặt phòng, làm thủ tục nhận phòng và cập nhật trạng thái đơn đặt phòng sang "Đang ở". | Nhân viên Lễ tân |
| 10 | **Thực hiện Check-out** | Tổng hợp chi phí phát sinh, xử lý thanh toán bổ sung (nếu có), in hóa đơn và cập nhật trạng thái đơn đặt phòng sang "Hoàn tất". | Nhân viên Lễ tân |
| 11 | **Quản lý Danh mục Phòng & KS** | Thêm, sửa, xóa thông tin Khách sạn, Phòng, Loại phòng, Dịch vụ. | Quản lý |
| 12 | **Quản lý Giá & Khuyến mãi** | Điều chỉnh giá phòng theo mùa, thiết lập và quản lý các chương trình khuyến mãi. | Quản lý |
| 13 | **Quản lý Tài khoản Nhân viên** | Thêm, sửa, xóa tài khoản Nhân viên Lễ tân và Quản lý. | Quản lý |
| 14 | **Xem Báo cáo Thống kê** | Xem các báo cáo tổng hợp về doanh thu, tỷ lệ lấp đầy, hiệu suất nhân viên theo ngày/tuần/tháng. | Quản lý |