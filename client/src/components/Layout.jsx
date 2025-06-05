import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Applications', href: '/application-list', icon: DocumentTextIcon },
    // make these admin only later
    { name: 'Candidate Management', href: '/candidate-management', icon: ChartBarIcon },  
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="layout-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-left">
              {/* Mobile menu button */}
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                ) : (
                  <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} />
                )}
              </button>
              
              {/* Logo and title */}
              <div className="logo-section">
                <div>
                  <h1 className="logo-title">UConsulting</h1>
                </div>
                <div className="logo-subtitle">
                  <p>Application Tracking System</p>
                </div>
              </div>
            </div>

            {/* Right side - User info and logout */}
            <div className="nav-right">
              <div className="user-info">
                <p className="user-name">{user?.fullName}</p>
                <p className="user-role">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                <ArrowRightOnRectangleIcon className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <h2 className="sidebar-title">Navigation</h2>
            </div>
            
            <nav className="sidebar-nav">
              {navigation.map((item) => {
                const Icon = item.icon;
                const current = isCurrentPath(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item ${current ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="nav-icon" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="content-area">
          <main className="main-content">
            <div className="content-container">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 