import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../service/api"

// gọi ra xử lý tác vụ login 
export const loginUser = createAsyncThunk("users/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users?email=${email}&password=${password}`)
    
    if (response.data.length > 0) {
      const user = response.data[0]
      if (user.isBanned) {
        return rejectWithValue("Your account has been banned.")
      }
      return user
    } else {
      return rejectWithValue("Invalid email or password.")
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

// xử các tác vụ register account
export const registerUser = createAsyncThunk("users/registerUser", async (userData, { rejectWithValue }) => {
  try {
    // Check if user already exists
    const existingUser = await api.get(`/users?email=${userData.email}`)
    if (existingUser.data.length > 0) {
      return rejectWithValue("User with this email already exists.")
    }
    const response = await api.post("/users", { ...userData, id: `user_${Date.now()}` })  // Generate simple ID
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  } 
})

// fetch hết tất cả user 
export const fetchAllUsers = createAsyncThunk("users/fetchAllUsers", async () => {
  const response = await api.get("/users")
  return response.data
})

// xử lý tác vụ banned và unbanned user 
export const updateUserStatus = createAsyncThunk("users/updateUserStatus", async ({ id, isBanned }) => {
  const response = await api.patch(`/users/${id}`, { isBanned })
  return response.data
})

const userSlice = createSlice({
  name: "users",
  initialState: {
    currentUser: null,
    users: [], // For admin view
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentUser = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || action.error.message
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded"
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload || action.error.message
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
  },
})

export const { logoutUser } = userSlice.actions
export default userSlice.reducer
