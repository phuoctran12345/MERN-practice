"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllUsers } from "../../redux/slices/userSlice"
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../redux/slices/productSlice"
import { fetchAllOrders } from "../../redux/slices/orderSlice"
import DashboardCard from "./DashboardCard"
import RecentOrdersTable from "./RecentOrdersTable"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.users.currentUser)

  const { users, status: usersStatus, error: usersError } = useSelector((state) => state.users)
  const { products, status: productsStatus, error: productsError } = useSelector((state) => state.products)
  const { orders, status: ordersStatus, error: ordersError } = useSelector((state) => state.orders)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stock: "",
  })

  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' })
  const [showConfirm, setShowConfirm] = useState({ show: false, productId: null })

  useEffect(() => {
    if (currentUser?.role === "admin" ) {
      dispatch(fetchAllUsers())
      dispatch(fetchProducts())
      dispatch(fetchAllOrders())
    }
  }, [currentUser, dispatch])

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "manager")) {
    return (
      <div className="container py-8 text-center" style={{ color: "red" }}>
         You are not a Manager 
      </div>
    )
  }

  const isLoading = usersStatus === "loading" || productsStatus === "loading" || ordersStatus === "loading"
  const hasError = usersError || productsError || ordersError

  if (isLoading) {
    return <div className="container py-8 text-center">Loading dashboard data...</div>
  }

  if (hasError) {
    return (
      <div className="container py-8 text-center" style={{ color: "red" }}>
        Error loading dashboard: {hasError}
      </div>
    )
  }

  // Calculate statistics
  const totalUsers = users.length
  const totalProducts = products.length
  const totalOrders = orders.length
  // Tính tổng doanh thu từ các đơn hàng đã hoàn thành
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)

  // Get recent orders (e.g., last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5)

  // Xử lý mở form thêm/sửa
  const handleOpenForm = (product = null) => {
    if (product) {
      setEditProduct(product)
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        imageUrl: product.imageUrl || "",
        category: product.category || "",
        stock: product.stock || "",
      })
    } else {
      setEditProduct(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        stock: "",
      })
    }
    setShowProductForm(true)
  }
  // Xử lý đóng form
  const handleCloseForm = () => {
    setShowProductForm(false)
    setEditProduct(null)
  }
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { id, value, type, files } = e.target
    if (id === "imageUrl" && type === "file" && files && files[0]) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setFormData((prev) => ({ ...prev, imageUrl: ev.target.result }))
      }
      reader.readAsDataURL(files[0])
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    const productData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock, 10),
    }
    if (editProduct) {
      await dispatch(updateProduct({ id: editProduct.id, product: productData }))
      setShowAlert({ show: true, message: 'Cập nhật sản phẩm thành công!', variant: 'success' })
    } else {
      await dispatch(createProduct(productData))
      setShowAlert({ show: true, message: 'Thêm sản phẩm thành công!', variant: 'success' })
    }
    handleCloseForm()
  }
  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    setShowConfirm({ show: true, productId: id })
  }
  const confirmDelete = async () => {
    await dispatch(deleteProduct(showConfirm.productId))
    setShowAlert({ show: true, message: 'Đã xóa sản phẩm!', variant: 'danger' })
    setShowConfirm({ show: false, productId: null })
  }
  const cancelDelete = () => {
    setShowConfirm({ show: false, productId: null })
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Users" value={totalUsers} icon={Users} />
        <DashboardCard title="Total Products" value={totalProducts} icon={Package} />
        <DashboardCard title="Total Orders" value={totalOrders} icon={ShoppingCart} />
        <DashboardCard title="Total Revenue" value={`${totalRevenue.toLocaleString('vi-VN')}₫`} icon={DollarSign} />
      </div>

      {/* Thông báo */}
      {showAlert.show && (
        <Alert variant={showAlert.variant} onClose={() => setShowAlert({ ...showAlert, show: false })} dismissible style={{marginBottom:16}}>
          {showAlert.message}
        </Alert>
      )}
      {/* Bảng CRUD sản phẩm */}
      <div className="card mb-8">
        <div className="card-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 className="card-title">Quản lý sản phẩm</h2>
          <Button variant="primary" onClick={() => handleOpenForm()}>Thêm sản phẩm</Button>
        </div>
        <div className="card-content" style={{overflowX:'auto'}}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Loại</th>
                <th>Tồn kho</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description?.substring(0, 40)}...</td>
                  <td>{product.price?.toLocaleString('vi-VN')}₫</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.imageUrl && <img src={product.imageUrl} alt="img" style={{width:40,height:40,objectFit:'cover',borderRadius:4}} />}</td>
                  <td>
                    <Button variant="outline-secondary" size="sm" onClick={() => handleOpenForm(product)} style={{marginRight:8}}>Sửa</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>Xóa</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
      </div>

      {/* Popup form thêm/sửa sản phẩm */}
      <Modal show={showProductForm} onHide={handleCloseForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control type="text" id="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" id="description" value={formData.description} onChange={handleChange} required rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control type="number" id="price" value={formData.price} onChange={handleChange} required step="0.01" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control type="file" id="imageUrl" accept="image/*" onChange={handleChange} />
              {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{maxWidth:120,maxHeight:120,borderRadius:8,border:'1px solid #eee',marginTop:8}} />}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Control type="text" id="category" value={formData.category} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tồn kho</Form.Label>
              <Form.Control type="number" id="stock" value={formData.stock} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseForm}>Hủy</Button>
            <Button variant="primary" type="submit">{editProduct ? 'Cập nhật' : 'Thêm mới'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>


      {/* Modal xác nhận xóa sản phẩm */}
      <Modal show={showConfirm.show} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa sản phẩm này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>Hủy</Button>
          <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="card-content" style={{ display: "grid", gap: "0.5rem" , marginBottom : "14px" }}>
              <Link to="/admin/products/new" className="button button-primary ">
                Add New Product
              </Link>
              {/* <Link to="/admin/users" className="button button-outline ">
                Manage Users
              </Link> */}
              <Link to="/admin/orders" className="button button-outline ">
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
