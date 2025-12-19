import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../service/api"


// ADD 
export const createOrder = createAsyncThunk("orders/createOrder", async (orderData) => {
  const response = await api.post("/orders", { ...orderData, id: `order_${Date.now()}` }) // Generate simple ID
  return response.data
})

// LIST by user
export const fetchOrdersByUser = createAsyncThunk("orders/fetchOrdersByUser", async (userId) => {
  const response = await api.get(`/orders?userId=${userId}`)
  return response.data
})

// LIST all Order
export const fetchAllOrders = createAsyncThunk("orders/fetchAllOrders", async () => {
  const response = await api.get("/orders")
  return response.data
})

// UPDATE 
export const updateOrderStatus = createAsyncThunk("orders/updateOrderStatus", async ({ id, status }) => {
  const response = await api.patch(`/orders/${id}`, { status })
  return response.data
})

// createAsyncThunk: Hàm của Redux Toolkit để tạo các action bất đồng bộ, thường dùng để gọi API.
// api: Một service (được import từ ../../service/api) để gọi các API endpoint (POST, GET, PATCH).

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' || idle -> tác vụ đang chill k có việc cj làm  ||loading  -> chưa được gọi 
    error: null,
  },

  //extraReducers sử dụng builder pattern để xử lý các trạng thái của các async thunks. Mỗi addCase tương ứng với một trạng thái của một thunk.
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders.push(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders = action.payload
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {                          // updateOrderStatus thành công -> callback ni sẽ chạy 
        const index = state.orders.findIndex((order) => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload                  // trả dữ liệu về API 
        }
      })
  },
})

export default orderSlice.reducer
