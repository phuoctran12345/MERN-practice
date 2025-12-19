import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import ProductList from "./components/products/ProductList"
import ProductDetail from "./components/products/ProductDetail"
import ProductForm from "./components/products/ProductForm"
import CartPage from "./components/cart/CartPage"
import CheckoutPage from "./components/checkout/CheckoutPage"
import OrderHistory from "./components/orders/OrderHistory"
import OrderList from "./components/orders/OrderList" // Admin view
import LoginPage from "./components/login/LoginPage"
import RegisterPage from "./components/register/RegisterPage"
import AboutUs from "./components/AboutUs"
import Services from "./components/Services"
import NotFound from "./components/404"
import RequireAdmin from "./components/RequireAdmin"
import AdminDashboard from "./components/admin/AdminDashboard"
import OrderDetail from "./components/orders/OrderDetail"
import LandingPage from "./components/LandingPage" // Import LandingPage

import "./App.css"

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default route */}
          <Route path="/products" element={<ProductList />} /> {/* ProductList is now at /products */}
          <Route path="/products/:id" element={<ProductDetail />} />
          
          <Route path="/admin" element={
  <RequireAdmin><AdminDashboard /></RequireAdmin>
} />
          <Route path="/admin/products/new" element={
            <RequireAdmin><ProductForm /></RequireAdmin>
          } />

          <Route path="/admin/products/edit/:id" element={
            <RequireAdmin><ProductForm /></RequireAdmin>
          } />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />

          <Route path="/admin/orders" element={
            <RequireAdmin><OrderList /></RequireAdmin>
          } />

          <Route path="/admin/orders/:id" element={
            <RequireAdmin><OrderDetail /></RequireAdmin>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />


          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Layout>
    </div>
  )
}

export default App
