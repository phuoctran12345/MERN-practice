# 📚 Hướng Dẫn React Query (@tanstack/react-query) Cho Người Mới

**Tác giả:** Hướng dẫn cho người mới học  
**Phiên bản:** React Query v5  
**Ngày tạo:** 2025-01-01

---

## 📋 MỤC LỤC

1. [React Query là gì?](#1-react-query-là-gì)
2. [Tại sao cần React Query?](#2-tại-sao-cần-react-query)
3. [Cài đặt và Setup](#3-cài-đặt-và-setup)
4. [Các Khái Niệm Cơ Bản](#4-các-khái-niệm-cơ-bản)
5. [useQuery - Fetch Data](#5-usequery---fetch-data)
6. [useMutation - Thay đổi Data](#6-usemutation---thay-đổi-data)
7. [Query Keys - Quan trọng!](#7-query-keys---quan-trọng)
8. [Cache và Refetching](#8-cache-và-refetching)
9. [Error Handling](#9-error-handling)
10. [Loading States](#10-loading-states)
11. [Ví Dụ Thực Tế Từ Dự Án](#11-ví-dụ-thực-tế-từ-dự-án)
12. [Best Practices](#12-best-practices)
13. [Common Mistakes](#13-common-mistakes)

---

## 1. React Query là gì?

**React Query** (hay **TanStack Query**) là một thư viện giúp bạn:
- ✅ **Fetch data** từ API một cách dễ dàng
- ✅ **Cache data** tự động (lưu trữ tạm thời)
- ✅ **Tự động refetch** khi cần thiết
- ✅ **Quản lý loading và error states**
- ✅ **Đồng bộ data** giữa các components

### Ví dụ đơn giản:

**KHÔNG dùng React Query:**
```typescript
// Phải tự quản lý state, loading, error
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/hotels')
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
}, []);
```

**Dùng React Query:**
```typescript
// Tự động quản lý tất cả!
const { data, isLoading, error } = useQuery({
  queryKey: ['hotels'],
  queryFn: () => fetch('/api/hotels').then(res => res.json())
});
```

---

## 2. Tại sao cần React Query?

### Vấn đề khi KHÔNG dùng React Query:

1. **Phải tự quản lý state** (loading, error, data)
2. **Không có cache** → Fetch lại mỗi lần component mount
3. **Khó đồng bộ data** giữa các components
4. **Phải tự handle refetch** khi data thay đổi
5. **Code lặp lại nhiều** (boilerplate code)

### Lợi ích khi DÙNG React Query:

1. ✅ **Giảm code** - Ít code hơn 70%
2. ✅ **Tự động cache** - Không fetch lại không cần thiết
3. ✅ **Tự động refetch** - Khi window focus, reconnect, etc.
4. ✅ **Background updates** - Update data ở background
5. ✅ **Optimistic updates** - Update UI trước khi API trả về

---

## 3. Cài đặt và Setup

### Bước 1: Cài đặt

```bash
npm install @tanstack/react-query
```

### Bước 2: Setup Provider

Trong file `main.tsx` hoặc `App.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Không retry khi lỗi
      refetchOnWindowFocus: false, // Không refetch khi focus window
      staleTime: 5 * 60 * 1000, // Data được coi là "fresh" trong 5 phút
    },
  },
});

// Wrap app với QueryClientProvider
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

---

## 4. Các Khái Niệm Cơ Bản

### 4.1 Query vs Mutation

| | Query | Mutation |
|---|---|---|
| **Mục đích** | Lấy data (GET) | Thay đổi data (POST, PUT, DELETE) |
| **Hook** | `useQuery` | `useMutation` |
| **Tự động chạy** | ✅ Có | ❌ Không (phải gọi `.mutate()`) |
| **Cache** | ✅ Có | ❌ Không |

### 4.2 Query Key

**Query Key** là một mảng định danh duy nhất cho mỗi query:

```typescript
// ✅ ĐÚNG - Array format
queryKey: ['hotels']
queryKey: ['hotel', hotelId]
queryKey: ['hotels', { city: 'Hanoi', stars: 5 }]

// ❌ SAI - String format (React Query v5 không hỗ trợ)
queryKey: 'hotels'  // ❌
```

### 4.3 Query Function

**Query Function** là hàm async trả về Promise:

```typescript
const queryFn = async () => {
  const response = await fetch('/api/hotels');
  return response.json();
};
```

---

## 5. useQuery - Fetch Data

### 5.1 Cú Pháp Cơ Bản

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error, isError } = useQuery({
  queryKey: ['hotels'],
  queryFn: () => fetchHotels(),
});
```

### 5.2 Các Properties Quan Trọng

```typescript
const {
  data,           // Data từ API
  isLoading,      // Đang loading lần đầu
  isFetching,     // Đang fetch (bao gồm cả refetch)
  isError,        // Có lỗi không?
  error,          // Object lỗi
  isSuccess,      // Thành công không?
  refetch,        // Hàm để refetch thủ công
  status,         // 'pending' | 'error' | 'success'
} = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});
```

### 5.3 Ví Dụ Thực Tế

**Ví dụ 1: Fetch danh sách khách sạn**

```typescript
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";

const Home = () => {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ["fetchHotels"],
    queryFn: () => apiClient.fetchHotels(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {hotels?.map(hotel => (
        <div key={hotel._id}>{hotel.name}</div>
      ))}
    </div>
  );
};
```

**Ví dụ 2: Fetch với parameters**

```typescript
const { data: hotel } = useQuery({
  queryKey: ["fetchHotelById", hotelId], // Query key phụ thuộc vào hotelId
  queryFn: () => apiClient.fetchHotelById(hotelId),
  enabled: !!hotelId, // Chỉ fetch khi có hotelId
});
```

### 5.4 Các Options Quan Trọng

```typescript
useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
  
  // Chỉ fetch khi điều kiện đúng
  enabled: !!userId,
  
  // Retry khi lỗi (mặc định: 3 lần)
  retry: 3,
  
  // Thời gian retry delay (mặc định: exponential backoff)
  retryDelay: 1000,
  
  // Data được coi là "fresh" trong bao lâu (ms)
  staleTime: 5 * 60 * 1000, // 5 phút
  
  // Cache data trong bao lâu sau khi không dùng
  gcTime: 10 * 60 * 1000, // 10 phút (trước đây là cacheTime)
  
  // Tự động refetch khi window focus
  refetchOnWindowFocus: true,
  
  // Tự động refetch khi reconnect
  refetchOnReconnect: true,
  
  // Refetch interval (polling)
  refetchInterval: 30000, // Mỗi 30 giây
});
```

---

## 6. useMutation - Thay đổi Data

### 6.1 Cú Pháp Cơ Bản

```typescript
import { useMutation } from "@tanstack/react-query";

const mutation = useMutation({
  mutationFn: (newHotel) => createHotel(newHotel),
  onSuccess: () => {
    // Xử lý khi thành công
  },
  onError: (error) => {
    // Xử lý khi lỗi
  },
});

// Gọi mutation
mutation.mutate(newHotelData);
```

### 6.2 Các Properties Quan Trọng

```typescript
const mutation = useMutation({
  mutationFn: createHotel,
});

const {
  mutate,        // Hàm để gọi mutation
  mutateAsync,   // Hàm async (trả về Promise)
  data,          // Data trả về từ mutation
  isLoading,      // Đang xử lý (v5: dùng isPending)
  isPending,     // Đang xử lý (v5)
  isError,       // Có lỗi không?
  error,         // Object lỗi
  isSuccess,     // Thành công không?
  reset,         // Reset mutation state
} = mutation;
```

### 6.3 Ví Dụ Thực Tế

**Ví dụ 1: Tạo khách sạn mới**

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.addMyHotel,
    onSuccess: () => {
      // Invalidate và refetch danh sách hotels
      queryClient.invalidateQueries({ queryKey: ["fetchHotels"] });
      
      // Navigate về trang My Hotels
      navigate("/my-hotels");
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleSubmit = (formData: FormData) => {
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isPending}>
        {isPending ? "Creating..." : "Create Hotel"}
      </button>
    </form>
  );
};
```

**Ví dụ 2: Update khách sạn**

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: apiClient.updateMyHotelById,
  onSuccess: () => {
    // Invalidate query để refetch data mới
    queryClient.invalidateQueries({ queryKey: ["fetchMyHotelById", hotelId] });
    showToast({ title: "Updated successfully!" });
  },
});
```

---

## 7. Query Keys - Quan Trọng!

### 7.1 Query Key là gì?

**Query Key** là định danh duy nhất cho mỗi query. React Query dùng nó để:
- Cache data
- Invalidate queries
- Refetch queries

### 7.2 Format Query Key

```typescript
// ✅ ĐÚNG - Array format (React Query v5)
queryKey: ['hotels']
queryKey: ['hotel', hotelId]
queryKey: ['hotels', { city: 'Hanoi', stars: 5 }]
queryKey: ['bookings', userId, { status: 'pending' }]

// ❌ SAI - String format
queryKey: 'hotels'  // ❌ Không hỗ trợ trong v5
```

### 7.3 Query Key Hierarchy

```typescript
// Tất cả queries bắt đầu bằng 'hotels'
['hotels']                    // Tất cả hotels
['hotels', 'list']            // Danh sách hotels
['hotels', hotelId]           // Một hotel cụ thể
['hotels', hotelId, 'rooms']  // Rooms của hotel đó

// Invalidate tất cả queries bắt đầu bằng 'hotels'
queryClient.invalidateQueries({ queryKey: ['hotels'] });
```

### 7.4 Ví Dụ Từ Dự Án

```typescript
// Trong api-client.ts
export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await axiosInstance.get("/api/hotels");
  return response.data;
};

// Trong component
const { data: hotels } = useQuery({
  queryKey: ["fetchHotels"], // ✅ Array format
  queryFn: () => apiClient.fetchHotels(),
});
```

---

## 8. Cache và Refetching

### 8.1 Cache là gì?

React Query tự động **cache** (lưu trữ) data để:
- Không fetch lại khi không cần thiết
- Hiển thị data ngay lập tức khi component mount lại
- Giảm số lượng API calls

### 8.2 Stale Time vs Cache Time

```typescript
staleTime: 5 * 60 * 1000,  // 5 phút
// Data được coi là "fresh" trong 5 phút
// Trong thời gian này, không refetch tự động

gcTime: 10 * 60 * 1000,   // 10 phút (trước đây là cacheTime)
// Data được giữ trong cache 10 phút sau khi không dùng
// Sau đó sẽ bị xóa để giải phóng memory
```

### 8.3 Invalidate Queries

**Invalidate** = Đánh dấu query là "stale" và refetch:

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate một query cụ thể
queryClient.invalidateQueries({ queryKey: ['hotels'] });

// Invalidate tất cả queries bắt đầu bằng 'hotels'
queryClient.invalidateQueries({ queryKey: ['hotels'] });

// Invalidate và refetch ngay
await queryClient.invalidateQueries({ queryKey: ['hotels'] });
await queryClient.refetchQueries({ queryKey: ['hotels'] });
```

### 8.4 Refetch Queries

```typescript
// Refetch một query cụ thể
const { refetch } = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});

// Refetch thủ công
refetch();

// Refetch với options
refetch({ queryKey: ['hotels'] });
```

---

## 9. Error Handling

### 9.1 Handle Error trong useQuery

```typescript
const { data, isError, error } = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
  retry: 3, // Retry 3 lần khi lỗi
  retryDelay: 1000, // Delay 1 giây giữa mỗi lần retry
});

if (isError) {
  return <div>Error: {error.message}</div>;
}
```

### 9.2 Handle Error trong useMutation

```typescript
const { mutate, isError, error } = useMutation({
  mutationFn: createHotel,
  onError: (error) => {
    console.error("Error:", error);
    showToast({ title: "Failed", description: error.message });
  },
});
```

### 9.3 Global Error Handler

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // Handle error globally
        console.error("Query error:", error);
      },
    },
    mutations: {
      onError: (error) => {
        // Handle mutation error globally
        console.error("Mutation error:", error);
      },
    },
  },
});
```

---

## 10. Loading States

### 10.1 Loading States trong useQuery

```typescript
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});

// isLoading: true khi đang fetch lần đầu
// isFetching: true khi đang fetch (bao gồm cả refetch)

if (isLoading) {
  return <div>Loading...</div>;
}

if (isFetching) {
  return <div>Refreshing...</div>;
}
```

### 10.2 Loading States trong useMutation

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: createHotel,
});

// React Query v5: dùng isPending thay vì isLoading

<button disabled={isPending}>
  {isPending ? "Creating..." : "Create Hotel"}
</button>
```

---

## 11. Ví Dụ Thực Tế Từ Dự Án

### 11.1 Fetch Hotels với Filters

```typescript
// Trong Search.tsx
const { data: hotelData } = useQueryWithLoading(
  ["searchHotels", searchParams], // Query key phụ thuộc vào searchParams
  () => apiClient.searchHotels(searchParams),
  {
    loadingMessage: "Searching for perfect hotels...",
  }
);
```

### 11.2 Fetch Hotel by ID

```typescript
// Trong Booking.tsx
const { data: hotel, isLoading: isLoadingHotel } = useQuery({
  queryKey: ["fetchHotelById", hotelId],
  queryFn: () => apiClient.fetchHotelById(hotelId as string),
  enabled: !!hotelId, // Chỉ fetch khi có hotelId
});
```

### 11.3 Create Booking

```typescript
// Trong BookingForm.tsx
const { mutate: bookRoom, isLoading } = useMutation({
  mutationFn: apiClient.createRoomBooking,
  onSuccess: () => {
    showToast({
      title: "Booking Successful",
      description: "Your hotel booking has been confirmed!",
      type: "SUCCESS",
    });
    navigate("/my-bookings");
  },
  onError: () => {
    showToast({
      title: "Booking Failed",
      description: "Please try again.",
      type: "ERROR",
    });
  },
});
```

### 11.4 Invalidate sau khi Update

```typescript
// Trong SignIn.tsx
const mutation = useMutationWithLoading(apiClient.signIn, {
  onSuccess: async () => {
    // Invalidate validateToken query để refetch user info
    await queryClient.invalidateQueries({ queryKey: ["validateToken"] });
    navigate("/");
  },
});
```

---

## 12. Best Practices

### 12.1 Query Key Naming Convention

```typescript
// ✅ TỐT - Rõ ràng, có hierarchy
['hotels']
['hotels', hotelId]
['hotels', hotelId, 'bookings']
['users', userId, 'profile']

// ❌ KHÔNG TỐT - Không rõ ràng
['data']
['list']
['item', id]
```

### 12.2 Tách Query Functions

```typescript
// ✅ TỐT - Tách riêng trong api-client.ts
// api-client.ts
export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await axiosInstance.get("/api/hotels");
  return response.data;
};

// Component
const { data } = useQuery({
  queryKey: ['hotels'],
  queryFn: apiClient.fetchHotels,
});
```

### 12.3 Sử dụng enabled Option

```typescript
// ✅ TỐT - Chỉ fetch khi có đủ điều kiện
const { data } = useQuery({
  queryKey: ['hotel', hotelId],
  queryFn: () => fetchHotel(hotelId),
  enabled: !!hotelId, // Chỉ fetch khi có hotelId
});
```

### 12.4 Invalidate Queries sau Mutation

```typescript
// ✅ TỐT - Invalidate để refetch data mới
const { mutate } = useMutation({
  mutationFn: createHotel,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['hotels'] });
  },
});
```

### 12.5 TypeScript Types

```typescript
// ✅ TỐT - Có type safety
const { data } = useQuery<HotelType[]>({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});

// Hoặc
const { data } = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});
// TypeScript sẽ tự infer type từ fetchHotels return type
```

---

## 13. Common Mistakes

### 13.1 ❌ SAI: Dùng String Query Key

```typescript
// ❌ SAI - React Query v5 không hỗ trợ
useQuery('hotels', fetchHotels);

// ✅ ĐÚNG
useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});
```

### 13.2 ❌ SAI: Dùng onSuccess trong useQuery

```typescript
// ❌ SAI - React Query v5 không hỗ trợ
useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
  onSuccess: (data) => {
    console.log(data);
  },
});

// ✅ ĐÚNG - Dùng useEffect
const { data } = useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});

useEffect(() => {
  if (data) {
    console.log(data);
  }
}, [data]);
```

### 13.3 ❌ SAI: Invalidate với String

```typescript
// ❌ SAI
queryClient.invalidateQueries('hotels');

// ✅ ĐÚNG
queryClient.invalidateQueries({ queryKey: ['hotels'] });
```

### 13.4 ❌ SAI: Không có Query Key

```typescript
// ❌ SAI - Query key là bắt buộc
useQuery({
  queryFn: fetchHotels,
});

// ✅ ĐÚNG
useQuery({
  queryKey: ['hotels'],
  queryFn: fetchHotels,
});
```

### 13.5 ❌ SAI: Mutate ngay trong render

```typescript
// ❌ SAI - Sẽ gọi mutation mỗi lần render
const Component = () => {
  const { mutate } = useMutation({ mutationFn: createHotel });
  mutate(data); // ❌ SAI!
  
  return <div>...</div>;
};

// ✅ ĐÚNG - Gọi trong event handler
const Component = () => {
  const { mutate } = useMutation({ mutationFn: createHotel });
  
  const handleClick = () => {
    mutate(data); // ✅ ĐÚNG
  };
  
  return <button onClick={handleClick}>Create</button>;
};
```

---

## 📚 Tài Liệu Tham Khảo

- **Official Docs:** https://tanstack.com/query/latest
- **React Query v5 Migration Guide:** https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5
- **Query Keys Guide:** https://tanstack.com/query/latest/docs/react/guides/query-keys

---

## 🎯 Tóm Tắt

1. ✅ **React Query** giúp quản lý server state dễ dàng
2. ✅ **useQuery** để fetch data (GET)
3. ✅ **useMutation** để thay đổi data (POST, PUT, DELETE)
4. ✅ **Query Keys** phải là array (React Query v5)
5. ✅ **Không có onSuccess/onError** trong useQuery v5 → dùng useEffect
6. ✅ **Invalidate queries** sau mutations để refetch data mới
7. ✅ **TypeScript** hỗ trợ tốt với React Query

---

**Chúc bạn học tốt! 🚀**



