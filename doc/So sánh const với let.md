# 📚 Const vs Let - Bài Học Kinh Nghiệm

## 🎯 Câu Hỏi: Có thể spam hoàn toàn `const` được không?

**Trả lời ngắn gọn:** ❌ **KHÔNG**, không thể dùng hoàn toàn `const` trong mọi trường hợp.

**Lý do:** `const` không cho phép **gán lại giá trị**, nhưng trong code thực tế, bạn thường cần thay đổi giá trị biến.

---

## 📖 Kiến Thức Cơ Bản

### **1. `const` - Constant (Hằng số)**

```typescript
const name = "John";
name = "Jane";  // ❌ LỖI: Cannot assign to 'name' because it is a constant
```

**Đặc điểm:**
- ✅ Không thể **gán lại** (reassign)
- ✅ Phải khởi tạo giá trị ngay khi khai báo
- ✅ Giá trị không thay đổi sau khi khai báo

**Khi nào dùng `const`:**
- Khi giá trị **không bao giờ thay đổi**
- Khi bạn **không cần gán lại** giá trị
- **Nên dùng mặc định** (best practice)

---

### **2. `let` - Variable (Biến)**

```typescript
let name = "John";
name = "Jane";  // ✅ OK! Có thể gán lại
```

**Đặc điểm:**
- ✅ Có thể **gán lại** (reassign)
- ✅ Có thể khai báo mà không khởi tạo
- ✅ Giá trị có thể thay đổi

**Khi nào dùng `let`:**
- Khi giá trị **cần thay đổi** sau này
- Khi bạn **cần gán lại** giá trị
- Trong vòng lặp, điều kiện

---

## 🔍 So Sánh Chi Tiết

| Đặc điểm | `const` | `let` |
|----------|---------|-------|
| **Gán lại giá trị** | ❌ Không | ✅ Có |
| **Khai báo không khởi tạo** | ❌ Không | ✅ Có |
| **Block scope** | ✅ Có | ✅ Có |
| **Hoisting** | ❌ Không | ❌ Không |
| **Best Practice** | ✅ Nên dùng mặc định | Dùng khi cần |

---

## 💡 Ví Dụ Thực Tế

### **Ví Dụ 1: Dùng `const` - Đúng**

```typescript
// ✅ ĐÚNG - Giá trị không thay đổi
const userId = req.userId;
const email = req.body.email;
const API_URL = "https://api.example.com";

// ✅ ĐÚNG - Object/Array (có thể thay đổi nội dung, nhưng không thể gán lại)
const user = { name: "John" };
user.name = "Jane";  // ✅ OK - Thay đổi property
user = { name: "Jane" };  // ❌ LỖI - Không thể gán lại object

const numbers = [1, 2, 3];
numbers.push(4);  // ✅ OK - Thêm phần tử
numbers = [1, 2, 3, 4];  // ❌ LỖI - Không thể gán lại array
```

### **Ví Dụ 2: Dùng `let` - Đúng**

```typescript
// ✅ ĐÚNG - Cần gán lại giá trị
let user = await User.findOne({ email: "test@email.com" });

if (!user) {
    user = new User({ email: "test@email.com" });  // ✅ OK - Gán lại
    await user.save();
}

// ✅ ĐÚNG - Vòng lặp
let sum = 0;
for (let i = 0; i < 10; i++) {  // i cần dùng let
    sum += i;
}

// ✅ ĐÚNG - Điều kiện thay đổi giá trị
let status = "pending";
if (paymentSuccess) {
    status = "paid";  // ✅ OK - Gán lại
}
```

### **Ví Dụ 3: Lỗi Thường Gặp**

```typescript
// ❌ SAI - Dùng const nhưng cần gán lại
const user = await User.findOne({ email: "test@email.com" });
user = new User({ email: "test@email.com" });  // ❌ LỖI!

// ✅ ĐÚNG - Dùng let
let user = await User.findOne({ email: "test@email.com" });
user = new User({ email: "test@email.com" });  // ✅ OK!
```

---

## 🎯 Quy Tắc Vàng: Khi Nào Dùng Gì?

### **Quy Tắc 1: Dùng `const` mặc định**

```typescript
// ✅ LUÔN DÙNG const trước
const userId = req.userId;
const email = req.body.email;
const token = jwt.sign(...);
```

**Lý do:**
- Code an toàn hơn (không thể gán nhầm)
- Dễ đọc hơn (biết giá trị không thay đổi)
- Best practice trong JavaScript/TypeScript

### **Quy Tắc 2: Chỉ dùng `let` khi CẦN THIẾT**

```typescript
// Chỉ dùng let khi:
// 1. Cần gán lại giá trị
let user = await User.findOne();
user = new User();  // Cần gán lại → Dùng let

// 2. Vòng lặp
for (let i = 0; i < 10; i++) { }

// 3. Điều kiện thay đổi giá trị
let status = "pending";
if (condition) {
    status = "completed";  // Cần gán lại → Dùng let
}
```

---

## 🔄 Trường Hợp Đặc Biệt: Object và Array

### **`const` với Object/Array**

```typescript
// ✅ const với object - Có thể thay đổi nội dung
const user = { name: "John", age: 30 };
user.name = "Jane";  // ✅ OK - Thay đổi property
user.age = 25;       // ✅ OK - Thay đổi property

// ❌ Nhưng không thể gán lại object
user = { name: "Jane" };  // ❌ LỖI!

// ✅ const với array - Có thể thay đổi nội dung
const numbers = [1, 2, 3];
numbers.push(4);     // ✅ OK - Thêm phần tử
numbers[0] = 10;     // ✅ OK - Thay đổi phần tử

// ❌ Nhưng không thể gán lại array
numbers = [1, 2, 3, 4];  // ❌ LỖI!
```

**Giải thích:**
- `const` chỉ ngăn **gán lại** biến
- Không ngăn **thay đổi nội dung** của object/array
- Object/Array là **reference type** (tham chiếu), không phải giá trị

---

## 🎓 Ví Dụ Trong Backend Code

### **Ví Dụ 1: Controller - Đăng ký User**

```typescript
export const registerUser = async (req: Request, res: Response) => {
    // ✅ const - Giá trị không thay đổi
    const email = req.body.email;
    const password = req.body.password;
    
    // ✅ let - Cần gán lại giá trị
    let user = await User.findOne({ email });
    
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    // ✅ Gán lại user - Cần dùng let
    user = new User({ email, password });
    await user.save();
    
    // ✅ const - Giá trị không thay đổi
    const token = jwt.sign({ userId: user.id }, SECRET);
    
    return res.status(200).json({ message: "Success" });
};
```

### **Ví Dụ 2: Controller - Cập nhật Hotel**

```typescript
export const updateHotel = async (req: Request, res: Response) => {
    // ✅ const - Giá trị không thay đổi
    const hotelId = req.params.id;
    const userId = req.userId;
    
    // ✅ const - Giá trị không thay đổi (findOneAndUpdate trả về giá trị mới)
    const hotel = await Hotel.findOneAndUpdate(
        { _id: hotelId, userId },
        req.body,
        { new: true }
    );
    
    // ✅ const - Giá trị không thay đổi
    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }
    
    return res.json(hotel);
};
```

### **Ví Dụ 3: Controller - Xử lý nhiều bước**

```typescript
export const createHotel = async (req: Request, res: Response) => {
    // ✅ const - Giá trị không thay đổi
    const imageFiles = req.files;
    const hotelData = req.body;
    
    // ✅ let - Cần gán lại giá trị
    let imageUrls = [];
    
    // Upload từng ảnh và thêm vào array
    for (const file of imageFiles) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);  // ✅ OK - Thay đổi nội dung array (dùng const cho array cũng được)
    }
    
    // ✅ const - Giá trị không thay đổi
    const hotel = new Hotel({
        ...hotelData,
        imageUrls,
        userId: req.userId
    });
    
    await hotel.save();
    return res.status(201).json(hotel);
};
```

---

## 🚫 Lỗi Thường Gặp

### **Lỗi 1: Dùng `const` nhưng cần gán lại**

```typescript
// ❌ SAI
const user = await User.findOne({ email });
user = new User({ email });  // Lỗi: Cannot assign to 'user'

// ✅ ĐÚNG
let user = await User.findOne({ email });
user = new User({ email });  // OK!
```

### **Lỗi 2: Dùng `let` không cần thiết**

```typescript
// ❌ KHÔNG TỐI ƯU - Dùng let không cần thiết
let userId = req.userId;
let email = req.body.email;

// ✅ TỐI ƯU - Dùng const
const userId = req.userId;
const email = req.body.email;
```

### **Lỗi 3: Hiểu nhầm về `const` với Object**

```typescript
// ✅ ĐÚNG - Có thể thay đổi property
const user = { name: "John" };
user.name = "Jane";  // OK!

// ❌ SAI - Không thể gán lại object
const user = { name: "John" };
user = { name: "Jane" };  // Lỗi!
```

---

## 📋 Checklist: Khi Nào Dùng Gì?

### **Dùng `const` khi:**
- [ ] Giá trị **không bao giờ thay đổi**
- [ ] Không cần **gán lại** biến
- [ ] Object/Array (có thể thay đổi nội dung, nhưng không gán lại)
- [ ] **Mặc định** - dùng const trước, chỉ đổi sang let khi cần

### **Dùng `let` khi:**
- [ ] Cần **gán lại** giá trị
- [ ] Vòng lặp (for, while)
- [ ] Điều kiện thay đổi giá trị
- [ ] Khai báo mà chưa biết giá trị ban đầu

---

## 🎯 Best Practices

### **1. Luôn dùng `const` mặc định**

```typescript
// ✅ TỐT - Dùng const mặc định
const userId = req.userId;
const email = req.body.email;

// ❌ KHÔNG TỐT - Dùng let không cần thiết
let userId = req.userId;  // Không cần gán lại → Dùng const
```

### **2. Chỉ dùng `let` khi thực sự cần**

```typescript
// ✅ TỐT - Chỉ dùng let khi cần gán lại
let user = await User.findOne();
if (!user) {
    user = new User();  // Cần gán lại → Dùng let
}

// ❌ KHÔNG TỐT - Dùng let nhưng không gán lại
let user = await User.findOne();
// Không gán lại → Nên dùng const
```

### **3. Tránh dùng `var`**

```typescript
// ❌ TRÁNH - var có function scope, dễ gây bug
var name = "John";

// ✅ DÙNG - const hoặc let có block scope
const name = "John";
let name = "John";
```

---

## 🔄 Refactor: Từ `let` sang `const` khi có thể

### **Trước (Dùng let không cần thiết):**

```typescript
let userId = req.userId;
let email = req.body.email;
let user = await User.findById(userId);
```

### **Sau (Dùng const khi có thể):**

```typescript
const userId = req.userId;      // ✅ const - Không thay đổi
const email = req.body.email;   // ✅ const - Không thay đổi
const user = await User.findById(userId);  // ✅ const - Không thay đổi
```

**Lưu ý:** Chỉ dùng `let` khi **thực sự cần gán lại**:

```typescript
// ✅ Cần let - Sẽ gán lại giá trị
let user = await User.findOne({ email });
if (!user) {
    user = new User({ email });  // Gán lại → Cần let
}
```

---

## 🎓 Tóm Tắt

### **Câu Trả Lời: Có thể spam hoàn toàn `const` không?**

❌ **KHÔNG**, nhưng có thể dùng `const` trong **90% trường hợp**.

**Quy tắc:**
1. ✅ **Mặc định dùng `const`** - An toàn, dễ đọc
2. ✅ **Chỉ dùng `let` khi CẦN THIẾT** - Khi cần gán lại giá trị
3. ✅ **Tránh dùng `var`** - Đã lỗi thời

**Tỷ lệ sử dụng:**
- `const`: ~90% (hầu hết các biến)
- `let`: ~10% (khi cần gán lại, vòng lặp)
- `var`: 0% (không dùng)

---

## 💡 Kết Luận

**Không thể dùng hoàn toàn `const`**, nhưng:
- ✅ Dùng `const` **mặc định** cho mọi biến
- ✅ Chỉ đổi sang `let` khi **thực sự cần** gán lại giá trị
- ✅ Code sẽ **an toàn hơn**, **dễ đọc hơn**, **ít bug hơn**

**Nhớ:** `const` = Constant (không đổi), `let` = Variable (có thể đổi)!

---

**Chúc bạn code vui vẻ! 🚀**

