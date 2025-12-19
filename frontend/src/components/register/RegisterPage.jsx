"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../redux/slices/userSlice"
import { Link, useNavigate } from "react-router-dom"
import { Chrome } from "lucide-react"

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((state) => state.users)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }
    try {
      await dispatch(registerUser({ email, password, role: "user" })).unwrap() // Default role 'user'
      alert("Registration successful! Please login.")
      navigate("/login")
    } catch (err) {
      alert(`Registration failed: ${err.message || "An error occurred"}`)
    }
  }

  return (
    <div
      className="flex-center"
      style={{ minHeight: "calc(100vh - 60px)", padding: "3rem 1rem", backgroundColor: "#f8f9fa" }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-header text-center">
          <h1 className="card-title text-2xl font-bold">Register</h1>
          <p className="card-description">Create a new account</p>
        </div>
        <div className="card-content" style={{ display: "grid", gap: "1rem" }}>
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
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="button button-primary w-full" disabled={status === "loading"}>
              {status === "loading" ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="separator my-4"></div>
      
        </div>
        <div className="card-footer text-center" style={{ fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "underline", color: "#007bff" }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
