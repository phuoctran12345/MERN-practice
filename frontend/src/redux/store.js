import { configureStore } from "@reduxjs/toolkit"      //một hàm -> call ra để tạo redux store 
import productReducer from "./slices/productSlice"
import userReducer from "./slices/userSlice"
import cartReducer from "./slices/cartSlice"
import orderReducer from "./slices/orderSlice"

const store = configureStore({
  reducer: {                                          //reducer ở đây như 1 object [key ; value] ở đây product đấu với selectedProduct 
    products: productReducer,
    users: userReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
})

export default store
/*
liên kết với productSlices được định nghĩa trong initialState của productSlice:
products: {
    products: [],
    selectedProduct: null,
    status: "idle",
    error: null
  },
*/