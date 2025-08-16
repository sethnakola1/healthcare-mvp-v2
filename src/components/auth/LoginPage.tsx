// src/pages/LoginPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { BusinessRole } from '../../types/auth.types';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const { authState, login, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Security: Rate limiting state
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);

  // Get redirect path from location state or default based on role
  const getRedirectPath = useCallback((role: string): string => {
    const from = location.state?.from?.pathname || '/dashboard';

    // Default redirects based on role
    const roleRedirects: Record<string, string> = {
      [BusinessRole.SUPER_ADMIN]: '/admin/dashboard',
      [BusinessRole.TECH_ADVISOR]: '/advisor/dashboard',
      [BusinessRole.HOSPITAL_ADMIN]: '/hospital/dashboard',
      [BusinessRole.DOCTOR]: '/doctor/dashboard',
      [BusinessRole.NURSE]: '/nurse/dashboard',
      [BusinessRole.RECEPTIONIST]: '/reception/dashboard',
      [BusinessRole.PATIENT]: '/patient/dashboard',
    };

    return roleRedirects[role] || from;
  }, [location.state]);

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      const redirectPath = getRedirectPath(authState.user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [authState.isAuthenticated, authState.user, navigate, getRedirectPath]);

  // Clear errors when component unmounts or form changes
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Input validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Rate limiting check
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const RATE_LIMIT_WINDOW = 60000; // 1 minute
    const MAX_ATTEMPTS = 5;

    if (lastAttemptTime && (now - lastAttemptTime) < RATE_LIMIT_WINDOW) {
      if (attemptCount >= MAX_ATTEMPTS) {
        setErrors({ general: 'Too many login attempts. Please wait a minute before trying again.' });
        return false;
      }
    } else {
      // Reset count if outside rate limit window
      setAttemptCount(0);
    }

    return true;
  }, [attemptCount, lastAttemptTime]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Security: Sanitize input
    const sanitizedValue = value.trim();

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear field-specific errors
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    // Clear previous errors
    setErrors({});
    clearError();

    // Validate form
    if (!validateForm()) return;

    // Check rate limiting
    if (!checkRateLimit()) return;

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);

      // Success handling is done in useEffect above

    } catch (error) {
      // Update rate limiting counters
      setAttemptCount(prev => prev + 1);
      setLastAttemptTime(Date.now());

      // Handle different types of errors
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';

      if (errorMessage.includes('credentials')) {
        setErrors({ general: 'Invalid email or password' });
      } else if (errorMessage.includes('locked')) {
        setErrors({ general: errorMessage });
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle "Remember Me" functionality (using secure session extension)
  const handleRememberMe = useCallback((checked: boolean) => {
    // Note: We don't use localStorage for sensitive data
    // Instead, this could trigger a longer session request to the backend
    console.log('Remember me:', checked);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-auto flex justify-center">
          {/* Add your logo here */}
          <div className="text-2xl font-bold text-blue-600">HealthCare MVP</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure access to your healthcare management system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* General Error Message */}
            {(errors.general || authState.error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {errors.general || authState.error}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  onChange={(e) => handleRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Keep me signed in
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || authState.isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting || authState.isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting || authState.isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Registration Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to HealthCare MVP?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/register"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Create your account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-xs text-gray-500">
          <p>This is a secure connection. Your data is protected with industry-standard encryption.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;