import { Navigate } from "react-router-dom"

function RequireAdmin({ children }) {
  // Lấy user từ localStorage (hoặc có thể lấy từ redux nếu bạn muốn)
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user || user.role !== "admin") {
    // Nếu không phải admin, chuyển hướng về trang login
    return <Navigate to="/login" replace />
  }
  // Nếu là admin, render children (tức là trang admin)
  return children
}

export default RequireAdmin 