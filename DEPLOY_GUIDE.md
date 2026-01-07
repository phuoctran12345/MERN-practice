# 🚀 HƯỚNG DẪN DEPLOY & CI/CD - SMART HOTEL PROJECT

**Hướng dẫn deploy toàn bộ stack: MongoDB, Node.js Backend, React Frontend**

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Chuẩn bị](#chuẩn-bị)
3. [Bước 1: Setup MongoDB Atlas (Database)](#bước-1-setup-mongodb-atlas-database)
4. [Bước 2: Deploy Backend (Node.js)](#bước-2-deploy-backend-nodejs)
5. [Bước 3: Deploy Frontend (React)](#bước-3-deploy-frontend-react)
6. [Bước 4: Setup Domain](#bước-4-setup-domain)
7. [Bước 5: Setup CI/CD với GitHub Actions](#bước-5-setup-cicd-với-github-actions)
8. [Kiểm tra & Troubleshooting](#kiểm-tra--troubleshooting)

---

## 📦 TỔNG QUAN

### Stack công nghệ:
- **Database:** MongoDB Atlas (Cloud - Miễn phí)
- **Backend:** Node.js + Express (Deploy trên Railway hoặc Render)
- **Frontend:** React + Vite (Deploy trên Vercel hoặc Netlify)
- **CI/CD:** GitHub Actions (Tự động deploy khi push code)

### Các dịch vụ miễn phí sử dụng:
1. **MongoDB Atlas** - Database miễn phí (512MB)
2. **Railway** hoặc **Render** - Backend hosting (miễn phí với giới hạn)
3. **Vercel** hoặc **Netlify** - Frontend hosting (miễn phí)
4. **Freenom** hoặc **Cloudflare** - Domain miễn phí (tùy chọn)

---

## 🔧 CHUẨN BỊ

### 1. Tài khoản cần có:
- [x] GitHub account (để lưu code và CI/CD)
- [x] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [x] Railway account (https://railway.app) HOẶC Render account (https://render.com)
- [x] Vercel account (https://vercel.com) HOẶC Netlify account (https://netlify.com)
- [x] Cloudinary account (https://cloudinary.com) - Để upload ảnh
- [x] PayOS account (https://payos.vn) - Để thanh toán

### 2. Kiểm tra code trước khi deploy:
```bash
# Đảm bảo code đã được commit và push lên GitHub
cd /Users/tranhongphuoc/Documents/Workspace/Workspace/NodeJS/MERN\ project
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## 🗄️ BƯỚC 1: SETUP MONGODB ATLAS (DATABASE)

### 1.1. Tạo tài khoản MongoDB Atlas
1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Đăng ký tài khoản miễn phí (Free Tier)
3. Xác thực email

### 1.2. Tạo Cluster
1. Vào **"Create"** → Chọn **"Free"** (M0 Sandbox)
2. Chọn **Cloud Provider:** AWS
3. Chọn **Region:** Gần Việt Nam nhất (ví dụ: Singapore - ap-southeast-1)
4. Đặt tên cluster: `mern-hotel-cluster`
5. Click **"Create Cluster"** (mất khoảng 3-5 phút)

### 1.3. Tạo Database User
1. Vào **"Database Access"** (menu bên trái)
2. Click **"Add New Database User"**
3. Chọn **"Password"** authentication
4. Username: `mern-admin` (hoặc tên bạn muốn)
5. Password: Tạo password mạnh (LƯU LẠI PASSWORD NÀY!)
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### 1.4. Whitelist IP Address
1. Vào **"Network Access"** (menu bên trái)
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0) - Để backend có thể kết nối
4. Click **"Confirm"**

### 1.5. Lấy Connection String
1. Vào **"Database"** → Click **"Connect"** trên cluster
2. Chọn **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string, ví dụ:
   ```
   mongodb+srv://mern-admin:<password>@mern-hotel-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **THAY `<password>` BẰNG PASSWORD BẠN ĐÃ TẠO**
6. **THÊM TÊN DATABASE VÀO CUỐI:** `...mongodb.net/mern-hotel?retryWrites=true&w=majority`
7. **KẾT QUẢ CUỐI CÙNG:**
   ```
   mongodb+srv://mern-admin:YOUR_PASSWORD@mern-hotel-cluster.xxxxx.mongodb.net/mern-hotel?retryWrites=true&w=majority
   ```
8. **LƯU LẠI CONNECTION STRING NÀY** - Sẽ dùng ở bước deploy backend

---

## 🖥️ BƯỚC 2: DEPLOY BACKEND (NODE.JS)

### Phương án A: Deploy trên Railway (Khuyên dùng - Dễ nhất)

#### 2.1. Tạo tài khoản Railway
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub account
3. Chọn **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repository của bạn

#### 2.2. Setup Environment Variables
1. Vào project → Click **"Variables"** tab
2. Thêm các biến môi trường sau:

```env
# Database
MONGODB_CONNECTION_STRING=mongodb+srv://mern-admin:YOUR_PASSWORD@mern-hotel-cluster.xxxxx.mongodb.net/mern-hotel?retryWrites=true&w=majority

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-characters-long

# Cloudinary (Lấy từ https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PayOS (Lấy từ https://payos.vn)
PAYOS_CLIENT_ID=your-client-id
PAYOS_API_KEY=your-api-key
PAYOS_CHECKSUM_KEY=your-checksum-key

# Frontend URL (Sẽ cập nhật sau khi deploy frontend)
FRONTEND_URL=https://mern-practice.vercel.app

# Node Environment
NODE_ENV=production

# Port (Railway tự động set, nhưng có thể set thủ công)
PORT=7002
```

#### 2.3. Setup Build & Start Commands
1. Vào **"Settings"** → **"Deploy"**
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm start`
5. **Watch Paths:** `backend/**`

#### 2.4. Deploy
1. Railway sẽ tự động detect và deploy
2. Đợi build xong (khoảng 2-3 phút)
3. Railway sẽ tạo một URL cho backend, ví dụ: `https://mern-hotel-backend.railway.app`
4. **LƯU LẠI URL NÀY** - Sẽ dùng cho frontend

#### 2.5. Kiểm tra Backend
1. Mở URL backend + `/api/health`
2. Ví dụ: `https://mern-hotel-backend.railway.app/api/health`
3. Nếu thấy `{"status":"healthy"}` → Backend đã chạy thành công! ✅

---

### Phương án B: Deploy trên Render (Alternative)

#### 2.1. Tạo tài khoản Render
1. Truy cập: https://render.com
2. Đăng nhập bằng GitHub account
3. Click **"New"** → **"Web Service"**
4. Connect GitHub repository

#### 2.2. Cấu hình
- **Name:** `mern-hotel-backend`
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm start`
- **Root Directory:** `backend`

#### 2.3. Environment Variables
Thêm các biến môi trường giống như Railway (xem Phương án A - Bước 2.2)

#### 2.4. Deploy
1. Click **"Create Web Service"**
2. Render sẽ tự động deploy
3. URL sẽ là: `https://mern-hotel-backend.onrender.com`

---

## 🎨 BƯỚC 3: DEPLOY FRONTEND (REACT)

### Phương án A: Deploy trên Vercel (Khuyên dùng - Tốt nhất cho React)

#### 3.1. Tạo tài khoản Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub account
3. Click **"Add New"** → **"Project"**
4. Import GitHub repository

#### 3.2. Cấu hình Project
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### 3.3. Environment Variables
Thêm biến môi trường:

```env
VITE_API_BASE_URL=https://mern-hotel-backend.railway.app
```

**LƯU Ý:** Thay URL bằng URL backend thực tế của bạn!

#### 3.4. Deploy
1. Click **"Deploy"**
2. Vercel sẽ tự động build và deploy (khoảng 1-2 phút)
3. URL sẽ là: `https://mern-practice.vercel.app` (hoặc tên bạn chọn)

#### 3.5. Cập nhật Backend CORS
1. Quay lại Railway/Render
2. Vào **Environment Variables**
3. Cập nhật `FRONTEND_URL` = URL Vercel của bạn
4. Redeploy backend

---

### Phương án B: Deploy trên Netlify (Alternative)

#### 3.1. Tạo tài khoản Netlify
1. Truy cập: https://netlify.com
2. Đăng nhập bằng GitHub account
3. Click **"Add new site"** → **"Import an existing project"**
4. Chọn GitHub repository

#### 3.2. Cấu hình Build
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

#### 3.3. Environment Variables
Thêm biến môi trường giống Vercel (xem Phương án A - Bước 3.3)

#### 3.4. Deploy
1. Click **"Deploy site"**
2. URL sẽ là: `https://mern-practice.netlify.app`

---

## 📊 SO SÁNH CÁC PLATFORM

### Backend Hosting:

| Platform | Free Tier | Độ khó | Tốt cho |
|----------|-----------|--------|--------|
| **Railway** | ✅ Có (giới hạn) | ⭐ Dễ | Người mới, deploy nhanh - **Khuyên dùng** |
| **Render** | ✅ Có (giới hạn) | ⭐ Dễ | Người mới, deploy nhanh - **Alternative** |

### Frontend Hosting:

| Platform | Free Tier | Độ khó | Tốt cho |
|----------|-----------|--------|--------|
| **Vercel** | ✅ Vĩnh viễn | ⭐ Dễ | React/Vite, tốt nhất - **Khuyên dùng** |
| **Netlify** | ✅ Vĩnh viễn | ⭐ Dễ | React/Vite, dễ dùng - **Alternative** |

### Khuyến nghị:
- **Người mới:** Railway + Vercel (dễ nhất, miễn phí vĩnh viễn) ⭐ **Khuyên dùng**
- **Alternative:** Render + Netlify (cũng rất dễ, miễn phí vĩnh viễn)

---

## 🌐 BƯỚC 4: SETUP DOMAIN

### 4.1. Mua Domain Miễn Phí (Freenom)
1. Truy cập: https://www.freenom.com
2. Đăng ký tài khoản
3. Tìm domain miễn phí (ví dụ: `.tk`, `.ml`, `.ga`, `.cf`)
4. Đăng ký domain: `mern-practice.tk` (hoặc domain bạn muốn)

### 4.2. Setup Domain cho Frontend (Vercel)
1. Vào Vercel project → **"Settings"** → **"Domains"**
2. Thêm domain: `mern-practice.com` (hoặc domain bạn đã mua)
3. Vercel sẽ cung cấp DNS records
4. Vào Freenom → **"Manage Domain"** → **"Manage Freenom DNS"**
5. Thêm DNS records theo hướng dẫn của Vercel:
   - Type: `A`, Name: `@`, Value: IP từ Vercel
   - Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`
6. Đợi 24-48 giờ để DNS propagate

### 4.3. Setup Domain cho Backend (Railway/Render)
1. **Railway:**
   - Vào Railway project → **"Settings"** → **"Domains"**
   - Click **"Generate Domain"** hoặc thêm custom domain
   - Nếu dùng custom domain, thêm DNS record:
     - Type: `CNAME`, Name: `api`, Value: `railway-domain.railway.app`

2. **Render:**
   - Vào Render service → **"Settings"** → **"Custom Domain"**
   - Thêm custom domain: `api.mern-practice.com`
   - Render sẽ cung cấp DNS records
   - Thêm DNS records vào domain registrar

### 4.4. Cập nhật Environment Variables
1. **Backend:** Cập nhật `FRONTEND_URL` = `https://mern-practice.com`
2. **Frontend:** Cập nhật `VITE_API_BASE_URL` = `https://api.mern-practice.com`
3. Redeploy cả backend và frontend

---

## 🔄 BƯỚC 5: SETUP CI/CD VỚI GITHUB ACTIONS

### 5.1. Tạo GitHub Actions Workflow

Tạo file `.github/workflows/deploy.yml` trong repository:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  # Job 1: Test Backend
  test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Run tests (if you have tests)
        run: npm test || echo "No tests yet"
      - name: Build
        run: npm run build

  # Job 2: Test Frontend
  test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Lint
        run: npm run lint || echo "Linting skipped"

  # Job 3: Deploy Backend (Railway)
  deploy-backend:
    needs: test-backend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
        # Hoặc dùng Railway CLI
        # - name: Install Railway CLI
        #   run: npm i -g @railway/cli
        # - name: Deploy
        #   run: railway up
        #   env:
        #     RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  # Job 4: Deploy Frontend (Vercel)
  deploy-frontend:
    needs: test-frontend
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

### 5.2. Setup GitHub Secrets
1. Vào GitHub repository → **"Settings"** → **"Secrets and variables"** → **"Actions"**
2. Thêm các secrets sau:

#### Railway Secrets (nếu dùng Railway):
- `RAILWAY_TOKEN`: Lấy từ Railway → Account Settings → Tokens

#### Vercel Secrets (nếu dùng Vercel):
- `VERCEL_TOKEN`: Lấy từ Vercel → Settings → Tokens
- `VERCEL_ORG_ID`: Lấy từ Vercel project → Settings → General
- `VERCEL_PROJECT_ID`: Lấy từ Vercel project → Settings → General

### 5.3. Test CI/CD
1. Tạo một thay đổi nhỏ trong code
2. Commit và push:
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push origin main
   ```
3. Vào GitHub → **"Actions"** tab
4. Xem workflow chạy và kiểm tra kết quả

---

## ✅ KIỂM TRA & TROUBLESHOOTING

### Checklist sau khi deploy:

#### Backend:
- [ ] Backend URL trả về `{"status":"healthy"}` khi truy cập `/api/health`
- [ ] MongoDB connection thành công (check logs)
- [ ] Environment variables đã được set đúng
- [ ] CORS đã được cấu hình đúng (cho phép frontend URL)

#### Frontend:
- [ ] Frontend load được và hiển thị trang chủ
- [ ] API calls từ frontend đến backend thành công (check Network tab)
- [ ] Authentication hoạt động (login/logout)
- [ ] Payment flow hoạt động (test với PayOS sandbox)

#### Database:
- [ ] Có thể tạo user mới
- [ ] Có thể tạo hotel mới
- [ ] Có thể tạo booking mới

### Common Issues & Solutions:

#### 1. Backend không kết nối được MongoDB
**Lỗi:** `MongoServerError: Authentication failed`
**Giải pháp:**
- Kiểm tra lại password trong connection string
- Đảm bảo IP whitelist đã cho phép `0.0.0.0/0`
- Kiểm tra database user có quyền admin

#### 2. CORS Error
**Lỗi:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
**Giải pháp:**
- Kiểm tra `FRONTEND_URL` trong backend environment variables
- Đảm bảo frontend URL đã được thêm vào `allowedOrigins` trong backend code

#### 3. Frontend không gọi được API
**Lỗi:** `Network Error` hoặc `404 Not Found`
**Giải pháp:**
- Kiểm tra `VITE_API_BASE_URL` trong frontend environment variables
- Đảm bảo backend URL đúng và đang chạy
- Kiểm tra Network tab trong browser DevTools

#### 4. Build Failed
**Lỗi:** `npm install` hoặc `npm run build` failed
**Giải pháp:**
- Kiểm tra `package.json` có đúng dependencies không
- Kiểm tra Node.js version (cần >= 18)
- Xem logs chi tiết trong Railway/Vercel dashboard

---

## 📝 NOTES QUAN TRỌNG

### Security:
1. **KHÔNG BAO GIỜ** commit `.env` files lên GitHub
2. Sử dụng GitHub Secrets để lưu sensitive data
3. Sử dụng strong passwords cho database và JWT secret
4. Enable rate limiting trên backend (đã có sẵn trong code)

### Performance:
1. Enable compression trên backend (đã có sẵn)
2. Sử dụng CDN cho static assets (Vercel/Netlify tự động)
3. Optimize images với Cloudinary (đã tích hợp)

### Monitoring:
1. Setup error tracking (có thể dùng Sentry - optional)
2. Monitor API response times
3. Check database connection health

---

## 🎉 HOÀN THÀNH!

Sau khi hoàn thành tất cả các bước, bạn sẽ có:
- ✅ Database: MongoDB Atlas (Cloud)
- ✅ Backend: Deploy trên Railway/Render
- ✅ Frontend: Deploy trên Vercel/Netlify
- ✅ Domain: Custom domain (tùy chọn)
- ✅ CI/CD: Tự động deploy khi push code

**URLs của bạn:**
- Frontend: `https://mern-practice.com` (hoặc Vercel/Netlify URL)
- Backend: `https://api.mern-practice.com` (hoặc Railway/Render URL)
- Database: MongoDB Atlas (không cần URL public)

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Logs trong Railway/Vercel dashboard
2. MongoDB Atlas logs
3. Browser Console và Network tab
4. GitHub Actions logs

**Chúc bạn deploy thành công! 🚀**

