"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice"
import { Link } from "react-router-dom"

const OrderList = () => {
  const dispatch = useDispatch()
  const { orders, status, error } = useSelector((state) => state.orders)
  const currentUser = useSelector((state) => state.users.currentUser)

  useEffect(() => {
    if (currentUser?.role === "admin" || currentUser?.role === "manager") {
      dispatch(fetchAllOrders())
    }
  }, [currentUser, dispatch])

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Are you sure you want to change status of order ${orderId} to ${newStatus}?`)) {
      dispatch(updateOrderStatus({ id: orderId, status: newStatus }))
    }
  }

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "manager")) {
    return (
      <div className="container py-8 text-center" style={{ color: "red" }}>
        Access Denied. You must be an Admin or Manager to view this page.
      </div>
    )
  }

  if (status === "loading") {
    return <div className="container py-8 text-center">Loading all orders...</div>
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
      <h1 className="mb-8 text-3xl font-bold text-center">All Orders (Admin View)</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center">No orders found.</p>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Orders</h2>
          </div>
          <div className="card-content" style={{ padding: 0 }}>
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.totalAmount.toLocaleString('vi-VN')}₫</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="input"
                        style={{ width: "auto" }}
                      >
                        {/* <option value="pending">Pending</option>
                        <option value="processing">Processing</option> */}
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    {/*truyền detail /orders/${order.id} */}
                    <td>
                      <Link
                        to={`/orders/${order.id}`}
                        style={{ color: "#007bff", textDecoration: "underline", marginRight: "0.5rem" }}
                      >
                        View Details
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

export default OrderList
