import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginAndRegister.css";
import { AuthContext } from '../context/AuthContext';
import img from '../assets/login.png';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [activeSlide, setActiveSlide] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://hr-server-backend.onrender.com/api/auth/login", formData);
      const { token } = response.data;
      const user = {
        _id: response?.data?._id,
        name: response?.data?.name,
        email: response?.data.email
      }      
      
    
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      login({ token, user });
      
      navigate("/candidates");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <div className="logo-square"></div>
        <span>LOGO</span>
      </div>

      <div className="login-card-wrapper">
        <div className="login-left">
          <div className="dashboard-preview">
            <img
              src={img}
              alt="Dashboard Preview"
              className="preview-image"
            />
          </div>
          <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</h3>
          <p>tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <div className="slide-dots">
            <span className={`dot ${activeSlide === 0 ? 'active' : ''}`} onClick={() => setActiveSlide(0)}></span>
            <span className={`dot ${activeSlide === 1 ? 'active' : ''}`} onClick={() => setActiveSlide(1)}></span>
            <span className={`dot ${activeSlide === 2 ? 'active' : ''}`} onClick={() => setActiveSlide(2)}></span>
          </div>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome to Dashboard</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password*</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁
                </button>
              </div>
            </div>

            <div className="login-links">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="form-actions">
              <button type="submit" className="login-button">Login</button>
            </div>

            <div className="register-prompt">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
