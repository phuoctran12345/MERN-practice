import {
  BrowserRouter as Router, // Bao bọc toàn bộ ứng dụng để sử dụng điều hướng
  Route,                   // Định nghĩa một tuyến đường đơn lẻ
  Routes,                  // Chứa danh sách các Route, giúp chọn ra Route khớp nhất
  Navigate,                // Dùng để chuyển hướng người dùng (Redirect)
} from "react-router-dom";
import Layout from "./layouts/Layout"; // Giao diện chung (thường có Header/Footer)
import AuthLayout from "./layouts/AuthLayout"; // Giao diện riêng cho các trang đăng nhập/đăng ký
import ScrollToTop from "./components/ScrollToTop"; // Tự động cuộn lên đầu trang khi chuyển trang
import { Toaster } from "./components/ui/toaster"; // Hiển thị các thông báo (toast) cho người dùng
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import useAppContext from "./hooks/useAppContext"; // Hook lấy trạng thái ứng dụng (ví dụ: đã đăng nhập chưa)
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";
import ApiDocs from "./pages/ApiDocs";
import ApiStatus from "./pages/ApiStatus";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerDashboardIndex from "./pages/dashboard/owner";
import ManagerDashboardIndex from "./pages/dashboard/manager";
import ReceptionistDashboardIndex from "./pages/dashboard/receptionist";
import CheckInPage from "./pages/dashboard/receptionist/CheckInPage";
import CheckOutPage from "./pages/dashboard/receptionist/CheckOutPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

const App = () => {
  // Lấy giá trị isLoggedIn từ Context để kiểm tra người dùng đã đăng nhập hay chưa
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      {/* Luôn cuộn lên đầu trang mỗi khi route thay đổi */}
      <ScrollToTop />

      <Routes>
        {/* --- CÁC ROUTE CÔNG KHAI (Ai cũng xem được) --- */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        {/* Route động với tham số hotelId */}
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />

        <Route
          path="/api-docs"
          element={
            <Layout>
              <ApiDocs />
            </Layout>
          }
        />

        <Route
          path="/api-status"
          element={
            <Layout>
              <ApiStatus />
            </Layout>
          }
        />

        {/* --- CÁC ROUTE XÁC THỰC (Đăng ký/Đăng nhập) --- */}
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />

        {/* --- PAYMENT ROUTES (Public - PayOS redirect) --- */}
        <Route
          path="/booking/success"
          element={
            <Layout>
              <PaymentSuccess />
            </Layout>
          }
        />
        <Route
          path="/booking/cancel"
          element={
            <Layout>
              <PaymentCancel />
            </Layout>
          }
        />

        {/* --- CÁC ROUTE BẢO VỆ (Chỉ dành cho người đã đăng nhập) --- */}
        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />
          </>
        )}

        {/* --- OWNER DASHBOARD ROUTES --- */}
        {/* Tất cả routes owner dashboard đều dùng chung component gốc OwnerDashboardIndex */}
        {/* Component này sẽ tự động điều hướng đến section tương ứng dựa trên URL */}
        <Route
          path="/dashboard/owner/*"
          element={
            <ProtectedRoute requireAuth allowedRoles={["hotel_owner"]}>
              <DashboardLayout>
                <OwnerDashboardIndex />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- MANAGER DASHBOARD ROUTES --- */}
        <Route
          path="/dashboard/manager/*"
          element={
            <ProtectedRoute requireAuth allowedRoles={["manager"]}>
              <DashboardLayout>
                <ManagerDashboardIndex />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- RECEPTIONIST DASHBOARD ROUTES --- */}
        <Route
          path="/dashboard/receptionist/check-in"
          element={
            <ProtectedRoute requireAuth allowedRoles={["receptionist"]}>
              <DashboardLayout>
                <CheckInPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/receptionist/check-out"
          element={
            <ProtectedRoute requireAuth allowedRoles={["receptionist"]}>
              <DashboardLayout>
                <CheckOutPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/receptionist/*"
          element={
            <ProtectedRoute requireAuth allowedRoles={["receptionist"]}>
              <DashboardLayout>
                <ReceptionistDashboardIndex />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* --- XỬ LÝ KHI KHÔNG TÌM THẤY TRANG --- 
            Nếu URL không khớp với bất kỳ route nào ở trên, chuyển hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Component hiển thị thông báo nổi trên cùng */}
      <Toaster />
    </Router>
  );
};

export default App;