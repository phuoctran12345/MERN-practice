import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './DashboardLayout.css';
import { UserRole, MenuItem } from '../../types/common.types';

interface DashboardLayoutProps {
  userRole: UserRole;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const history = useHistory();
  const location = useLocation();

  // Menu items theo role
  const getMenuItems = (): MenuItem[] => {
    if (userRole === 'customer') {
      return [
        { id: 'home', label: 'Trang chủ', icon: '🏠', path: '/customer/home' },
        { id: 'search', label: 'Tìm kiếm phòng', icon: '🔍', path: '/customer/search' },
        { id: 'bookings', label: 'Đặt phòng của tôi', icon: '📅', path: '/customer/bookings' },
        { id: 'payment', label: 'Thanh toán', icon: '💳', path: '/customer/payment' },
        { id: 'services', label: 'Yêu cầu dịch vụ', icon: '🛎️', path: '/customer/services' },
        { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/customer/settings' },
      ];
    } else if (userRole === 'receptionist') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/receptionist/dashboard' },
        { id: 'checkin', label: 'Check-in', icon: '✅', path: '/receptionist/checkin' },
        { id: 'checkout', label: 'Check-out', icon: '🚪', path: '/receptionist/checkout' },
        { id: 'services', label: 'Dịch vụ khách hàng', icon: '🛎️', path: '/receptionist/services' },
        { id: 'reports', label: 'Báo cáo', icon: '📊', path: '/receptionist/reports' },
      ];
    } else if (userRole === 'manager') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/manager/dashboard' },
        { id: 'hotels', label: 'Quản lý Khách sạn', icon: '🏨', path: '/manager/hotels' },
        { id: 'rooms', label: 'Quản lý Phòng', icon: '🛏️', path: '/manager/rooms' },
        { id: 'pricing', label: 'Quản lý Giá & KM', icon: '💰', path: '/manager/pricing' },
        { id: 'staff', label: 'Quản lý Nhân viên', icon: '👥', path: '/manager/staff' },
        { id: 'reports', label: 'Báo cáo & Thống kê', icon: '📊', path: '/manager/reports' },
        { id: 'settings', label: 'Cài đặt', icon: '⚙️', path: '/manager/settings' },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();
  const currentPath = location.pathname;

  const handleMenuClick = (path: string): void => {
    history.push(path);
  };

  const handleLogout = (): void => {
    // TODO: Implement logout logic
    localStorage.removeItem('token');
    history.push('/login');
  };

  const getRoleLabel = (): string => {
    switch (userRole) {
      case 'customer':
        return 'Khách hàng';
      case 'receptionist':
        return 'Lễ tân';
      case 'manager':
        return 'Quản lý';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="logo" onClick={() => history.push(`/${userRole}/home`)}>
            <span className="logo-icon">🏨</span>
            <span className="logo-text">SmartHotel</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{getRoleLabel()}</span>
            <span className="user-avatar">👤</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path || 
                              (item.path !== `/${userRole}/home` && currentPath.startsWith(item.path));
              
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

