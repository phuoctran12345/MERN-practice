# 📋 Quy trình Làm việc GitHub cho Team 5 Người

## 👥 Cấu trúc Team

- **Host Develop**: Bạn (người quản lý branch `develop`)
- **Team Members**: 4 thành viên khác

---

## 🌿 Chiến lược Branch (Branch Strategy)

### Các Branch chính:

```
main (production)
  └── develop (staging/development)
      ├── feature/UC-1-search-hotel
      ├── feature/UC-2-register
      ├── feature/UC-5-payment
      ├── feature/UC-9-checkin
      └── hotfix/critical-bug-fix
```

### Mô tả các Branch:

1. **`main`** (Production)
   - Branch chính, chỉ chứa code đã được test kỹ và sẵn sàng deploy
   - Chỉ Host Develop được merge vào `main`
   - Luôn ở trạng thái stable và có thể deploy bất cứ lúc nào

2. **`develop`** (Development/Staging)
   - Branch tích hợp tất cả các tính năng mới
   - Host Develop quản lý và merge các feature branches vào đây
   - Code ở đây sẽ được test trước khi merge vào `main`

3. **`feature/*`** (Feature Branches)
   - Mỗi tính năng/task sẽ có branch riêng
   - Tên format: `feature/UC-X-description` hoặc `feature/task-name`
   - Ví dụ: `feature/UC-5-payos-integration`, `feature/checkout-ui-enhancement`

4. **`hotfix/*`** (Hotfix Branches)
   - Dùng để fix bug khẩn cấp trên production
   - Tạo từ `main`, sau đó merge vào cả `main` và `develop`
   - Format: `hotfix/critical-payment-bug`

---

## 🔄 Quy trình Làm việc (Workflow)

### Bước 1: Setup ban đầu (Chỉ làm 1 lần)

```bash
# Clone repository
git clone <repository-url>
cd <project-name>

# Tạo branch develop từ main (nếu chưa có)
git checkout -b develop
git push -u origin develop
```

### Bước 2: Khi bắt đầu làm tính năng mới

#### **Team Members làm:**

```bash
# 1. Đảm bảo đang ở develop và pull code mới nhất
git checkout develop
git pull origin develop

# 2. Tạo branch mới cho tính năng
git checkout -b feature/UC-5-payos-integration

# 3. Push branch lên GitHub
git push -u origin feature/UC-5-payos-integration
```

#### **Host Develop làm:**

```bash
# Chỉ cần đảm bảo develop luôn được cập nhật
git checkout develop
git pull origin develop
```

---

### Bước 3: Làm việc trên Feature Branch

#### **Team Members:**

```bash
# Làm việc trên branch của mình
git checkout feature/UC-5-payos-integration

# Code, code, code...

# Commit thường xuyên với message rõ ràng
git add .
git commit -m "feat(UC-5): Tích hợp PayOS payment gateway"

# Push lên GitHub
git push origin feature/UC-5-payos-integration
```

#### **Quy tắc Commit Message:**

Format: `<type>(<scope>): <description>`

**Types:**
- `feat`: Tính năng mới
- `fix`: Sửa bug
- `docs`: Cập nhật documentation
- `style`: Format code (không ảnh hưởng logic)
- `refactor`: Refactor code
- `test`: Thêm/sửa test
- `chore`: Cập nhật build tools, dependencies

**Ví dụ:**
```bash
git commit -m "feat(UC-5): Tích hợp PayOS payment gateway"
git commit -m "fix(checkout): Sửa lỗi tính toán extra charges"
git commit -m "docs(README): Cập nhật hướng dẫn setup"
git commit -m "refactor(api): Tối ưu code payment controller"
```

---

### Bước 4: Sync với Develop (Quan trọng!)

#### **Team Members làm thường xuyên:**

```bash
# Khi develop có code mới, sync vào branch của mình
git checkout feature/UC-5-payos-integration

# Fetch code mới từ develop
git fetch origin develop

# Merge develop vào branch của mình
git merge origin/develop

# Nếu có conflict, giải quyết conflict rồi commit
git add .
git commit -m "merge: Sync với develop"

# Push lại
git push origin feature/UC-5-payos-integration
```

**Lưu ý:** Sync với develop **ít nhất 1 lần/ngày** để tránh conflict lớn!

---

### Bước 5: Tạo Pull Request (PR)

#### **Team Members:**

1. Vào GitHub → Repository → Click "New Pull Request"
2. Chọn:
   - **Base branch**: `develop`
   - **Compare branch**: `feature/UC-5-payos-integration`
3. Điền thông tin PR:
   - **Title**: `[UC-5] Tích hợp PayOS Payment Gateway`
   - **Description**: Mô tả chi tiết những gì đã làm
   - **Checklist**: Đánh dấu các task đã hoàn thành
4. Assign reviewers (có thể assign Host Develop hoặc team members khác)
5. Click "Create Pull Request"

#### **Template PR Description:**

```markdown
## 📝 Mô tả
Tích hợp PayOS payment gateway vào hệ thống booking

## ✅ Checklist
- [x] Tạo PayOS service
- [x] Update BookingForm để dùng PayOS
- [x] Tạo PaymentSuccess page
- [x] Tạo PaymentCancel page
- [x] Test payment flow

## 🔗 Related Issues
Closes #123

## 📸 Screenshots (nếu có)
[Ảnh minh họa]

## 🧪 Testing
- [x] Test thanh toán thành công
- [x] Test thanh toán hủy
- [x] Test webhook callback
```

---

### Bước 6: Code Review

#### **Host Develop hoặc Reviewers:**

1. Review code trong PR
2. Comment nếu có vấn đề
3. Request changes nếu cần sửa
4. Approve khi code OK

#### **Team Members:**

1. Xem comments và sửa code
2. Commit và push lại (PR sẽ tự động update)
3. Đánh dấu "Resolve conversation" khi đã sửa xong

---

### Bước 7: Merge vào Develop

#### **Host Develop làm:**

```bash
# Option 1: Merge trực tiếp trên GitHub (Khuyến nghị)
# - Vào PR → Click "Merge pull request" → "Create a merge commit"
# - Sau đó xóa branch feature (nếu không cần nữa)

# Option 2: Merge bằng command line
git checkout develop
git pull origin develop
git merge feature/UC-5-payos-integration
git push origin develop

# Xóa branch feature (local và remote)
git branch -d feature/UC-5-payos-integration
git push origin --delete feature/UC-5-payos-integration
```

**Lưu ý:** 
- Chỉ merge khi PR đã được approve
- Đảm bảo không có conflict
- Test lại sau khi merge

---

### Bước 8: Deploy lên Production (Khi sẵn sàng)

#### **Host Develop làm:**

```bash
# 1. Đảm bảo develop đã stable và test kỹ
git checkout develop
git pull origin develop

# 2. Merge develop vào main
git checkout main
git pull origin main
git merge develop

# 3. Push lên GitHub
git push origin main

# 4. Tag version (nếu cần)
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 🚨 Xử lý Conflict

### Khi có conflict:

```bash
# 1. Pull code mới nhất
git pull origin develop

# 2. Git sẽ báo conflict, mở file conflict
# 3. Tìm các dòng có <<<<<<< HEAD và >>>>>>> 
# 4. Sửa code, giữ lại phần đúng
# 5. Xóa các dòng <<<<<<< HEAD, =======, >>>>>>>

# 6. Sau khi sửa xong
git add .
git commit -m "fix: Resolve conflict với develop"
git push origin feature/your-branch
```

---

## 🔥 Hotfix Process (Fix bug khẩn cấp)

### Khi có bug trên production:

```bash
# 1. Tạo hotfix branch từ main
git checkout main
git pull origin main
git checkout -b hotfix/critical-payment-bug

# 2. Fix bug
# ... code ...

# 3. Commit và push
git add .
git commit -m "fix: Sửa lỗi thanh toán khẩn cấp"
git push origin hotfix/critical-payment-bug

# 4. Tạo PR merge vào main (và develop)
# - PR 1: hotfix → main
# - PR 2: hotfix → develop

# 5. Sau khi merge xong, xóa hotfix branch
```

---

## 📋 Quy tắc và Best Practices

### ✅ Nên làm:

1. **Commit thường xuyên** (ít nhất 1 lần/ngày khi đang code)
2. **Sync với develop** trước khi tạo PR
3. **Viết commit message rõ ràng** theo format
4. **Tạo branch mới** cho mỗi tính năng/task
5. **Test code** trước khi push
6. **Review code** của nhau trước khi merge
7. **Xóa branch** sau khi đã merge xong

### ❌ Không nên làm:

1. **KHÔNG commit trực tiếp vào `main` hoặc `develop`** (trừ Host Develop merge PR)
2. **KHÔNG force push** vào shared branches (`main`, `develop`)
3. **KHÔNG merge PR** khi chưa được review
4. **KHÔNG để branch quá lâu** không sync với develop
5. **KHÔNG commit** file `.env`, `node_modules`, hoặc file nhạy cảm

---

## 🛠️ Git Commands Cheat Sheet

### Các lệnh thường dùng:

```bash
# Xem branch hiện tại
git branch

# Xem status
git status

# Xem log
git log --oneline --graph --all

# Xem thay đổi
git diff

# Undo changes (chưa commit)
git checkout -- <file>

# Undo commit (giữ lại changes)
git reset --soft HEAD~1

# Undo commit (xóa changes)
git reset --hard HEAD~1

# Stash changes tạm thời
git stash
git stash pop

# Xem remote branches
git branch -r

# Xóa branch local
git branch -d <branch-name>

# Xóa branch remote
git push origin --delete <branch-name>
```

---

## 📊 Workflow Diagram

```
Team Member                    Host Develop
     |                              |
     |-- Create feature branch      |
     |   (feature/UC-X)             |
     |                              |
     |-- Code & Commit              |
     |                              |
     |-- Sync with develop          |
     |   (merge develop)            |
     |                              |
     |-- Create PR                  |
     |   (feature → develop)        |
     |                              |
     |                              |-- Review PR
     |                              |-- Approve/Request changes
     |                              |
     |-- Fix comments               |
     |                              |
     |                              |-- Merge PR
     |                              |   (feature → develop)
     |                              |
     |                              |-- Deploy to staging
     |                              |-- Test
     |                              |
     |                              |-- Merge to main
     |                              |   (develop → main)
     |                              |
     |                              |-- Deploy to production
```

---

## 🎯 Phân công Công việc

### Host Develop (Bạn):
- ✅ Quản lý branch `develop`
- ✅ Review và merge PRs vào `develop`
- ✅ Merge `develop` vào `main` khi sẵn sàng
- ✅ Xử lý conflicts phức tạp
- ✅ Quản lý releases và tags

### Team Members:
- ✅ Tạo feature branches
- ✅ Code và commit thường xuyên
- ✅ Sync với develop
- ✅ Tạo PRs
- ✅ Fix comments từ reviewers
- ✅ Test code trước khi push

---

## 📝 Checklist cho Team Members

Khi bắt đầu task mới:
- [ ] Pull code mới nhất từ `develop`
- [ ] Tạo feature branch mới
- [ ] Push branch lên GitHub

Khi đang code:
- [ ] Commit thường xuyên với message rõ ràng
- [ ] Push code lên GitHub
- [ ] Sync với `develop` ít nhất 1 lần/ngày

Khi hoàn thành task:
- [ ] Test code kỹ lưỡng
- [ ] Sync với `develop` lần cuối
- [ ] Tạo PR với description đầy đủ
- [ ] Assign reviewers

---

## 🆘 Troubleshooting

### Lỗi: "Your branch is behind 'origin/develop'"
```bash
git pull origin develop
# Hoặc
git fetch origin develop
git merge origin/develop
```

### Lỗi: "Permission denied"
- Kiểm tra SSH key hoặc GitHub token
- Liên hệ Host Develop để được thêm vào repository

### Lỗi: "Cannot delete branch, it has unmerged changes"
```bash
# Force delete (cẩn thận!)
git branch -D <branch-name>
```

---

## 📚 Tài liệu Tham khảo

- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## 💡 Tips

1. **Sử dụng GitHub Desktop** nếu mới học Git (UI dễ dùng hơn)
2. **Sử dụng VS Code Git extension** để quản lý Git trực quan
3. **Tạo `.gitignore` tốt** để tránh commit file không cần thiết
4. **Sử dụng Git hooks** để tự động format code trước khi commit
5. **Backup code** trước khi làm các thao tác nguy hiểm (reset, rebase)

---

**Chúc team làm việc hiệu quả! 🚀**



