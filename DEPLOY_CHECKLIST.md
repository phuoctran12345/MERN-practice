# ✅ CHECKLIST TRIỂN KHAI - SMART HOTEL PROJECT

**Hướng dẫn từng bước để deploy dự án lên production**

---

## 📋 BƯỚC 0: CHUẨN BỊ CODE (QUAN TRỌNG!)

### ⚠️ LƯU Ý: Commit code trước khi deploy!

```bash
# Kiểm tra status
git status

# Add tất cả thay đổi
git add .

# Commit với message rõ ràng
git commit -m "feat: Prepare for deployment - Add deploy guides and update configs"

# Push lên GitHub
git push origin main
```

**✅ Checklist:**
- [ ] Đã commit tất cả code lên GitHub
- [ ] Đã push lên branch `main`
- [ ] Đã kiểm tra không có file `.env` trong git (đã có trong .gitignore)

---

## 🗄️ BƯỚC 1: SETUP MONGODB ATLAS

### 1.1. Tạo tài khoản MongoDB Atlas
- [ ] Đăng ký tại: https://www.mongodb.com/cloud/atlas
- [ ] Xác thực email

### 1.2. Tạo Cluster
- [ ] Chọn **Free Tier (M0 Sandbox)**
- [ ] Chọn **Region:** Singapore (ap-southeast-1) - gần Việt Nam nhất
- [ ] Đặt tên: `mern-hotel-cluster`
- [ ] Đợi cluster tạo xong (3-5 phút)

### 1.3. Tạo Database User
- [ ] Vào **"Database Access"** → **"Add New Database User"**
- [ ] Username: `mern-admin`
- [ ] Password: Tạo password mạnh (LƯU LẠI!)
- [ ] Privileges: **"Atlas admin"**
- [ ] Click **"Add User"**

### 1.4. Whitelist IP
- [ ] Vào **"Network Access"** → **"Add IP Address"**
- [ ] Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
- [ ] Click **"Confirm"**

### 1.5. Lấy Connection String
- [ ] Vào **"Database"** → Click **"Connect"** trên cluster
- [ ] Chọn **"Connect your application"**
- [ ] Driver: **Node.js**, Version: **5.5 or later**
- [ ] Copy connection string
- [ ] **THAY `<password>`** bằng password đã tạo
- [ ] **THÊM TÊN DATABASE:** `...mongodb.net/mern-hotel?retryWrites=true&w=majority`
- [ ] **LƯU LẠI CONNECTION STRING** - Sẽ dùng ở bước deploy backend

**Kết quả cuối cùng:**
```
mongodb+srv://mern-admin:YOUR_PASSWORD@mern-hotel-cluster.xxxxx.mongodb.net/mern-hotel?retryWrites=true&w=majority
```

---

## 🖥️ BƯỚC 2: DEPLOY BACKEND (RAILWAY HOẶC RENDER)

### Phương án A: Railway (Khuyên dùng)

#### 2.1. Tạo tài khoản Railway
- [ ] Đăng ký tại: https://railway.app
- [ ] Đăng nhập bằng GitHub account
- [ ] Click **"New Project"** → **"Deploy from GitHub repo"**
- [ ] Chọn repository của bạn

#### 2.2. Setup Environment Variables
Vào project → **"Variables"** tab → Thêm các biến sau:

- [ ] `MONGODB_CONNECTION_STRING` = (connection string từ Bước 1.5)
- [ ] `JWT_SECRET_KEY` = (tạo random string mạnh, tối thiểu 32 ký tự)
- [ ] `CLOUDINARY_CLOUD_NAME` = (lấy từ Cloudinary dashboard)
- [ ] `CLOUDINARY_API_KEY` = (lấy từ Cloudinary dashboard)
- [ ] `CLOUDINARY_API_SECRET` = (lấy từ Cloudinary dashboard)
- [ ] `PAYOS_CLIENT_ID` = (lấy từ PayOS dashboard)
- [ ] `PAYOS_API_KEY` = (lấy từ PayOS dashboard)
- [ ] `PAYOS_CHECKSUM_KEY` = (lấy từ PayOS dashboard)
- [ ] `FRONTEND_URL` = `https://mern-practice.vercel.app` (sẽ cập nhật sau)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `7002` (Railway tự động set, nhưng có thể set thủ công)

#### 2.3. Setup Build & Start Commands
- [ ] Vào **"Settings"** → **"Deploy"**
- [ ] **Root Directory:** `backend`
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Start Command:** `npm start`
- [ ] **Watch Paths:** `backend/**`

#### 2.4. Deploy
- [ ] Railway sẽ tự động detect và deploy
- [ ] Đợi build xong (2-3 phút)
- [ ] Lưu lại URL backend: `https://mern-hotel-backend.railway.app`

#### 2.5. Kiểm tra Backend
- [ ] Mở URL: `https://mern-hotel-backend.railway.app/api/health`
- [ ] Nếu thấy `{"status":"healthy"}` → ✅ Backend đã chạy thành công!

---

### Phương án B: Render (Alternative)

#### 2.1. Tạo tài khoản Render
- [ ] Đăng ký tại: https://render.com
- [ ] Đăng nhập bằng GitHub account
- [ ] Click **"New"** → **"Web Service"**
- [ ] Connect GitHub repository

#### 2.2. Cấu hình
- [ ] **Name:** `mern-hotel-backend`
- [ ] **Environment:** `Node`
- [ ] **Build Command:** `cd backend && npm install && npm run build`
- [ ] **Start Command:** `cd backend && npm start`
- [ ] **Root Directory:** `backend`

#### 2.3. Environment Variables
- [ ] Thêm tất cả biến môi trường giống Railway (xem Phương án A - Bước 2.2)

#### 2.4. Deploy
- [ ] Click **"Create Web Service"**
- [ ] Render sẽ tự động deploy
- [ ] Lưu lại URL: `https://mern-hotel-backend.onrender.com`

#### 2.5. Kiểm tra Backend
- [ ] Mở URL: `https://mern-hotel-backend.onrender.com/api/health`
- [ ] Nếu thấy `{"status":"healthy"}` → ✅ Backend đã chạy thành công!

---

## 🎨 BƯỚC 3: DEPLOY FRONTEND (VERCEL HOẶC NETLIFY)

### Phương án A: Vercel (Khuyên dùng)

#### 3.1. Tạo tài khoản Vercel
- [ ] Đăng ký tại: https://vercel.com
- [ ] Đăng nhập bằng GitHub account
- [ ] Click **"Add New"** → **"Project"**
- [ ] Import GitHub repository

#### 3.2. Cấu hình Project
- [ ] **Framework Preset:** Vite
- [ ] **Root Directory:** `frontend`
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `dist`
- [ ] **Install Command:** `npm install`

#### 3.3. Environment Variables
- [ ] Thêm biến: `VITE_API_BASE_URL` = URL backend từ Bước 2
  - Ví dụ: `https://mern-hotel-backend.railway.app`

#### 3.4. Deploy
- [ ] Click **"Deploy"**
- [ ] Đợi build xong (1-2 phút)
- [ ] Lưu lại URL frontend: `https://mern-practice.vercel.app`

#### 3.5. Cập nhật Backend CORS
- [ ] Quay lại Railway/Render
- [ ] Vào **Environment Variables**
- [ ] Cập nhật `FRONTEND_URL` = URL Vercel của bạn
- [ ] Redeploy backend

---

### Phương án B: Netlify (Alternative)

#### 3.1. Tạo tài khoản Netlify
- [ ] Đăng ký tại: https://netlify.com
- [ ] Đăng nhập bằng GitHub account
- [ ] Click **"Add new site"** → **"Import an existing project"**
- [ ] Chọn GitHub repository

#### 3.2. Cấu hình Build
- [ ] **Base directory:** `frontend`
- [ ] **Build command:** `npm run build`
- [ ] **Publish directory:** `frontend/dist`

#### 3.3. Environment Variables
- [ ] Thêm biến: `VITE_API_BASE_URL` = URL backend từ Bước 2

#### 3.4. Deploy
- [ ] Click **"Deploy site"**
- [ ] Lưu lại URL: `https://mern-practice.netlify.app`

#### 3.5. Cập nhật Backend CORS
- [ ] Quay lại Railway/Render
- [ ] Cập nhật `FRONTEND_URL` = URL Netlify của bạn
- [ ] Redeploy backend

---

## 🔗 BƯỚC 4: CẬP NHẬT PAYOS WEBHOOK (QUAN TRỌNG!)

### 4.1. Lấy Webhook URL
- [ ] Backend URL: `https://mern-hotel-backend.railway.app`
- [ ] Webhook URL: `https://mern-hotel-backend.railway.app/api/payments/webhook`

### 4.2. Cấu hình trên PayOS Dashboard
- [ ] Vào: https://my.payos.vn
- [ ] Vào **"Thiết lập"** → **"Webhook"**
- [ ] Thêm Webhook URL: `https://mern-hotel-backend.railway.app/api/payments/webhook`
- [ ] Lưu cấu hình

### 4.3. Test Webhook (Development)
Nếu đang develop local và cần test webhook:
- [ ] Cài đặt ngrok: `brew install ngrok` (Mac) hoặc download từ https://ngrok.com
- [ ] Verify email ngrok (nếu chưa)
- [ ] Chạy: `ngrok http 7002`
- [ ] Copy URL ngrok (ví dụ: `https://abc123.ngrok.io`)
- [ ] Cấu hình PayOS webhook: `https://abc123.ngrok.io/api/payments/webhook`

---

## ✅ BƯỚC 5: KIỂM TRA TỔNG THỂ

### Backend:
- [ ] Health: `https://mern-hotel-backend.railway.app/api/health` → `{"status":"healthy"}`
- [ ] MongoDB connection thành công (check logs)
- [ ] Environment variables đã set đúng
- [ ] CORS đã cấu hình đúng

### Frontend:
- [ ] Frontend load được và hiển thị trang chủ
- [ ] API calls từ frontend đến backend thành công (check Network tab)
- [ ] Authentication hoạt động (login/logout)
- [ ] Payment flow hoạt động (test với PayOS sandbox)

### Database:
- [ ] Có thể tạo user mới
- [ ] Có thể tạo hotel mới
- [ ] Có thể tạo booking mới

---

## 🚨 TROUBLESHOOTING

### Lỗi: Backend không kết nối được MongoDB
**Giải pháp:**
- Kiểm tra lại password trong connection string
- Đảm bảo IP whitelist đã cho phép `0.0.0.0/0`
- Kiểm tra database user có quyền admin

### Lỗi: CORS Error
**Giải pháp:**
- Kiểm tra `FRONTEND_URL` trong backend environment variables
- Đảm bảo frontend URL đã được thêm vào `allowedOrigins`

### Lỗi: Frontend không gọi được API
**Giải pháp:**
- Kiểm tra `VITE_API_BASE_URL` trong frontend environment variables
- Đảm bảo backend URL đúng và đang chạy
- Kiểm tra Network tab trong browser DevTools

### Lỗi: Build Failed
**Giải pháp:**
- Kiểm tra `package.json` có đúng dependencies không
- Kiểm tra Node.js version (cần >= 18)
- Xem logs chi tiết trong Railway/Vercel dashboard

---

## 📝 NOTES QUAN TRỌNG

### Security:
- ✅ **KHÔNG BAO GIỜ** commit `.env` files lên GitHub
- ✅ Sử dụng strong passwords cho database và JWT secret
- ✅ Enable rate limiting trên backend (đã có sẵn)

### Performance:
- ✅ Enable compression trên backend (đã có sẵn)
- ✅ Sử dụng CDN cho static assets (Vercel/Netlify tự động)
- ✅ Optimize images với Cloudinary (đã tích hợp)

---

## 🎉 HOÀN THÀNH!

Sau khi hoàn thành tất cả các bước, bạn sẽ có:
- ✅ Database: MongoDB Atlas (Cloud)
- ✅ Backend: Deploy trên Railway/Render
- ✅ Frontend: Deploy trên Vercel/Netlify
- ✅ Payment: PayOS webhook đã cấu hình

**URLs của bạn:**
- Frontend: `https://mern-practice.vercel.app` (hoặc Netlify URL)
- Backend: `https://mern-hotel-backend.railway.app` (hoặc Render URL)
- Database: MongoDB Atlas (không cần URL public)

**Chúc bạn deploy thành công! 🚀**



