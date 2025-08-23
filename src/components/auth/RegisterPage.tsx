import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import './Auth.css';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
}

interface RoleOption {
  value: string;
  label: string;
  description: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    territory: '',
    role: 'TECH_ADVISOR',
  });

  const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const { register, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load available roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await authService.getAvailableRoles();
        if (response.success) {
          setAvailableRoles(response.data);
        }
      } catch (err) {
        console.error('Failed to load roles:', err);
        // Set default roles if API fails
        setAvailableRoles([
          { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Full system access' },
          { value: 'TECH_ADVISOR', label: 'Tech Advisor', description: 'Technical advisor role' },
        ]);
      }
    };

    loadRoles();
  }, []);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear general error
    if (error) {
      clearError();
    }

    // Check availability for email and username
    if (name === 'email' && value.includes('@')) {
      checkEmailAvailability(value);
    }
    if (name === 'username' && value.length >= 3) {
      checkUsernameAvailability(value);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    try {
      const response = await authService.checkAvailability(email);
      if (response.success) {
        setEmailAvailable(response.data.emailAvailable);
      }
    } catch (err) {
      console.error('Email availability check failed:', err);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await authService.checkAvailability(undefined, username);
      if (response.success) {
        setUsernameAvailable(response.data.usernameAvailable);
      }
    } catch (err) {
      console.error('Username availability check failed:', err);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
    if (!formData.confirmPassword.trim()) errors.confirmPassword = 'Confirm password is required';
    if (!formData.territory.trim()) errors.territory = 'Territory is required';

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Username validation
    if (formData.username && formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Availability validation
    if (emailAvailable === false) {
      errors.email = 'This email is already taken';
    }
    if (usernameAvailable === false) {
      errors.username = 'This username is already taken';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      // Navigation will happen automatically via useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Registration failed:', err);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = validateForm() && emailAvailable !== false && usernameAvailable !== false;

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>HealthHorizon</h1>
          <h2>Create Account</h2>
          <p>Join our healthcare management platform</p>
        </div>

        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button
              onClick={clearError}
              className="error-close"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
                required
                disabled={loading || isLoading}
              />
              {validationErrors.firstName && (
                <span className="field-error">{validationErrors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
                required
                disabled={loading || isLoading}
              />
              {validationErrors.lastName && (
                <span className="field-error">{validationErrors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`form-input ${validationErrors.email ? 'error' : ''} ${
                emailAvailable === false ? 'error' : emailAvailable === true ? 'success' : ''
              }`}
              required
              autoComplete="email"
              disabled={loading || isLoading}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
            {emailAvailable === true && (
              <span className="field-success">✓ Email is available</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className={`form-input ${validationErrors.username ? 'error' : ''} ${
                usernameAvailable === false ? 'error' : usernameAvailable === true ? 'success' : ''
              }`}
              required
              autoComplete="username"
              disabled={loading || isLoading}
            />
            {validationErrors.username && (
              <span className="field-error">{validationErrors.username}</span>
            )}
            {usernameAvailable === true && (
              <span className="field-success">✓ Username is available</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  required
                  autoComplete="new-password"
                  disabled={loading || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={loading || isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              {validationErrors.password && (
                <span className="field-error">{validationErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                  required
                  autoComplete="new-password"
                  disabled={loading || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                  disabled={loading || isLoading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="field-error">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="form-input"
                disabled={loading || isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="territory">Territory *</label>
              <input
                id="territory"
                name="territory"
                type="text"
                value={formData.territory}
                onChange={handleInputChange}
                placeholder="Enter territory (e.g., North India)"
                className={`form-input ${validationErrors.territory ? 'error' : ''}`}
                required
                disabled={loading || isLoading}
              />
              {validationErrors.territory && (
                <span className="field-error">{validationErrors.territory}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-input"
              required
              disabled={loading || isLoading}
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`auth-button ${(loading || isLoading || !isFormValid) ? 'disabled' : ''}`}
            disabled={loading || isLoading || !isFormValid}
          >
            {loading || isLoading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="password-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;