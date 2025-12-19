import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../service/api"

const badgeColor = (status) => {
  switch (status) {
    case "completed": return { background: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" }
    case "processing": return { background: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" }
    case "pending": return { background: "#d1ecf1", color: "#0c5460", border: "1px solid #bee5eb" }
    case "cancelled": return { background: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" }
    default: return { background: "#e2e3e5", color: "#383d41", border: "1px solid #d6d8db" }
  }
}

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data)
      } catch (err) {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!order) return <div>Order not found.</div>

  const address = order.shippingAddress || {}

  return (
    <div className="container py-8" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="card">
        <div className="card-header" style={{ borderBottom: "1px solid #eee" }}>
          <h2 className="card-title" style={{ fontSize: "2rem", fontWeight: 700 }}>Chi tiết đơn hàng: {order.id}</h2>
        </div>
        <div className="card-content" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p><b>Khách hàng:</b> {order.userId}</p>
              <p><b>Ngày đặt:</b> {new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div>
              <p><b>Trạng thái:</b> <span style={{ padding: "0.25em 0.75em", borderRadius: 8, fontWeight: 600, ...badgeColor(order.status) }}>{order.status}</span></p>
              <p><b>Tổng tiền:</b> <span style={{ color: "#d90429", fontWeight: 700, fontSize: "1.25rem" }}>{order.totalAmount.toLocaleString('vi-VN')}₫</span></p>
            </div>
          </div>

          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Sản phẩm:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Tên sản phẩm</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Số lượng</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Đơn giá</th>
                <th style={{ padding: 8, border: "1px solid #eee" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 8, border: "1px solid #eee" }}>{item.name}</td>
                  <td style={{ padding: 8, border: "1px solid #eee", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>{item.price.toLocaleString('vi-VN')}₫</td>
                  <td style={{ padding: 8, border: "1px solid #eee", textAlign: "right" }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Địa chỉ giao hàng:</h3>
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 16, border: "1px solid #eee" }}>
            <div><b>Họ tên:</b> {address.fullName}</div>
            <div><b>Địa chỉ:</b> {address.address}</div>
            <div><b>Thành phố:</b> {address.city}</div>
            <div><b>Mã bưu điện:</b> {address.zip}</div>
            <div><b>Quốc gia:</b> {address.country}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail 