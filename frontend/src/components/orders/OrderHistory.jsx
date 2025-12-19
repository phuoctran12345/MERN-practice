"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchOrdersByUser } from "../../redux/slices/orderSlice"
import { Link } from "react-router-dom"

const OrderHistory = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.users.currentUser) // Assuming you have a currentUser in userSlice
  const { orders, status, error } = useSelector((state) => state.orders)

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchOrdersByUser(currentUser.id))
    }
  }, [currentUser, dispatch])

  if (!currentUser) {
    return <div className="container py-8 text-center">Please log in to view your order history.</div>
  }

  if (status === "loading") {
    return <div className="container py-8 text-center">Loading order history...</div>
  }

  if (status === "failed") {
    return (
      <div className="container py-8 text-center" style={{ color: "red" }}>
        Error: {error}
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Your Order History</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center">You have no past orders.</p>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Orders</h2>
          </div>
          <div className="card-content" style={{ padding: 0 }}>
            <table className="table">
              
              <thead className="table-header">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Details</th>
                </tr>
              </thead>

              
              <tbody className="table-body">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.totalAmount.toLocaleString('vi-VN')}₫</td>
                    <td>
                      <span
                        className={`badge ${order.status === "completed" ? "badge-default" : order.status === "processing" ? "badge-secondary" : "badge-destructive"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link to={`/orders/${order.id}`} style={{ color: "#007bff", textDecoration: "underline" }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>


            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderHistory
