"use client"
import { useSelector, useDispatch } from "react-redux"
import { updateQuantity, removeFromCart } from "../../redux/slices/cartSlice"
import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"

const CartItem = ({ item, onQuantityChange, onRemove }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderBottom: "1px solid #eee",
      padding: "1rem 0",
      lastChild: { borderBottom: "none" },
    }}
  >
    <img
      src={item.imageUrl || "/placeholder.svg"}
      alt={item.name}
      style={{ width: "80px", height: "80px", borderRadius: "0.375rem", objectFit: "cover" }}
    />
    <div style={{ flex: 1, display: "grid", gap: "0.25rem" }}>
      <h3 style={{ fontWeight: "semibold" }}>{item.name}</h3>
      <p style={{ color: "#6c757d" }}>{item.price.toLocaleString('vi-VN')}₫</p>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <button
        className="button button-outline"
        style={{ width: "2rem", height: "2rem", padding: 0 }}
        onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => onQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
        style={{ width: "4rem", textAlign: "center" }}
        min="1"
        className="input"
        aria-label={`Quantity for ${item.name}`}
      />
      <button
        className="button button-outline"
        style={{ width: "2rem", height: "2rem", padding: 0 }}
        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
    <button
      className="button button-ghost"
      style={{ width: "2rem", height: "2rem", padding: 0 }}
      onClick={() => onRemove(item.id)}
      aria-label="Remove item"
    >
      <Trash2 size={20} style={{ color: "#dc3545" }} />
    </button>
  </div>
)

const CartPage = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cartItems.length > 0 ? 5.0 : 0 // Example shipping cost
  const total = subtotal + shipping

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Your cart is empty.{" "}
              <Link to="/products" style={{ textDecoration: "underline", color: "#007bff" }}>
                Start shopping!
              </Link>
            </p>
          ) : (
            <div className="card">
              <div className="card-content" style={{ padding: 0 }}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          )}
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
              
            </div>
            <div className="card-footer">
              <Link
                to="/checkout"
                className="button button-primary "
                style={{ textDecoration: "none", display: "block", textAlign: "center" }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
