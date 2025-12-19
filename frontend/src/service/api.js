import axios from "axios"

const API_BASE_URL = "http://localhost:3001" // JSON Server runs on port 3001

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export default api
