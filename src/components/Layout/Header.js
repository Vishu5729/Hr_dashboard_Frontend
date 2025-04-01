import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaEnvelope, FaBell, FaChevronDown, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../App.css';

const Header = ({ title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true); // just a toggle
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setDropdownOpen(false);
    switch (option) {
      case 'edit':
        navigate('/profile');
        break;
      case 'password':
        navigate('/change-password'); // You'll create this page
        break;
      case 'notification':
        setNotificationsOn(!notificationsOn); // frontend toggle only
        break;
      default:
        break;
    }
  };

  return (
    <div className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions" ref={dropdownRef}>
        <FaEnvelope className="header-icon" />
        <FaBell className="header-icon" />
        <div className="header-avatar-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {user?.profileImage?.url ? (
            <img 
              src={user.profileImage.url} 
              alt="Profile" 
              className="header-avatar" 
            />
          ) : (
            <div className="header-avatar header-avatar-placeholder">
              <FaUser />
            </div>
          )}
          <FaChevronDown className="header-icon" />
        </div>

        {dropdownOpen && (
          <div className="profile-dropdown">
            <div onClick={() => handleOptionClick('edit')}>Edit Profile</div>
            <div onClick={() => handleOptionClick('password')}>Change Password</div>
            <div onClick={() => handleOptionClick('notification')}>
              Manage Notification {notificationsOn ? '✅' : '❌'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
