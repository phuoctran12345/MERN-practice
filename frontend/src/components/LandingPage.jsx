"use client"

import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { fetchProducts } from "../redux/slices/productSlice"
import { addToCart } from "../redux/slices/cartSlice"
import { ShoppingCart } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';

// Reusing ProductCard from products folder for consistency
const ProductCard = ({ product, onAddToCart }) => (
  <div
    className="card"
    style={{
      overflow: "hidden",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease-in-out",
    }}
  >
    
    <Link to={`/products/${product.id}`} style={{ position: "absolute", inset: 0, zIndex: 10 }} />
    <img
      src={product.imageUrl || "/placeholder.svg"}
      alt={product.name}
      style={{ height: "12rem", width: "100%", objectFit: "cover" }}
    />

    <div className="card-content" style={{ padding: "1rem" }}>
      <h3 style={{ fontSize: "1.125rem", fontWeight: "semibold" }}>{product.name}</h3>
      <p style={{ fontSize: "0.875rem", color: "#6c757d" }}>
        {(product.description ? product.description.substring(0, 70) : "Không có mô tả") + "..."}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
        </span>
        <button
          className="button button-primary button-sm"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart(product)
          }}
          style={{ zIndex: 20 }}
        >
          <ShoppingCart size={16} style={{ marginRight: "0.5rem" }} />
          Add to Cart
        </button>
      </div>
    </div>
  </div>
)

const LandingPage = () => {
  const dispatch = useDispatch()
  const { products, status, error } = useSelector((state) => state.products)
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' })

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
    setShowAlert({ show: true, message: `${product.name} đã được thêm vào giỏ hàng!`, variant: 'success' })
    setTimeout(() => setShowAlert({ ...showAlert, show: false }), 1200)
  }

  // Select a few featured products, e.g., the first 4
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="landing-page">

      {showAlert.show && (
        <Alert variant={showAlert.variant} onClose={() => setShowAlert({ ...showAlert, show: false })} dismissible style={{maxWidth:400,margin:"16px auto",textAlign:"center"}}>
          {showAlert.message}
        </Alert>
      )}
      
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: "#f0f8ff", // Light blue background
          padding: "4rem 1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem", color: "#333" }}>
          Khám Phá Thế Giới Sản Phẩm Độc Đáo
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#555", maxWidth: "700px", marginBottom: "2rem" }}>
          Chào mừng bạn đến với cửa hàng trực tuyến của chúng tôi, nơi bạn có thể tìm thấy mọi thứ mình cần với chất
          lượng tốt nhất và giá cả phải chăng.
        </p>
        <Link to="/products" className="button button-primary button-lg" style={{ textDecoration: "none" }}>
          Mua Sắm Ngay
        </Link>
      </section>


      {/* Optional: About Us / Services Snippet */}
      <section className="container py-8" style={{ backgroundColor: "#f8f8f8", textAlign: "center" }}>
        <h2 className="mb-4 text-2xl font-bold">Về Chúng Tôi & Dịch Vụ</h2>
        <p className="text-muted-foreground mb-6">
          Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời và các dịch vụ chất lượng cao.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Link to="/about" className="button button-outline">
            Tìm Hiểu Thêm Về Chúng Tôi
          </Link>
          <Link to="/services" className="button button-outline">
            Khám Phá Dịch Vụ Của Chúng Tôi
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
