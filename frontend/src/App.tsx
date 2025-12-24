import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';

// Customer Pages
import CustomerHome from './pages/customer/Home';
import SearchRooms from './pages/customer/SearchRooms';
import Booking from './pages/customer/Booking';
import MyBookings from './pages/customer/MyBookings';
import Payment from './pages/customer/Payment';
import ServiceRequest from './pages/customer/ServiceRequest';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/Dashboard';
import CheckIn from './pages/receptionist/CheckIn';
import CheckOut from './pages/receptionist/CheckOut';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManageRooms from './pages/manager/ManageRooms';

// Types
import { UserRole } from './types/common.types';

// Landing Page
import LandingPage from './pages/guest/LandingPage';

// Auth Pages (TODO: Tạo sau)
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';

const App: React.FC = () => {
  // TODO: Lấy user role từ context/store
  const userRole: UserRole = 'customer'; // 'customer' | 'receptionist' | 'manager'

  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={LandingPage} />
        {/* <Route path="/login" component={Login} /> */}
        {/* <Route path="/register" component={Register} /> */}



        {/* Customer Routes */}
        <Route path="/customer">
          <DashboardLayout userRole="customer">
            <Switch>
              <Route path="/customer/home" component={CustomerHome} />
              <Route path="/customer/search" component={SearchRooms} />
              <Route path="/customer/booking" component={Booking} />
              <Route path="/customer/bookings" component={MyBookings} />
              <Route path="/customer/payment" component={Payment} />
              <Route path="/customer/services" component={ServiceRequest} />
              <Redirect from="/customer" to="/customer/home" />
            </Switch>
          </DashboardLayout>
        </Route>

        {/* Receptionist Routes */}
        <Route path="/receptionist">
          <DashboardLayout userRole="receptionist">
            <Switch>
              <Route path="/receptionist/dashboard" component={ReceptionistDashboard} />
              <Route path="/receptionist/checkin" component={CheckIn} />
              <Route path="/receptionist/checkout" component={CheckOut} />
              <Redirect from="/receptionist" to="/receptionist/dashboard" />
            </Switch>
          </DashboardLayout>
        </Route>

        {/* Manager Routes */}
        <Route path="/manager">
          <DashboardLayout userRole="manager">
            <Switch>
              <Route path="/manager/dashboard" component={ManagerDashboard} />
              <Route path="/manager/rooms" component={ManageRooms} />
              <Redirect from="/manager" to="/manager/dashboard" />
            </Switch>
          </DashboardLayout>
        </Route>

        {/* Default redirect - Nếu không match route nào, redirect về landing page */}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;

