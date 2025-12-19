"use client"

import { Link, useNavigate } from "react-router-dom" // Import useNavigate
import { ShoppingCart, User, LayoutDashboard } from "lucide-react"
import { useSelector, useDispatch } from "react-redux" // Import useDispatch
import { logoutUser } from "../redux/slices/userSlice" // Import logoutUser action

const Header = () => {
  const cartItems = useSelector((state) => state.cart.items)
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0)
  const currentUser = useSelector((state) => state.users.currentUser)
  const dispatch = useDispatch() // Initialize useDispatch
  const navigate = useNavigate() // Initialize useNavigate

  const handleLogout = () => {
    // Xóa user khỏi localStorage khi logout
    localStorage.removeItem("user")
    dispatch(logoutUser())
    navigate("/") // Redirect to home page after logout
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
          E-commerce App
        </Link>
        <nav>
          <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, gap: "1rem" }}>
            <li>
              <Link to="/products" style={{ color: "#fff", textDecoration: "none" }}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" style={{ color: "#fff", textDecoration: "none" }}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" style={{ color: "#fff", textDecoration: "none" }}>
                Services
              </Link>
            </li>
            {(currentUser?.role === "admin" || currentUser?.role === "manager") && (
              <li>
                <Link to="/admin/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
                  <LayoutDashboard size={18} style={{ verticalAlign: "middle", marginRight: "0.25rem" }} />
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/cart" style={{ color: "#fff", textDecoration: "none", position: "relative" }}>
          <ShoppingCart size={24} />
          {totalItemsInCart > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "red",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "0.75rem",
              }}
            >
              {totalItemsInCart}
            </span>
          )}
        </Link>
        {currentUser ? (
          <span style={{ color: "#fff" }}>
            Hi, {currentUser.email.split("@")[0]} (
            <button
              onClick={handleLogout} // Call handleLogout function
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
            )
          </span>
        ) : (
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
            <User size={24} />
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
