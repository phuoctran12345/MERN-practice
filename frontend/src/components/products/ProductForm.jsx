"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { createProduct, updateProduct, fetchProductById, clearSelectedProduct } from "../../redux/slices/productSlice"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';

const ProductForm = () => {
  const { id } = useParams()             //-> react hook -> lôi ra để lấy theo id vd: product/${id}
  const navigate = useNavigate()         // đìu hướng 
  const dispatch = useDispatch()         // gửi các action -> redux 
  const { selectedProduct, status, error } = useSelector((state) => state.products)             // get các gía trị của redux store  selectedProduct, status, error

  // usestate -> khởi tạo attribute cho Product
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stock: "",
  })


  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' }) 

  // checking đang ở true -> sửa or false -> add  
  const isEditMode = !!id

  useEffect(() => {
    if (isEditMode) {                  // true -> chỉnh sửa 
      dispatch(fetchProductById(id))               
    } else {
      dispatch(clearSelectedProduct()) // false -> thêm mới ; xử lý bên productSlice
    }
  }, [id, isEditMode, dispatch])


  useEffect(() => {
    if (isEditMode && selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",                      // toán tử || "" -> selectedProduct là undefined hoặc null, giá trị mặc định sẽ là chuỗi rỗng ("").
        description: selectedProduct.description || "",        // viết ở đây vì if else vì -> true -> chỉnh sửa sản phẩm  ; else if -> false -> add 
        price: selectedProduct.price || "",
        imageUrl: selectedProduct.imageUrl || "",
        category: selectedProduct.category || "",
        stock: selectedProduct.stock || "",
      })
    } else if (!isEditMode) {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        stock: "",
      })
    }
  }, [isEditMode, selectedProduct])

  // thêm hình ảnh  
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

  // Hàm support nghiệp vụ nhập liệu POST API
  const handleSubmit = async (e) => {
    e.preventDefault()
    const productData = {
      ...formData,                                           // overide lại các trường nhập liệu thêm zo price vs stock 
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock, 10),
    }

    if (isEditMode) {
      await dispatch(updateProduct({ id, product: productData }))                                        // điều hướng data 
      setShowAlert({ show: true, message: 'Cập nhật sản phẩm thành công!', variant: 'success' })            
    } else {
      await dispatch(createProduct(productData))                                                          
      setShowAlert({ show: true, message: 'Thêm sản phẩm thành công!', variant: 'success' })
    }
    setTimeout(() => navigate("/products"), 1200) 
  }

  if (isEditMode && status === "loading") {
    return <div className="container py-8 text-center">Loading product data...</div>
  }

  if (isEditMode && status === "failed") {
    return (
      <div className="container py-8 text-center" style={{ color: "red" }}>
        Error loading product: {error}
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Thông báo */}
      {showAlert.show && (
        <Alert variant={showAlert.variant} onClose={() => setShowAlert({ ...showAlert, show: false })} dismissible style={{marginBottom:16}}>
          {showAlert.message}
        </Alert>
      )}

      <button
        onClick={() => navigate("/admin")}
        style={{ marginBottom: 24, background: "#f1f1f1", border: "none", borderRadius: 6, padding: "0.5rem 1.25rem", cursor: "pointer", fontWeight: 500 }}
      >
        ← Quay lại Dashboard
      </button>
      
      <h1 className="mb-8 text-3xl font-bold text-center">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
      <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label htmlFor="name" className="label">
                Product Name
              </label>
              <input type="text" id="name" className="input" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                className="input"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              ></textarea>
            </div>
            <div>
              <label htmlFor="price" className="label">
                Price
              </label>
              <input
                type="number"
                id="price"
                className="input"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="label">
                Image URL
              </label>
              <input type="file" id="imageUrl" accept="image/*" className="input" onChange={handleChange} />
              {formData.imageUrl && (
                <div style={{ marginTop: 8 }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: "1px solid #eee" }} />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="category" className="label">
                Category
              </label>
              <input
                type="text"
                id="category"
                className="input"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="label">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                className="input"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="button button-primary w-full">
              {isEditMode ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductForm
