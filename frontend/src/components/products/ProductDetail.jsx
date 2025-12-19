"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchProductById } from "../../redux/slices/productSlice"
import { addToCart } from "../../redux/slices/cartSlice"
import { ShoppingCart } from "lucide-react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedProduct, status, error } = useSelector((state) => state.products)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [id, dispatch])

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ ...selectedProduct, quantity: 1 }))
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1500)
    }
  }

  if (status === "loading" || !selectedProduct) {
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
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible style={{maxWidth:400,margin:"0 auto 16px auto",textAlign:"center"}}>
          {selectedProduct.name} đã được thêm vào giỏ hàng!
        </Alert>
      )}
      <Row className="align-items-center" style={{gap: '2rem 0'}}>
        <Col md={6} className="text-center">
          <Card className="shadow-sm">
            <Card.Img variant="top" src={selectedProduct.imageUrl || "/placeholder.svg"} alt={selectedProduct.name} style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "0.5rem" }} />
          </Card>
        </Col>
        <Col md={6}>
          <h1 className="mb-3" style={{ fontWeight: 700 }}>{selectedProduct.name}</h1>
          <h3 style={{ color: "#007bff", fontWeight: 600 }}>{selectedProduct.price.toLocaleString('vi-VN')}₫</h3>
          <p className="mt-4 mb-4" style={{ color: "#6c757d" }}>{selectedProduct.description}</p>
          <div className="d-flex gap-3">
            <Button variant="primary" size="lg" onClick={handleAddToCart}>
              <ShoppingCart size={20} style={{ marginRight: "0.5rem" }} />
              Add to Cart
            </Button>

            <Button variant="outline-primary" size="lg" onClick={() => navigate('/checkout')}>Buy Now</Button>
            
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ProductDetail
