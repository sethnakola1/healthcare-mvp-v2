import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';
interface LoginFormData {
email: string;
password: string;
}

interface Credentials {
  SUPER_ADMIN: {
    email: string;
    password: string;
  };
}

const LoginForm: React.FC = () => {
const [formData, setFormData] = useState<LoginFormData>({
email: '',
password: '',
});
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const { login, loading, error, clearError, isAuthenticated } = useAuth();
const navigate = useNavigate();
const location = useLocation();
// Redirect if already authenticated
useEffect(() => {
if (isAuthenticated) {
const from = (location.state as any)?.from?.pathname || '/dashboard';
navigate(from, { replace: true });
}
}, [isAuthenticated, navigate, location]);
// Clear error when component unmounts or form changes
useEffect(() => {
return () => clearError();
}, [clearError]);
useEffect(() => {
if (error) {
const timer = setTimeout(clearError, 5000); // Clear error after 5 seconds
return () => clearTimeout(timer);
}
}, [error, clearError]);
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFormData(prev => ({
...prev,
[name]: value,
}));
// Clear error when user starts typing
if (error) {
  clearError();
}
};
const handleSubmit = async (e: FormEvent) => {
e.preventDefault();
// Basic validation
if (!formData.email.trim() || !formData.password.trim()) {
  return;
}

try {
  await login(formData);
  // Navigation will be handled by the useEffect above
} catch (error) {
  // Error handling is managed by the AuthContext
  console.error('Login failed:', error);
}
};
const togglePasswordVisibility = () => {
setShowPassword(!showPassword);
};
return (
<div className="login-container">
<div className="login-card">
<div className="login-header">
<h1>HealthHorizon</h1>
<p>Healthcare Management System</p>
</div>
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Sign In</h2>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          Remember me
        </label>
        <a href="/forgot-password" className="forgot-password">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className={`login-button ${loading ? 'loading' : ''}`}
        disabled={loading || !formData.email.trim() || !formData.password.trim()}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="login-help">
        <p>Test Credentials:</p>
        <small>
          Email: sethnakola@healthhorizon.com<br />
          Password: SuperAdmin123!
        </small>
      </div>
    </form>
  </div>
</div>
);
};
export default LoginForm;