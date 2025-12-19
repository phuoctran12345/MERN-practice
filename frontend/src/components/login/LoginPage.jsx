"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../../redux/slices/userSlice"
import { Link, useNavigate } from "react-router-dom"


const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, error } = useSelector((state) => state.users)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' | 'error'


  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setMessageType("")
    try {
      const user = await dispatch(loginUser({ email, password })).unwrap()
      localStorage.setItem("user", JSON.stringify(user))
      setMessage("Đăng nhập thành công!")
      setMessageType("success")
      setTimeout(() => { 
        if (user && user.role === "admin") { // true -> admin 
          navigate("/admin")
        } else {
          navigate("/")                     // false -> user 
        }
      }, 1000)
    } catch (err) {
      setMessage(`Đăng nhập thất bại: ${err.message || "Sai email hoặc mật khẩu!"}`)
      setMessageType("error")
    }
  }
  

  return (
    <div
      className="flex-center"
      style={{ 
        minHeight: "calc(100vh - 60px)", 
        padding: "3rem 1rem", 
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" 
      }}
    >
      <div className="card" style={{ width: "110%", maxWidth: "500px" }}>
        <div className="card-header text-center">
          <h1 className="card-title text-2xl font-bold">Login</h1>
          <p className="card-description">Enter your email below to login to your account</p>
        </div>
        <div className="card-content" style={{ display: "grid", gap: "1rem" }}>
          {message && (
            <div style={{
              color: messageType === "success" ? "#155724" : "#721c24",
              background: messageType === "success" ? "#d4edda" : "#f8d7da",
              border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
              borderRadius: "0.375rem",
              padding: "0.75rem 1rem",
              marginBottom: "0.5rem",
              textAlign: "center",
              fontWeight: 500,
            }}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "95%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                  marginTop: "0.25rem",
                  marginBottom: "0.5rem",
                  background: "#fff",
                  color: "#222",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onFocus={e => e.target.style.boxShadow = "0 0 0 2px #38bdf8"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "95%",
                  padding: "0.75rem 1rem",
                  border: "1.5px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                  marginTop: "0.25rem",
                  marginBottom: "0.5rem",
                  background: "#fff",
                  color: "#222",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onFocus={e => e.target.style.boxShadow = "0 0 0 2px #38bdf8"}
                onBlur={e => e.target.style.boxShadow = "none"}
              />
            </div>

            <button type="submit" className="button button-primary w-full" disabled={status === "loading"}>
              {status === "loading" ? "Logging in..." : "Login"}
            </button>

          </form>
          {/* <div className="separator my-4"></div> */}
        </div>
        <div className="card-footer text-center" style={{ fontSize: "0.875rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ textDecoration: "underline", color: "#007bff" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
