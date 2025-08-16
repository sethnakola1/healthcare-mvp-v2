// import React, { useState, useEffect } from 'react';
// import { SecurityUtils } from '../../utils/security';
// import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAsync, clearError } from '../../store/slices/authSlice';

import { z } from 'zod';
import { SecurityUtils } from '../../utils/security.utils';

// Login validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must not exceed 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      onSuccess?.();
    }
  }, [isAuthenticated, navigate, location.state, onSuccess]);

  useEffect(() => {
    if (error) {
      setAttemptCount((prev: number) => prev + 1);

      if (attemptCount >= 3) {
        setTimeout(() => {
          setAttemptCount(0);
          dispatch(clearError());
        }, 30000);
      }
    }
  }, [error, attemptCount, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearErrors();
      dispatch(clearError());

      // Additional client-side validation
      if (!SecurityUtils.isValidEmail(data.email)) {
        setError('email', { message: 'Please enter a valid email address' });
        return;
      }

      const passwordValidation = SecurityUtils.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        setError('password', { message: 'Password does not meet security requirements' });
        return;
      }

      await dispatch(loginAsync({
        email: data.email.toLowerCase().trim(),
        password: data.password
      })).unwrap();

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.includes('invalid credentials')) {
        setError('root', { message: 'Invalid email or password' });
      } else if (error.includes('account locked')) {
        setError('root', { message: 'Account is temporarily locked. Please try again later.' });
      } else {
        setError('root', { message: 'An error occurred during login. Please try again.' });
      }
    }
  };

  const isFormLocked = attemptCount >= 3;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Healthcare MVP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Secure access to your healthcare management system
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                disabled={isFormLocked || isSubmitting}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isFormLocked || isSubmitting}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100`}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormLocked || isSubmitting}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {(error || errors.root) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.root?.message || error}
                  </h3>
                  {attemptCount >= 2 && (
                    <p className="mt-2 text-sm text-red-700">
                      {3 - attemptCount} attempts remaining before temporary lockout
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isFormLocked && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Too many failed attempts. Please wait 30 seconds before trying again.
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isFormLocked || isSubmitting || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
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
              This is a secure login. Your data is protected with industry-standard encryption.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

function useState(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}
function zodResolver(loginSchema: z.ZodObject<{ email: z.ZodString; password: z.ZodString; }, "strip", z.ZodTypeAny, { email: string; password: string; }, { email: string; password: string; }>): import("react-hook-form").Resolver<{ email: string; password: string; }, any, { email: string; password: string; }> | undefined {
    throw new Error('Function not implemented.');
}

function useEffect(arg0: () => void, arg1: any[]) {
    throw new Error('Function not implemented.');
}

