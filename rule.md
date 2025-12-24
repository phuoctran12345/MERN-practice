dự án của tui sài typesript



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

--------------------------------------------------------------------------------
2. 🏛️ Mô hình Kiến trúc (Layered Architecture)
Dự án áp dụng Layered Architecture Pattern để tách biệt trách nhiệm giữa giao diện và nghiệp vụ phức tạp của CLM (Quản lý hợp đồng) và AI.
graph TD
    subgraph "Presentation Layer"
        A[React Components] -->|Chỉ lo Render & UI| B[Ant Design / Tailwind]
    end
    subgraph "Application Layer"
        C[Custom Hooks] -->|Quản lý Logic State & React Query| A
    end
    subgraph "Domain Layer"
        D[Business Logic Classes] -->|Xử lý nghiệp vụ: Tính tiền, Phân tích rủi ro| C
    end
    subgraph "Data Access Layer"
        E[Services / API calls] -->|Axios giao tiếp Backend| D
    end
Chi tiết các lớp:
• Presentation Layer: Sử dụng các thành phần của Ant Design để xây dựng giao diện quản lý phòng, upload hợp đồng và dashboard báo cáo.
• Application Layer: Các Custom Hooks xử lý việc đóng mở Modal, trạng thái loading khi AI đang tóm tắt điều khoản hợp đồng.
• Domain Layer: Chứa logic nghiệp vụ cốt lõi như: phân loại 14 công ty, logic tính toán ngày gia hạn hợp đồng (alert trước 90 ngày), và quy tắc phân tích rủi ro.
• Data Access Layer: Định nghĩa các hàm gọi API tới Node.js Backend để thực hiện CRUD và truy vấn RAG.

--------------------------------------------------------------------------------
3. 🛠️ Nguyên tắc Triển khai Use Case
Dựa trên danh sách Use Case từ nguồn tài liệu, việc phát triển phải tuân thủ các bước:
A. Đối với Use Case CRUD (Khách sạn, Phòng, Công ty)
1. Validation: Sử dụng Zod schema để validate dữ liệu đầu vào (ví dụ: mã số thuế, số phòng).
2. State: Dùng React Query để quản lý danh sách phòng và trạng thái đặt phòng (Check-in/Check-out).
3. Phân quyền (RBAC): Đảm bảo nhân viên chỉ thấy dữ liệu thuộc company_id của mình.
B. Đối với Use Case Hợp đồng (CLM) & AI
1. Xử lý tệp: Sử dụng component Upload để gửi file PDF về Backend xử lý OCR và trích xuất dữ liệu.
2. AI Query: Sử dụng luồng RAG (Retrieval-Augmented Generation) để người dùng hỏi đáp về điều khoản hợp đồng bằng ngôn ngữ tự nhiên.
3. Tracking: Logic theo dõi nghĩa vụ và thời hạn phải được xử lý ở lớp Domain để kích hoạt thông báo tự động.

--------------------------------------------------------------------------------
4. 📂 Cấu trúc Thư mục Đề xuất (Frontend)
src/
├── api/              # Data Access Layer (Axios services)
├── components/       # Presentation Layer (UI chung)
├── hooks/            # Application Layer (Custom hooks, React Query)
├── modules/          # Chứa các Use Case lớn (Contract, Booking, AI-Search)
│   ├── domain/       # Domain Layer (Logic nghiệp vụ riêng cho module)
│   └── components/   # UI riêng cho module
├── store/            # Zustand stores (User, Company context)
├── types/            # TypeScript interfaces & Zod schemas
└── utils/            # Helper functions (Format tiền, ngày tháng)

--------------------------------------------------------------------------------
5. 📝 Quy tắc Coding (Coding Norms)
• TypeScript: Tuyệt đối không sử dụng any. Tất cả API response phải có interface rõ ràng.
• Component: Ưu tiên Functional Component. Tách nhỏ component nếu vượt quá 200 dòng code.
• Error Handling: Sử dụng ErrorBoundary cho UI và Axios Interceptors để xử lý lỗi 401 (hết hạn token) hoặc 403 (không có quyền truy cập công ty).
• Security: Masking các thông tin nhạy cảm (PII) trên giao diện và log.

--------------------------------------------------------------------------------
6. 🎨 Nguyên tắc UI/UX Design (UI/UX Design Principles)
A. Thiết kế Giao diện (Visual Design)
• Design System: Tuân thủ Ant Design Design Tokens (màu sắc, typography, spacing) để đảm bảo tính nhất quán.
• Color Palette: 
    ◦ Primary: Màu chủ đạo cho các action buttons và highlights (ví dụ: #1890ff - Ant Design Blue).
    ◦ Success: Xanh lá cho trạng thái thành công (Check-in, thanh toán hoàn tất).
    ◦ Warning: Cam/vàng cho cảnh báo (hợp đồng sắp hết hạn, phòng cần bảo trì).
    ◦ Error: Đỏ cho lỗi và hành động hủy bỏ.
    ◦ Neutral: Xám cho text phụ và borders.
• Typography: 
    ◦ Heading (h1-h4): Font weight 600-700, size từ 24px-32px cho tiêu đề chính.
    ◦ Body text: Font weight 400, size 14px-16px cho nội dung thông thường.
    ◦ Caption: Font weight 400, size 12px cho ghi chú và metadata.
• Spacing: Sử dụng hệ thống spacing của Tailwind (4px base unit): 4, 8, 12, 16, 24, 32, 48, 64px.
• Shadows & Borders: 
    ◦ Cards: border-radius 8px, box-shadow nhẹ (0 2px 8px rgba(0,0,0,0.1)).
    ◦ Buttons: border-radius 6px, hover effect với transition 0.3s ease.
    ◦ Input fields: border 1px solid #d9d9d9, focus border-color primary.

B. Trải nghiệm Người dùng (User Experience)
• Loading States: 
    ◦ Hiển thị Skeleton loading cho danh sách phòng/hợp đồng khi đang fetch dữ liệu.
    ◦ Spinner hoặc Progress bar cho các thao tác async (upload file PDF, AI đang xử lý).
    ◦ Không để màn hình trắng, luôn có feedback visual.
• Error States: 
    ◦ Hiển thị message rõ ràng với icon và màu đỏ (ví dụ: "Không thể tải danh sách phòng. Vui lòng thử lại.").
    ◦ Cung cấp nút "Thử lại" hoặc "Quay lại" để người dùng có thể khắc phục.
    ◦ Empty states: Hiển thị illustration hoặc icon kèm message hữu ích (ví dụ: "Chưa có hợp đồng nào. Hãy upload file PDF để bắt đầu.").
• Form UX: 
    ◦ Validation real-time: Hiển thị lỗi ngay khi người dùng blur khỏi field (không chờ submit).
    ◦ Label rõ ràng, placeholder text gợi ý (ví dụ: "Nhập mã số thuế 10 số").
    ◦ Required fields đánh dấu bằng dấu sao (*) màu đỏ.
    ◦ Disable submit button khi form invalid, enable khi valid.
• Navigation & Layout: 
    ◦ Sidebar menu với icons và labels rõ ràng cho các module chính (Quản lý phòng, Hợp đồng, Dashboard).
    ◦ Breadcrumb navigation cho các trang con (ví dụ: Dashboard > Hợp đồng > Chi tiết hợp đồng #123).
    ◦ Header cố định (sticky) chứa thông tin user, notifications, và company selector.
    ◦ Responsive: Mobile-first approach, breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px).
• Feedback & Notifications: 
    ◦ Toast notifications (Ant Design message/notification) cho các action thành công/thất bại.
    ◦ Duration: Success 3s, Error 5s (để người dùng đọc kỹ), Warning 4s.
    ◦ Position: Top-right cho desktop, bottom-center cho mobile.
    ◦ Badge/Indicator cho số lượng thông báo chưa đọc hoặc cảnh báo hợp đồng sắp hết hạn.

C. Accessibility (Khả năng Truy cập)
• Keyboard Navigation: Tất cả interactive elements phải có thể truy cập bằng Tab/Enter/Space.
• Screen Reader: Sử dụng semantic HTML và ARIA labels cho các icon buttons và complex components.
• Color Contrast: Đảm bảo tỷ lệ contrast tối thiểu 4.5:1 cho text thường, 3:1 cho text lớn (WCAG AA).
• Focus Indicators: Visible focus ring (outline 2px solid primary color) khi tab qua elements.

D. Performance & Animation
• Lazy Loading: Code splitting cho các routes và components lớn (React.lazy, Suspense).
• Image Optimization: Sử dụng lazy loading và format WebP cho hình ảnh.
• Animation: 
    ◦ Sử dụng CSS transitions (0.2s-0.3s ease) cho hover, focus, và state changes.
    ◦ Tránh animation quá nhanh hoặc quá chậm (gây khó chịu hoặc cảm giác lag).
    ◦ Sử dụng Ant Design Motion hoặc Framer Motion cho các animation phức tạp (modal entrance, list items).

E. Responsive Design Guidelines
• Mobile (< 768px): 
    ◦ Sidebar chuyển thành drawer (mở/đóng bằng hamburger menu).
    ◦ Tables chuyển thành cards với thông tin chính.
    ◦ Form fields full-width, buttons stack vertically nếu cần.
• Tablet (768px - 1024px): 
    ◦ Sidebar có thể thu gọn (collapsed) với chỉ icons.
    ◦ Grid layout 2 cột cho danh sách items.
• Desktop (> 1024px): 
    ◦ Full sidebar với icons + labels.
    ◦ Grid layout 3-4 cột tùy màn hình.
    ◦ Hover effects và tooltips đầy đủ.

F. Component-Specific UI Guidelines
• Tables (Danh sách phòng, Hợp đồng): 
    ◦ Pagination ở dưới (10-20 items/page), có thể tùy chỉnh page size.
    ◦ Sortable columns với icon mũi tên lên/xuống.
    ◦ Row selection checkbox nếu cần bulk actions.
    ◦ Action buttons (Edit, Delete) trong cột cuối, sử dụng icon buttons với tooltip.
• Forms (Tạo/Sửa phòng, Upload hợp đồng): 
    ◦ Layout 2 cột trên desktop, 1 cột trên mobile.
    ◦ Group related fields với Card hoặc Divider.
    ◦ Submit button ở cuối form, có thể sticky trên mobile.
• Modals (Chi tiết hợp đồng, AI Query): 
    ◦ Width: 520px cho form nhỏ, 800px cho form lớn, 1200px cho dashboard modal.
    ◦ Close button (X) ở góc trên phải, có thể đóng bằng ESC key.
    ◦ Footer với Cancel và Confirm buttons, Cancel ở trái, Confirm (primary) ở phải.
• Dashboard Cards: 
    ◦ Grid layout responsive, mỗi card có icon, số liệu lớn, và trend indicator (↑↓).
    ◦ Click vào card có thể navigate đến trang chi tiết.
• AI Chat Interface: 
    ◦ Input ở dưới cùng (sticky), có thể expand thành textarea cho câu hỏi dài.
    ◦ Message bubbles: User messages align right (màu primary), AI responses align left (màu neutral).
    ◦ Typing indicator khi AI đang xử lý.
    ◦ Scroll tự động xuống message mới nhất.

--------------------------------------------------------------------------------
Slogan triển khai: "Data chuẩn - Logic tách biệt - AI thông minh".




// ==========================================
// THIẾT KẾ DATABASE HỆ THỐNG SMART HOTEL (CLM & AI)
// ==========================================

// 1. QUẢN LÝ ĐA CÔNG TY (Multi-Company Management) [1]
// Giúp quản lý tách biệt dữ liệu cho 14 công ty khác nhau.
Table companies {
  id integer [primary key]
  name varchar [note: 'Tên công ty']
  tax_id varchar [unique, note: 'Mã số thuế - dùng để định danh pháp lý']
  address text [note: 'Địa chỉ trụ sở']
  representative varchar [note: 'Người đại diện pháp luật']
  created_at timestamp
}

// 2. NGƯỜI DÙNG & PHÂN QUYỀN (RBAC) [1]
// Kiểm soát truy cập: Khách hàng, Lễ tân, Quản lý.
Table users {
  id integer [primary key]
  company_id integer [ref: > companies.id, note: 'Nhân viên thuộc công ty nào thì chỉ thấy dữ liệu công ty đó']
  username varchar [unique]
  password_hash varchar
  role enum('CUSTOMER', 'RECEPTIONIST', 'MANAGER') [note: 'Phân quyền tác nhân ACT01, ACT02, ACT03']
  email varchar
  phone varchar
}

// 3. DANH MỤC KHÁCH SẠN & PHÒNG [1]
// Phục vụ Use Case Tìm kiếm và Quản lý danh mục phòng.
Table hotels {
  id integer [primary key]
  company_id integer [ref: > companies.id]
  name varchar
  location text
}

Table rooms {
  id integer [primary key]
  hotel_id integer [ref: > hotels.id]
  room_number varchar
  room_type enum('SINGLE', 'DOUBLE', 'SUITE')
  base_price decimal [note: 'Giá cơ bản chưa bao gồm khuyến mãi']
  status enum('AVAILABLE', 'IN_HOUSE', 'MAINTENANCE') [note: 'Trạng thái vận hành thực tế']
}

// 4. QUẢN LÝ ĐẶT PHÒNG & VẬN HÀNH [1]
// Lưu vết quá trình từ lúc đặt đến khi Check-out.
Table bookings {
  id integer [primary key]
  customer_id integer [ref: > users.id]
  room_id integer [ref: > rooms.id]
  check_in timestamp
  check_out timestamp
  total_amount decimal [note: 'Tổng tiền sau khi tính toán các dịch vụ phát sinh']
  status enum('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')
}

// Dịch vụ phát sinh dùng cho Use Case Check-out (UC 10) [1]
Table extra_services {
  id integer [primary key]
  booking_id integer [ref: > bookings.id]
  service_name varchar [note: 'Giặt ủi, ăn uống, minibar...']
  price decimal
  requested_at timestamp
}

// 5. QUẢN LÝ VÒNG ĐỜI HỢP ĐỒNG (CLM) [1, 2]
// Cốt lõi của việc số hóa quy trình cho thuê và theo dõi thời hạn.
Table contracts {
  id integer [primary key]
  company_id integer [ref: > companies.id]
  customer_id integer [ref: > users.id]
  contract_code varchar [unique, note: 'Mã số hợp đồng duy nhất']
  status enum('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED') [note: 'Trạng thái vòng đời CLM']
  
  // AI Tracking: Các mốc thời gian AI cần theo dõi để gửi Alert [2]
  signed_at date
  effective_date date [note: 'Ngày có hiệu lực']
  expiry_date date [note: 'Ngày hết hạn']
  renewal_date date [note: 'Ngày gia hạn - AI nhắc trước 90 ngày']
  
  file_url varchar [note: 'Đường dẫn file PDF gốc lưu trên S3']
  created_at timestamp
}

// Điều khoản tài chính trong hợp đồng [1, 2]
Table contract_financials {
  id integer [primary key]
  contract_id integer [ref: - contracts.id]
  rent_amount decimal [note: 'Tiền thuê định kỳ']
  deposit decimal [note: 'Tiền cọc']
  payment_schedule text [note: 'Lịch thanh toán: Theo tháng/quý/năm']
}

// 6. PHÂN TÍCH AI (RAG & Risk Analysis) [1, 2]
// Lưu kết quả xử lý từ AI sau khi đọc file hợp đồng.
Table ai_contract_analysis {
  id integer [primary key]
  contract_id integer [ref: - contracts.id]
  summary text [note: 'Bản tóm tắt điều khoản quan trọng do LLM tạo']
  risk_level enum('LOW', 'MEDIUM', 'HIGH') [note: 'Đánh giá rủi ro từ AI']
  risk_tags varchar [note: 'Nhãn rủi ro: Thiếu bảo hiểm, Phí phạt cao...']
  vector_id varchar [note: 'ID liên kết tới Vector DB (Qdrant/Pinecone) để chạy RAG']
  last_analyzed timestamp
}

// 7. NHẬT KÝ KIỂM TRA (Audit Trails) [3]
// Đảm bảo an ninh và tính minh bạch khi truy cập dữ liệu hợp đồng.
Table audit_logs {
  id integer [primary key]
  user_id integer [ref: > users.id]
  action varchar [note: 'Hành động: Xem hợp đồng, Chỉnh sửa giá...']
  target_id varchar [note: 'ID của đối tượng bị tác động']
  timestamp timestamp
}