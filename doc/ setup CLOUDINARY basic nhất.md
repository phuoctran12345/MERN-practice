# ☁️ Hướng Dẫn Setup Cloudinary

## 📖 Cloudinary là gì?

**Cloudinary** = Dịch vụ lưu trữ và quản lý ảnh/video trên cloud (miễn phí).

### Tại sao dùng Cloudinary?
- ✅ **Miễn phí** (25GB storage, 25GB bandwidth/tháng)
- ✅ **Tự động resize/optimize** ảnh
- ✅ **CDN** (tải ảnh nhanh toàn cầu)
- ✅ **Không cần lưu file trên server** (tiết kiệm dung lượng)

---

## 🚀 Bước 1: Tạo tài khoản Cloudinary

1. **Truy cập:** https://cloudinary.com/users/register/free
2. **Đăng ký** bằng email (miễn phí)
3. **Xác nhận email** → Đăng nhập

---

## 🔑 Bước 2: Lấy API Keys

Sau khi đăng nhập:

1. **Vào Dashboard:** https://console.cloudinary.com/
2. **Copy 3 thông tin này:**
   - **Cloud Name** (ví dụ: `dabc123xyz`)
   - **API Key** (ví dụ: `123456789012345`)
   - **API Secret** (ví dụ: `abcdefghijklmnopqrstuvwxyz`)

⚠️ **LƯU Ý:** API Secret là **BÍ MẬT** - không share công khai!

---

## ⚙️ Bước 3: Setup trong Project

### 3.1. Tạo file `.env` (nếu chưa có)

Trong thư mục `backend/`, tạo file `.env`:

```bash
cd backend
touch .env
```

### 3.2. Thêm Cloudinary config vào `.env`

Mở file `.env` và thêm:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Ví dụ:**
```env
CLOUDINARY_CLOUD_NAME=dabc123xyz
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 3.3. Kiểm tra package đã cài chưa

```bash
cd backend
npm list cloudinary
```

Nếu chưa có, cài đặt:
```bash
npm install cloudinary
```

---

## 📝 Bước 4: Kiểm tra Code đã Setup chưa

### 4.1. File `backend/src/index.ts`

Code đã có sẵn:

```typescript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

✅ **Nếu có code này = Đã setup xong!**

### 4.2. File `backend/src/express/controllers/my-hotels.controller.ts`

Code upload ảnh đã có sẵn:

```typescript
async function uploadImages(imageFiles: any[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    // Chuyển buffer thành base64
    const b64 = Buffer.from(image.buffer).toString("base64");
    
    // Tạo data URI
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    
    // Upload lên Cloudinary
    const res = await cloudinary.v2.uploader.upload(dataURI, {
      secure: true,
      transformation: [
        { width: 800, height: 600, crop: "fill" },
        { quality: "auto" },
      ],
    });
    
    return res.url; // Trả về URL của ảnh
  });
  
  return await Promise.all(uploadPromises);
}
```

✅ **Code này tự động upload ảnh lên Cloudinary!**

---

## 🧪 Bước 5: Test Upload

### 5.1. Restart server

```bash
cd backend
npm run dev
```

### 5.2. Test API tạo hotel

1. **Login** để lấy token (API 3)
2. **Tạo hotel** với ảnh (API 4)
3. **Kiểm tra response** → Sẽ có `imageUrls` với URL từ Cloudinary

**Ví dụ response:**
```json
{
  "_id": "...",
  "name": "My Test Hotel",
  "imageUrls": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567/hotel1.jpg"
  ]
}
```

✅ **Nếu có URL `res.cloudinary.com` = Upload thành công!**

---

## 🔍 Cách Upload File Hoạt Động

### Luồng xử lý:

```
1. Client gửi file (Postman/Frontend)
   ↓
2. Multer nhận file → Lưu vào RAM (buffer)
   ↓
3. Controller lấy file từ req.files
   ↓
4. Chuyển buffer → base64 string
   ↓
5. Upload base64 lên Cloudinary
   ↓
6. Cloudinary trả về URL
   ↓
7. Lưu URL vào database
```

### Code chi tiết:

```typescript
// Bước 1: Multer nhận file
upload.array("imageFiles", 6) // → req.files

// Bước 2: Lấy file trong controller
const imageFiles = req.files; // [{ buffer: ..., mimetype: "image/jpeg" }]

// Bước 3: Chuyển buffer → base64
const b64 = Buffer.from(image.buffer).toString("base64");

// Bước 4: Tạo data URI
const dataURI = "data:image/jpeg;base64," + b64;

// Bước 5: Upload lên Cloudinary
const result = await cloudinary.v2.uploader.upload(dataURI);

// Bước 6: Lấy URL
const imageUrl = result.url; // "https://res.cloudinary.com/..."
```

---

## ❌ Xử Lý Lỗi Thường Gặp

### Lỗi 1: "Missing required environment variables"
**Nguyên nhân:** Chưa thêm vào `.env`  
**Giải pháp:** Thêm 3 biến `CLOUDINARY_*` vào `.env`

### Lỗi 2: "Invalid API credentials"
**Nguyên nhân:** API keys sai  
**Giải pháp:** Kiểm tra lại Cloud Name, API Key, API Secret

### Lỗi 3: "File too large"
**Nguyên nhân:** File > 5MB  
**Giải pháp:** Giảm kích thước ảnh hoặc tăng limit trong multer

### Lỗi 4: "Cannot read property 'buffer'"
**Nguyên nhân:** Chưa có file trong request  
**Giải pháp:** Kiểm tra form-data có field `imageFiles` chưa

---

## 📚 Tài Liệu Tham Khảo

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Node.js SDK:** https://cloudinary.com/documentation/node_integration
- **Free Tier:** https://cloudinary.com/pricing

---

## ✅ Checklist

- [ ] Đã tạo tài khoản Cloudinary
- [ ] Đã copy Cloud Name, API Key, API Secret
- [ ] Đã thêm vào file `.env`
- [ ] Đã cài package `cloudinary`
- [ ] Đã restart server
- [ ] Đã test upload thành công

---

**🎉 Xong! Bây giờ bạn có thể upload ảnh lên Cloudinary rồi!**

