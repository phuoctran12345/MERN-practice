import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"                                                                                                                   //useSelector -> lấy trạng thái từ reduxStore  -> như là thông tin giỏ hàng từ cartSlice hoặc trạng thái đơn hàng từ orderSlice
import { createOrder } from "../../redux/slices/orderSlice"
import { clearCart } from "../../redux/slices/cartSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { updateProduct } from "../../redux/slices/productSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch()                                      // điều hướng 
  const navigate = useNavigate()                                      // gửi các action
  const cartItems = useSelector((state) => state.cart.items)          
  const currentUser = useSelector((state) => state.users.currentUser) // Assuming you have a currentUser in userSlice
  const products = useSelector((state) => state.products.products)

  const [paymentMethod, setPaymentMethod] = useState("card")

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  })

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' })

  // hàm xử lý các sự kiện như là các ô nhập liệu 
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [id]: value }))     // ví dụ như user nhập "123" -> setShippingAddress  -> trạng thái mặc định là """ sẽ được cập nhật là "123"
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 5.0 : 0 
  const total = subtotal + shipping



  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      setShowAlert({ show: true, message: 'You must agree to the terms and conditions.', variant: 'danger' })
      return
    }
    if (!currentUser) {
      setShowAlert({ show: true, message: 'Please log in to place an order.', variant: 'danger' })
      navigate("/login")
      return
    }

    // Kiểm tra tồn kho trước khi đặt hàng
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.id)
      if (!product || typeof product.stock !== 'number' || product.stock < item.quantity) {
        setShowAlert({ show: true, message: `Sản phẩm '${item.name}' không đủ hàng!`, variant: 'danger' })
        return
      }
    }

    const orderData = {
      userId: currentUser.id,
      orderDate: new Date().toISOString(),
      totalAmount: total,
      status: "completed", // Đặt trạng thái thành 'completed' ngay khi thanh toán
      shippingAddress,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    //=======================================================================
    try {
      await dispatch(createOrder(orderData)).unwrap()
      // Giảm stock sản phẩm dựa trên stock thực tế
      for (const item of cartItems) {
        const product = products.find(p => p.id === item.id)  // toán tử find để tìm kiếm 
        if (product && typeof product.stock === 'number') {
          const updatedProduct = { ...product, stock: product.stock - item.quantity }
          await dispatch(updateProduct({ id: item.id, product: updatedProduct }))
        }
      }
      dispatch(clearCart())
      setShowAlert({ show: true, message: 'Order placed successfully!', variant: 'completed' })  //  DÙNG ĐỂ GỌI MỘT CÁI ALERT 
      setTimeout(() => navigate("/orders"), 1200) 
    } catch (error) {
      setShowAlert({ show: true, message: `Failed to place order: ${error.message}`, variant: 'danger' })
    }
  }

  return (
    <div className="container py-8">
      {showAlert.show && (
        <Alert variant={showAlert.variant} onClose={() => setShowAlert({ ...showAlert, show: false })} dismissible style={{maxWidth:400,margin:"0 auto 16px auto",textAlign:"center"}}>
          {showAlert.message}
        </Alert>
      )}
      <h1 className="mb-8 text-3xl font-bold text-center">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-8">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Shipping Address</h2>
              <p className="card-description">Enter your shipping details.</p>
            </div>
            <div className="card-content" style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label htmlFor="fullName" className="label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="input"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="input"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="input"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="label">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    className="input"
                    value={shippingAddress.zip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="label">
                  Country
                </label>
                <select
                  id="country"
                  className="input"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a country</option>
                  <option value="vietnam">Vietnam</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="uk">United Kingdom</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Payment Method</h2>
              <p className="card-description">Choose your preferred payment method.</p>
            </div>
            <div className="card-content">
              <div className="radio-group" style={{ display: "grid", gap: "1rem" }}>
                <label className="radio-group-item">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="direct"
                    checked={paymentMethod === "direct"}
                    onChange={() => setPaymentMethod("direct")}
                  />
                  Tiền mặt (Thanh toán khi nhận hàng)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Order Summary</h2>
            </div>
            <div className="card-content" style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Shipping</span>
                <span>{shipping.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="separator my-2"></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <label className="checkbox mt-4">
                <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />I
                agree to the terms and conditions
              </label>
            </div>
            <div className="card-content">
              <button
                onClick={handlePlaceOrder}
                className="button button-primary w-full"
                disabled={!agreedToTerms || cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
