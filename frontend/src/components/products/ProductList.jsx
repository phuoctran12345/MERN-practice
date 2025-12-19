"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from "../../redux/slices/productSlice"
import { addToCart } from "../../redux/slices/cartSlice"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-4 shadow-sm h-100">
      <Card.Img variant="top" src={product.imageUrl || "/placeholder.svg"} alt={product.name} style={{ height: "12rem", objectFit: "cover" }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text style={{ color: "#6c757d" }}>
          {product.description ? product.description.substring(0, 70) + "..." : "Không có mô tả"}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{product.price.toLocaleString('vi-VN')}₫</span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <ShoppingCart size={16} style={{ marginRight: "0.5rem" }} />
            Xem sản phẩm
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

const ProductList = () => {
  const dispatch = useDispatch()
  const { products, status, error } = useSelector((state) => state.products)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts())
    }
  }, [status, dispatch])

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 1200)
  }

  if (status === "loading") {
    return <div className="container py-8 text-center"><Spinner animation="border" variant="primary" /></div>
  }

  if (status === "failed") {
    return (
      <div className="container py-8 text-center">
        <Alert variant="danger">Error: {error}</Alert>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Our Products</h1>
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible style={{maxWidth:400,margin:"0 auto 16px auto",textAlign:"center"}}>
          Đã thêm vào giỏ hàng!
        </Alert>
      )}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default ProductList
