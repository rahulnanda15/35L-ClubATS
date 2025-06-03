import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();

  const linkStyle = {
    display: 'block',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  };

  const sectionStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div style={containerStyle}>
      <h1>🏠 Development Home Page</h1>
      
      {user ? (
        <div style={sectionStyle}>
          <h2>👋 Welcome back, {user.fullName}!</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Graduation Class:</strong> {user.graduationClass}</p>
          
          <button style={buttonStyle} onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div style={sectionStyle}>
          <h2>🔒 Not logged in</h2>
          <p>Login to access protected routes</p>
        </div>
      )}

      {!user && (
        <div style={sectionStyle}>
          <h3>🌐 Public Routes</h3>
          <Link to="/" style={linkStyle}>
            🏠 Landing Page (/)
          </Link>
          <Link to="/login" style={linkStyle}>
            🔑 Login (/login)
          </Link>
          <Link to="/signup" style={linkStyle}>
            📝 Sign Up (/signup)
          </Link>
        </div>
      )}

      {user && (
        <div style={sectionStyle}>
          <h3>🔒 Protected Routes</h3>
          
          <Link to="/application-list" style={linkStyle}>
            📋 Application List (/application-list)
          </Link>
          
          <Link to="/dashboard" style={linkStyle}>
            📊 User Dashboard (/dashboard)
          </Link>
          
          <Link to="/application-cycles" style={linkStyle}>
            🔄 Application Cycles (/application-cycles)
          </Link>

          
            <Link to="/admin" style={linkStyle}>
                👑 Admin Dashboard (/admin)
            </Link>
          
          
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <strong>💡 Dynamic Routes:</strong>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              📄 Application Detail: /application/[id]<br />
              <em>Click on any applicant from the Application List to test this route</em>
            </div>
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <h3>🛠️ Development Info</h3>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <p><strong>Current URL:</strong> {window.location.pathname}</p>
          <p><strong>User Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}</p>
          <p><strong>User Role:</strong> {user?.role || 'N/A'}</p>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3>🧪 Quick Test Actions</h3>
        <div style={{ fontSize: '14px' }}>
          <p>✅ Test authentication flow: Logout → Login → Check protected routes</p>
          <p>✅ Test file access: Go to Application List → View an application → Try documents/images</p>
          <p>✅ Test role-based access: Try /admin route with different user roles</p>
          <p>✅ Test redirects: Try visiting /login while logged in</p>
        </div>
      </div>
    </div>
  );
} 