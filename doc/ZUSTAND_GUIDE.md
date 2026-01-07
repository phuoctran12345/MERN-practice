# 📚 HƯỚNG DẪN ZUSTAND - Từ Cơ Bản Đến Nâng Cao

**Dành cho:** Người mới học React State Management  
**Dự án:** Smart Hotel Management System  
**Mục tiêu:** Hiểu và áp dụng Zustand vào dự án thực tế

---

## 📋 MỤC LỤC

1. [Zustand là gì?](#1-zustand-là-gì)
2. [Tại sao dùng Zustand?](#2-tại-sao-dùng-zustand)
3. [So sánh với Context API](#3-so-sánh-với-context-api)
4. [Cài đặt](#4-cài-đặt)
5. [Cơ bản](#5-cơ-bản)
6. [Nâng cao](#6-nâng-cao)
7. [Ví dụ thực tế](#7-ví-dụ-thực-tế)
8. [Migration Guide](#8-migration-guide)
9. [Best Practices](#9-best-practices)

---

## 1. ZUSTAND LÀ GÌ?

### Định nghĩa đơn giản:

**Zustand** (tiếng Đức nghĩa là "trạng thái") là một **state management library** nhỏ gọn, đơn giản cho React.

### Đặc điểm:

- ✅ **Nhỏ gọn**: Chỉ ~1KB (gzip)
- ✅ **Đơn giản**: API dễ hiểu, ít boilerplate
- ✅ **Mạnh mẽ**: Hỗ trợ TypeScript, middleware, persist
- ✅ **Hiệu suất cao**: Chỉ re-render khi cần
- ✅ **Không cần Provider**: Không cần wrap component tree

### Zustand vs Redux vs Context API:

| Tính năng | Zustand | Redux | Context API |
|-----------|---------|-------|-------------|
| Bundle size | ~1KB | ~10KB | Built-in |
| Boilerplate | Rất ít | Nhiều | Trung bình |
| Learning curve | Dễ | Khó | Dễ |
| DevTools | ✅ | ✅ | ❌ |
| TypeScript | ✅ Tốt | ✅ Tốt | ⚠️ OK |
| Performance | ✅ Tốt | ✅ Tốt | ⚠️ Có thể chậm |

---

## 2. TẠI SAO DÙNG ZUSTAND?

### Vấn đề với Context API:

#### 1. **Re-render không cần thiết**

```tsx
// ❌ Context API - Tất cả components re-render khi state thay đổi
const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  
  return (
    <AppContext.Provider value={{ user, theme, loading }}>
      <Header /> {/* Re-render khi user, theme, hoặc loading thay đổi */}
      <Sidebar /> {/* Re-render khi user, theme, hoặc loading thay đổi */}
      <MainContent /> {/* Re-render khi user, theme, hoặc loading thay đổi */}
    </AppContext.Provider>
  );
}
```

#### 2. **Boilerplate nhiều**

```tsx
// ❌ Context API - Cần nhiều code
const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [state, setState] = useState({});
  // ... nhiều logic
  return <AppContext.Provider value={...}>{children}</AppContext.Provider>;
};
```

#### 3. **Khó tổ chức**

- Nhiều Context → Nhiều Provider
- Khó debug
- Khó test

### Giải pháp với Zustand:

#### 1. **Chỉ re-render khi cần**

```tsx
// ✅ Zustand - Chỉ re-render component nào dùng state đó
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

function Header() {
  const user = useAuthStore((state) => state.user); // Chỉ re-render khi user thay đổi
  return <div>{user?.name}</div>;
}
```

#### 2. **Ít boilerplate**

```tsx
// ✅ Zustand - Code ngắn gọn
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

#### 3. **Dễ tổ chức**

- Mỗi store là một file riêng
- Dễ import và sử dụng
- Dễ test

---

## 3. SO SÁNH VỚI CONTEXT API

### Ví dụ: Quản lý User Authentication

#### Context API (Cách cũ):

```tsx
// ❌ Context API - Nhiều code, phức tạp
import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (email: string, password: string) => {
    // ... login logic
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Sử dụng:
function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}

function Header() {
  const { user, logout } = useAuth(); // Phải wrap trong Provider
  return <div>{user?.name}</div>;
}
```

#### Zustand (Cách mới):

```tsx
// ✅ Zustand - Ngắn gọn, đơn giản
import { create } from 'zustand';

type AuthStore = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  
  login: async (email: string, password: string) => {
    // ... login logic
    set({ user: userData, isLoggedIn: true });
  },
  
  logout: () => {
    set({ user: null, isLoggedIn: false });
  },
}));

// Sử dụng:
function App() {
  return <Header />; // Không cần Provider!
}

function Header() {
  const user = useAuthStore((state) => state.user); // Dùng trực tiếp
  const logout = useAuthStore((state) => state.logout);
  return <div>{user?.name}</div>;
}
```

### So sánh:

| Tiêu chí | Context API | Zustand |
|----------|-------------|---------|
| **Lines of code** | ~50 lines | ~20 lines |
| **Provider cần thiết** | ✅ Có | ❌ Không |
| **Re-render** | Tất cả consumers | Chỉ components dùng state |
| **TypeScript** | Cần type riêng | Built-in |
| **DevTools** | ❌ Không | ✅ Có |

---

## 4. CÀI ĐẶT

### Bước 1: Install package

```bash
cd frontend
npm install zustand
```

### Bước 2: Verify installation

```bash
npm list zustand
```

Bạn sẽ thấy:
```
zustand@4.x.x
```

---

## 5. CƠ BẢN

### 5.1. Tạo Store Đầu Tiên

#### Ví dụ đơn giản: Counter Store

```tsx
// stores/counterStore.ts
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  
  decrement: () => set((state) => ({ count: state.count - 1 })),
  
  reset: () => set({ count: 0 }),
}));
```

#### Giải thích:

- `create()`: Hàm tạo store
- `set`: Hàm để update state
- `state`: State hiện tại
- Return object: State và actions

### 5.2. Sử Dụng Store Trong Component

```tsx
// components/Counter.tsx
import { useCounterStore } from '../stores/counterStore';

function Counter() {
  // Cách 1: Lấy tất cả state và actions
  const { count, increment, decrement, reset } = useCounterStore();
  
  // Cách 2: Chỉ lấy những gì cần (tốt hơn cho performance)
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### 5.3. Selectors (Chọn State Cụ Thể)

#### Tại sao dùng Selectors?

- ✅ Chỉ re-render khi state được chọn thay đổi
- ✅ Performance tốt hơn
- ✅ Code rõ ràng hơn

```tsx
// ❌ Không tốt - Re-render khi bất kỳ state nào thay đổi
const store = useCounterStore();

// ✅ Tốt - Chỉ re-render khi count thay đổi
const count = useCounterStore((state) => state.count);

// ✅ Tốt - Selector function
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);
```

### 5.4. Update State

#### Cách 1: Set trực tiếp

```tsx
const useStore = create((set) => ({
  name: 'John',
  setName: (name: string) => set({ name }),
}));
```

#### Cách 2: Set với function (khi cần state hiện tại)

```tsx
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

#### Cách 3: Set nhiều state cùng lúc

```tsx
const useStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user: User) => set({ user, isLoggedIn: true }),
}));
```

---

## 6. NÂNG CAO

### 6.1. Async Actions

#### Ví dụ: Login với API call

```tsx
// stores/authStore.ts
import { create } from 'zustand';
import * as apiClient from '../api-client';

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await apiClient.login(email, password);
      set({ user, isLoading: false, error: null });
    } catch (error: any) {
      set({ 
        user: null, 
        isLoading: false, 
        error: error.message || 'Login failed' 
      });
    }
  },
  
  logout: () => {
    set({ user: null, isLoading: false, error: null });
  },
}));
```

#### Sử dụng:

```tsx
function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### 6.2. Middleware

#### DevTools Middleware

```tsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: 'CounterStore' } // Tên store trong DevTools
  )
);
```

#### Persist Middleware (Lưu vào localStorage)

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);
```

### 6.3. TypeScript với Zustand

#### Type Store đầy đủ:

```tsx
import { create } from 'zustand';

// Định nghĩa type
type UserStore = {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

// Tạo store với type
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
```

#### Sử dụng với type safety:

```tsx
function UserProfile() {
  // TypeScript tự động biết type
  const user = useUserStore((state) => state.user); // User | null
  const setUser = useUserStore((state) => state.setUser); // (user: User | null) => void
  
  return <div>{user?.name}</div>;
}
```

### 6.4. Computed Values (Giá trị tính toán)

```tsx
const useCartStore = create((set, get) => ({
  items: [],
  
  // Computed value
  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
  
  // Hoặc dùng function
  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  },
}));
```

---

## 7. VÍ DỤ THỰC TẾ

### 7.1. Migrate AppContext → Zustand AuthStore

#### AppContext hiện tại (Context API):

```tsx
// contexts/AppContext.tsx (Cách cũ)
export const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ... nhiều logic
  return <AppContext.Provider value={...}>{children}</AppContext.Provider>;
};
```

#### Zustand AuthStore (Cách mới):

```tsx
// stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../api-client';

type AuthStore = {
  isLoggedIn: boolean;
  user: User | null;
  showToast: (toastMessage: ToastMessage) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        user: null,
        
        showToast: (toastMessage: ToastMessage) => {
          // Toast logic
        },
        
        setIsLoggedIn: (isLoggedIn: boolean) => {
          set({ isLoggedIn });
        },
        
        setUser: (user: User | null) => {
          set({ user });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          isLoggedIn: state.isLoggedIn,
          user: state.user 
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
```

### 7.2. User Store

```tsx
// stores/userStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type UserStore = {
  currentUser: User | null;
  userRole: 'user' | 'hotel_owner' | 'manager' | 'receptionist' | null;
  setCurrentUser: (user: User | null) => void;
  setUserRole: (role: UserStore['userRole']) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      currentUser: null,
      userRole: null,
      
      setCurrentUser: (user: User | null) => {
        set({ 
          currentUser: user,
          userRole: user?.role || null 
        });
      },
      
      setUserRole: (role: UserStore['userRole']) => {
        set({ userRole: role });
      },
      
      clearUser: () => {
        set({ currentUser: null, userRole: null });
      },
    }),
    { name: 'UserStore' }
  )
);
```

### 7.3. Config Store

```tsx
// stores/configStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ConfigStore = {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'vi' | 'en') => void;
};

export const useConfigStore = create<ConfigStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        language: 'vi',
        
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'config-storage',
      }
    ),
    { name: 'ConfigStore' }
  )
);
```

### 7.4. Booking Store (Ví dụ phức tạp)

```tsx
// stores/bookingStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type BookingStore = {
  selectedHotel: Hotel | null;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  adultCount: number;
  childCount: number;
  selectedRoom: Room | null;
  
  setSelectedHotel: (hotel: Hotel | null) => void;
  setCheckInDate: (date: Date | null) => void;
  setCheckOutDate: (date: Date | null) => void;
  setAdultCount: (count: number) => void;
  setChildCount: (count: number) => void;
  setSelectedRoom: (room: Room | null) => void;
  resetBooking: () => void;
  
  // Computed
  get totalNights(): number;
  get totalGuests(): number;
};

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      selectedHotel: null,
      checkInDate: null,
      checkOutDate: null,
      adultCount: 1,
      childCount: 0,
      selectedRoom: null,
      
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      setCheckInDate: (date) => set({ checkInDate: date }),
      setCheckOutDate: (date) => set({ checkOutDate: date }),
      setAdultCount: (count) => set({ adultCount: count }),
      setChildCount: (count) => set({ childCount: count }),
      setSelectedRoom: (room) => set({ selectedRoom: room }),
      
      resetBooking: () => set({
        selectedHotel: null,
        checkInDate: null,
        checkOutDate: null,
        adultCount: 1,
        childCount: 0,
        selectedRoom: null,
      }),
      
      get totalNights() {
        const { checkInDate, checkOutDate } = get();
        if (!checkInDate || !checkOutDate) return 0;
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      
      get totalGuests() {
        const { adultCount, childCount } = get();
        return adultCount + childCount;
      },
    }),
    { name: 'BookingStore' }
  )
);
```

---

## 8. MIGRATION GUIDE

### 8.1. Step-by-Step Migration từ Context API

#### Bước 1: Tạo Zustand Store

```tsx
// stores/authStore.ts
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));
```

#### Bước 2: Update Components

```tsx
// ❌ Cách cũ (Context API)
import { useAppContext } from '../contexts/AppContext';

function Header() {
  const { isLoggedIn } = useAppContext();
  return <div>{isLoggedIn ? 'Logged in' : 'Not logged in'}</div>;
}

// ✅ Cách mới (Zustand)
import { useAuthStore } from '../stores/authStore';

function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return <div>{isLoggedIn ? 'Logged in' : 'Not logged in'}</div>;
}
```

#### Bước 3: Remove Provider

```tsx
// ❌ Cách cũ
function App() {
  return (
    <AppContextProvider>
      <Header />
    </AppContextProvider>
  );
}

// ✅ Cách mới - Không cần Provider!
function App() {
  return <Header />;
}
```

#### Bước 4: Delete Context File

```bash
# Xóa file Context cũ
rm src/contexts/AppContext.tsx
```

### 8.2. Migration Checklist

- [ ] Tạo Zustand store tương ứng
- [ ] Update tất cả components sử dụng Context
- [ ] Remove Provider từ App.tsx
- [ ] Delete Context file cũ
- [ ] Test authentication flow
- [ ] Test state updates
- [ ] Verify không có re-render không cần thiết

### 8.3. Testing Sau Migration

```tsx
// Test store
import { useAuthStore } from '../stores/authStore';

function TestComponent() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  
  return (
    <div>
      <p>Is Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
      <button onClick={() => setIsLoggedIn(true)}>Login</button>
      <button onClick={() => setIsLoggedIn(false)}>Logout</button>
    </div>
  );
}
```

---

## 9. BEST PRACTICES

### 9.1. Tổ Chức Stores

```
src/
├── stores/
│   ├── authStore.ts      # Authentication
│   ├── userStore.ts      # User data
│   ├── bookingStore.ts   # Booking flow
│   ├── configStore.ts    # App config
│   └── index.ts          # Export all stores
```

### 9.2. Naming Conventions

```tsx
// ✅ Tốt - Rõ ràng
const useAuthStore = create(...);
const useUserStore = create(...);
const useBookingStore = create(...);

// ❌ Không tốt - Không rõ ràng
const useStore = create(...);
const useApp = create(...);
```

### 9.3. Selectors

```tsx
// ✅ Tốt - Chỉ select những gì cần
const user = useAuthStore((state) => state.user);
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

// ❌ Không tốt - Lấy tất cả
const store = useAuthStore();
const user = store.user;
```

### 9.4. Actions

```tsx
// ✅ Tốt - Actions rõ ràng
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);

// ❌ Không tốt - Set trực tiếp
const setState = useAuthStore((state) => state.setState);
setState({ user: newUser });
```

### 9.5. TypeScript

```tsx
// ✅ Tốt - Type đầy đủ
type AuthStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  // ...
}));

// ❌ Không tốt - Không có type
export const useAuthStore = create((set) => ({
  // ...
}));
```

### 9.6. DevTools

```tsx
// ✅ Luôn dùng DevTools trong development
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    (set) => ({ /* ... */ }),
    { name: 'AuthStore' }
  )
);
```

### 9.7. Persist

```tsx
// ✅ Dùng persist cho data quan trọng
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'auth-storage' }
  )
);
```

---

## 10. TÓM TẮT

### Những gì đã học:

1. ✅ **Zustand là gì**: State management library nhỏ gọn cho React
2. ✅ **Tại sao dùng**: Đơn giản, hiệu suất cao, ít boilerplate
3. ✅ **Cơ bản**: Tạo store, sử dụng trong component, selectors
4. ✅ **Nâng cao**: Async actions, middleware, TypeScript
5. ✅ **Thực tế**: Ví dụ từ dự án Hotel Booking
6. ✅ **Migration**: Cách migrate từ Context API

### Next Steps:

1. Install Zustand: `npm install zustand`
2. Tạo store đầu tiên: `authStore.ts`
3. Migrate AppContext → Zustand
4. Test và verify
5. Tạo thêm stores: `userStore`, `configStore`, `bookingStore`

---

## 11. TÀI LIỆU THAM KHẢO

- [Zustand Official Docs](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand#typescript)

---

## 12. EXERCISES (Bài Tập)

### Exercise 1: Tạo Counter Store

Tạo một counter store với:
- `count` state
- `increment` action
- `decrement` action
- `reset` action

### Exercise 2: Tạo Todo Store

Tạo một todo store với:
- `todos` array
- `addTodo` action
- `removeTodo` action
- `toggleTodo` action
- `clearTodos` action

### Exercise 3: Migrate AppContext

Migrate `AppContext.tsx` sang Zustand:
- Tạo `authStore.ts`
- Update components sử dụng Context
- Remove Provider
- Test authentication flow

---

**Chúc bạn học tốt! 🚀**

Nếu có thắc mắc, hãy đọc lại phần tương ứng hoặc xem ví dụ trong dự án!

