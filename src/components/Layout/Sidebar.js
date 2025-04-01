import React, { useContext } from 'react';
import { FaUserPlus, FaUsers, FaChartBar, FaPlaneDeparture, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import '../../App.css';

const Sidebar = ({ setPageTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Helper to check active route
  const isActive = (path) => location.pathname === path;

  const handleNav = (path, title) => {
    setPageTitle(title);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout(); // This will clear the local storage and context
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout on frontend even if server request fails
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">LOGO</div>

      <div className="sidebar-search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="sidebar-section">
        <p className="section-title">Recruitment</p>
        <div
          className={`sidebar-link ${isActive('/candidates') ? 'active' : ''}`}
          onClick={() => handleNav('/candidates', 'Candidates')}
        >
          <FaUserPlus /> <span>Candidates</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Organization</p>
        <div
          className={`sidebar-link ${isActive('/employees') ? 'active' : ''}`}
          onClick={() => handleNav('/employees', 'Employees')}
        >
          <FaUsers /> <span>Employees</span>
        </div>
        <div
          className={`sidebar-link ${isActive('/attendance') ? 'active' : ''}`}
          onClick={() => handleNav('/attendance', 'Attendance')}
        >
          <FaChartBar /> <span>Attendance</span>
        </div>
        <div
          className={`sidebar-link ${isActive('/leaves') ? 'active' : ''}`}
          onClick={() => handleNav('/leaves', 'Leaves')}
        >
          <FaPlaneDeparture /> <span>Leaves</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Others</p>
        <div
          className="sidebar-link"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
