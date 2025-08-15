import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { SecurityUtils } from '../../utils/security.utils';
import { LoginCredentials } from '../../types/auth.types';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  // Watch form values for real-time validation
  const formData = watch();

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Check if user is rate limited
    const checkRateLimit = () => {
      const canAttempt = SecurityUtils.checkRateLimit('login_check', 5, 15 * 60 * 1000);
      setIsBlocked(!canAttempt);
    };
    
    checkRateLimit();
  }, [attempts]);

  // Real-time validation feedback
  useEffect(() => {
    if (formData.email && !SecurityUtils.validateEmail(formData.email)) {
      setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      });
    }
  }, [formData.email, setError]);

  const onSubmit = async (data: LoginFormData) => {
    if (isBlocked) {
      setError('root', {
        type: 'manual',
        message: 'Too many login attempts. Please try again later.',
      });
      return;
    }

    // Client-side validation
    if (!SecurityUtils.validateEmail(data.email)) {
      setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      });
      return;
    }

    const passwordValidation = SecurityUtils.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setError('password', {
        type: 'manual',
        message: passwordValidation.errors[0],
      });
      return;
    }

    try {
      const credentials: LoginCredentials = {
        email: SecurityUtils.sanitizeInput(data.email.toLowerCase().trim()),
        password: data.password,
      };

      await dispatch(loginUser(credentials)).unwrap();
      // Redirect will be handled by the auth effect
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      setError('root', {
        type: 'manual',
        message: error || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome to HealthHorizon
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {(error || errors.root) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">
                      {error || errors.root?.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isBlocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Account temporarily locked due to multiple failed attempts.
                      Please try again in 15 minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                    maxLength: {
                      value: 255,
                      message: 'Email is too long',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  disabled={isLoading || isBlocked}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  disabled={isLoading || isBlocked}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || isLoading || isBlocked}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  (!isValid || isLoading || isBlocked)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                } transition-colors duration-200`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Secure login protected by advanced security measures
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;