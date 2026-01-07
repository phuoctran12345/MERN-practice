# 🎨 Hướng Dẫn Sử Dụng Wireframe trong Figma

## 📁 File Wireframe
- **Location:** `frontend/WIREFRAME.md`
- **Format:** Markdown với ASCII art
- **Nội dung:** Wireframe cho Owner, Manager, Receptionist Dashboards

---

## 🚀 CÁCH 1: Copy vào Figma Comments (Khuyến Nghị)

### Bước 1: Mở Figma
1. Tạo file Figma mới hoặc mở file hiện có
2. Tạo frame cho từng dashboard:
   - `Owner Dashboard`
   - `Manager Dashboard`
   - `Receptionist Dashboard`

### Bước 2: Copy Wireframe
1. Mở file `WIREFRAME.md`
2. Copy section tương ứng (ví dụ: "1. OWNER DASHBOARD")
3. Vào Figma → Chọn frame → Click vào canvas
4. Nhấn `C` (Comment tool) hoặc `Ctrl/Cmd + /`
5. Paste wireframe vào comment box
6. Click "Post"

### Bước 3: Design theo Wireframe
- Designer có thể xem wireframe trong comment
- Vẽ design dựa trên wireframe
- Reference trực tiếp trong Figma

---

## 🚀 CÁCH 2: Dùng làm Reference Document

### Bước 1: Mở 2 cửa sổ
- Cửa sổ 1: Figma
- Cửa sổ 2: File `WIREFRAME.md`

### Bước 2: Tạo Frames
1. Trong Figma, tạo frame cho mỗi dashboard
2. Đặt tên frame theo wireframe:
   - `Owner Dashboard - 1920x1080`
   - `Manager Dashboard - 1920x1080`
   - `Receptionist Dashboard - 1920x1080`

### Bước 3: Vẽ theo Wireframe
- Đọc wireframe từ file markdown
- Vẽ design trong Figma theo cấu trúc
- Reference từng section một

---

## 🚀 CÁCH 3: Import bằng Plugin (Nâng cao)

### Plugin gợi ý:
1. **Wireframe** - Convert text to frames
2. **ASCII Art** - Import ASCII art
3. **Markdown** - Import markdown files

### Cách dùng:
1. Install plugin trong Figma
2. Mở plugin → Import file `WIREFRAME.md`
3. Plugin sẽ tự động tạo frames
4. Designer chỉ cần style lại

---

## 📋 CHECKLIST CHO DESIGNER

### Trước khi bắt đầu:
- [ ] Đọc file `WIREFRAME.md`
- [ ] Hiểu rõ 3 dashboards (Owner, Manager, Receptionist)
- [ ] Chọn color palette (3 options trong wireframe)
- [ ] Setup Design System trong Figma

### Khi design:
- [ ] Tạo Design System (Colors, Typography, Components)
- [ ] Vẽ Header component (reusable)
- [ ] Vẽ Sidebar component (reusable)
- [ ] Vẽ Stats Cards component
- [ ] Vẽ Table component
- [ ] Vẽ Chart placeholders
- [ ] Apply Neo Brutalism style (bold borders, no radius)

### Sau khi design:
- [ ] Export assets (icons, images)
- [ ] Tạo style guide
- [ ] Document components
- [ ] Handoff cho developer

---

## 🎨 DESIGN SYSTEM SETUP

### 1. Colors
Tạo Color Styles trong Figma:
- Primary
- Secondary
- Accent
- Background
- Text
- Border (Black)

### 2. Typography
Tạo Text Styles:
- Heading 1 (Bold, 32px)
- Heading 2 (Bold, 24px)
- Heading 3 (Bold, 20px)
- Body (Regular, 16px)
- Small (Regular, 14px)
- Button (Bold, 16px)

### 3. Components
Tạo Component Library:
- Button (Primary, Secondary, Danger)
- Input (Text, Search, Select)
- Card (Stats Card, Hotel Card)
- Table (Header, Row, Cell)
- Chart (Placeholder)

### 4. Effects
- Border: 3px solid black (Neo Brutalism)
- No shadows
- No gradients
- No border radius (0px)

---

## 📐 FRAME SIZES

### Desktop (Default)
- Width: 1920px
- Height: 1080px (hoặc auto-scroll)

### Tablet
- Width: 1024px
- Height: 768px

### Mobile
- Width: 375px
- Height: 667px

---

## 🔗 LINKS HỮU ÍCH

### Figma Resources:
- [Figma Design System](https://www.figma.com/community)
- [Neo Brutalism Examples](https://dribbble.com/tags/neobrutalism)
- [Hotel Dashboard Inspirations](https://dribbble.com/search/hotel-dashboard)

### Icons:
- [Lucide Icons](https://lucide.dev/icons/) - Free, MIT License
- [Heroicons](https://heroicons.com/) - Free, MIT License

### Colors:
- [Coolors](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel

---

## 💡 TIPS

1. **Start with Wireframe:**
   - Vẽ wireframe trước
   - Sau đó mới style

2. **Use Auto Layout:**
   - Figma Auto Layout cho responsive
   - Dễ maintain và update

3. **Component First:**
   - Tạo components trước
   - Reuse components sau

4. **Neo Brutalism:**
   - Bold borders (3-4px)
   - High contrast
   - Flat design
   - Bold typography

5. **Accessibility:**
   - Check contrast ratios
   - Use proper labels
   - Test with screen readers

---

## 📞 SUPPORT

Nếu có câu hỏi về wireframe:
1. Xem lại file `WIREFRAME.md`
2. Check use cases trong `rule.md`
3. Review backend APIs trong `md/TEST_APIS.md`

---

**Happy Designing! 🎨**

