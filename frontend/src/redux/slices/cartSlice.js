import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",                      // tên slice
  initialState: {                    // khởi tạo mảng rỗng chưa sản phẩm  
    items: [],
  },

  reducers: {
    // ADD
    addToCart: (state, action) => {
      const existingItem = state.items.find(  
        (item) => item.id === action.payload.id)      // find -> tìm phần tử đầu tiên trong mảng vs điều kiện thoả mản điều kiện trong hàm call back

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1.                                 // sản phẩm đã tồn tại thì + 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 })        // chưa có thì thêm zo mảng rỗng   
      }

    },

    // UPDATE
    updateQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id)                   // gọi method array ra để search phần tử đầu tiên
      if (item) {
        item.quantity = action.payload.quantity                                                                                                                                      
      }
    },
                                                                                              /*
                                                                                                state.items = [{ id: 1, name: "Sản phẩm A", quantity: 2 }].
                                                                                                action.payload = { id: 1, quantity: 5 }:
                                                                                                Sản phẩm với id: 1 được tìm thấy → quantity được cập nhật thành 5.
                                                                                                action.payload = { id: 2, quantity: 5 }:
                                                                                                Không tìm thấy sản phẩm với id: 2 → Không thay đổi gì.
                                                                                              */   

    // DELETE
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)                  // dùng filer để tạo mảng mới đè lên mảng cũ theo id chỉ giữ lại các sản phẩm có id không khớp với action.payload            
    },

    // CLEAR giỏ hàng 
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
