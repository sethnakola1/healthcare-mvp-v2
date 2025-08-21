// src/components/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth, LoginCredentials } from '../contexts/AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<LoginCredentials>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name as keyof LoginCredentials]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<LoginCredentials> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the AuthContext
      console.error('Login failed:', error);
    }
  };

  // Handle demo login for different roles
  const handleDemoLogin = async (role: string) => {
    const demoCredentials: Record<string, LoginCredentials> = {
      superadmin: {
        email: 'sethna.kola@healthcareplatform.com',
        password: 'SuperAdmin123!',
      },
      admin: {
        email: 'admin@hospital.com',
        password: 'Admin123!',
      },
      doctor: {
        email: 'doctor@hospital.com',
        password: 'Doctor123!',
      },
      patient: {
        email: 'patient@hospital.com',
        password: 'Patient123!',
      },
    };

    const credentials = demoCredentials[role];
    if (credentials) {
      setFormData(credentials);
      try {
        await login(credentials);
      } catch (error) {
        console.error('Demo login failed:', error);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Healthcare MVP</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Global Error Message */}
          {error && (
            <div className="error-message global-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Login Section */}
        <div className="demo-section">
          <div className="demo-header">
            <span>Demo Accounts</span>
          </div>
          <div className="demo-buttons">
            <button
              onClick={() => handleDemoLogin('superadmin')}
              className="demo-button super-admin"
              disabled={isLoading}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="demo-button admin"
              disabled={isLoading}
            >
              Hospital Admin
            </button>
            <button
              onClick={() => handleDemoLogin('doctor')}
              className="demo-button doctor"
              disabled={isLoading}
            >
              Doctor
            </button>
            <button
              onClick={() => handleDemoLogin('patient')}
              className="demo-button patient"
              disabled={isLoading}
            >
              Patient
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Healthcare Management System v1.0</p>
          <p>© 2025 Sethna Kola. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};