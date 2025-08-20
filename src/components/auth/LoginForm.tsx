export{};

// // src/components/auth/LoginForm.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Eye, EyeOff, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import DOMPurify from 'dompurify';
// import {
//   loginAsync,
//   clearError,
//   selectAuth,
//   selectIsRateLimited,
//   resetLoginAttempts
// } from '../../store/slices/authSlice';
// import type { AppDispatch } from '../../store/store';
//
// // Input sanitization
// const sanitizeInput = (input: string): string => {
//   return DOMPurify.sanitize(input.trim(), {
//     ALLOWED_TAGS: [],
//     ALLOWED_ATTR: []
//   });
// };
//
// // Email validation regex
// const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//
// // Password strength validation
// const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
//   const errors: string[] = [];
//
//   if (password.length < 8) {
//     errors.push('Password must be at least 8 characters long');
//   }
//   if (!/[A-Z]/.test(password)) {
//     errors.push('Password must contain at least one uppercase letter');
//   }
//   if (!/[a-z]/.test(password)) {
//     errors.push('Password must contain at least one lowercase letter');
//   }
//   if (!/\d/.test(password)) {
//     errors.push('Password must contain at least one number');
//   }
//   if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//     errors.push('Password must contain at least one special character');
//   }
//
//   return {
//     isValid: errors.length === 0,
//     errors
//   };
// };
//
// interface LoginFormData {
//   email: string;
//   password: string;
// }
//
// interface FormErrors {
//   email?: string;
//   password?: string;
//   general?: string;
// }
//
// const LoginForm: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();
//
//   const { isLoading, error, isAuthenticated, loginAttempts } = useSelector(selectAuth);
//   const isRateLimited = useSelector(selectIsRateLimited);
//
//   // Form state
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: '',
//     password: ''
//   });
//
//   const [formErrors, setFormErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
//
//   // Security measures
//   const [captchaRequired, setCaptchaRequired] = useState(false);
//   const [captchaValue, setCaptchaValue] = useState('');
//   const [captchaQuestion, setCaptchaQuestion] = useState('');
//
//   // Generate simple math captcha
//   const generateCaptcha = useCallback(() => {
//     const num1 = Math.floor(Math.random() * 10) + 1;
//     const num2 = Math.floor(Math.random() * 10) + 1;
//     setCaptchaQuestion(`${num1} + ${num2} = ?`);
//     return num1 + num2;
//   }, []);
//
//   const [captchaAnswer, setCaptchaAnswer] = useState(generateCaptcha());
//
//   // Rate limiting countdown
//   useEffect(() => {
//     if (isRateLimited) {
//       const interval = setInterval(() => {
//         setRateLimitCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(interval);
//             dispatch(resetLoginAttempts());
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//
//       // Set initial countdown (15 minutes = 900 seconds)
//       setRateLimitCountdown(900);
//
//       return () => clearInterval(interval);
//     }
//   }, [isRateLimited, dispatch]);
//
//   // Show captcha after 3 failed attempts
//   useEffect(() => {
//     if (loginAttempts >= 3) {
//       setCaptchaRequired(true);
//       setCaptchaAnswer(generateCaptcha());
//     }
//   }, [loginAttempts, generateCaptcha]);
//
//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       const from = (location.state as any)?.from?.pathname || '/dashboard';
//       navigate(from, { replace: true });
//     }
//   }, [isAuthenticated, navigate, location]);
//
//   // Clear errors when component unmounts
//   useEffect(() => {
//     return () => {
//       dispatch(clearError());
//     };
//   }, [dispatch]);
//
//   // Input change handler with sanitization
//   const handleInputChange = (field: keyof LoginFormData, value: string) => {
//     const sanitizedValue = sanitizeInput(value);
//
//     setFormData(prev => ({
//       ...prev,
//       [field]: sanitizedValue
//     }));
//
//     // Clear field-specific errors
//     // if (formErrors[field]) {
//     //   setFormErrors(prev => ({
//     //     ...prev,
//     //     [field]: undefined
//     //   }));
//     // }
//   };
//
//   // Form validation
//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//
//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!EMAIL_REGEX.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
//
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else {
//       const passwordValidation = validatePassword(formData.password);
//       if (!passwordValidation.isValid) {
//         newErrors.password = passwordValidation.errors[0];
//       }
//     }
//
//     // Captcha validation
//     if (captchaRequired) {
//       if (!captchaValue) {
//         newErrors.general = 'Please complete the captcha';
//       } else if (parseInt(captchaValue) !== captchaAnswer) {
//         newErrors.general = 'Incorrect captcha answer';
//       }
//     }
//
//     setFormErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//
//   // Form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//
//     if (isRateLimited) {
//       toast.error('Too many login attempts. Please wait before trying again.');
//       return;
//     }
//
//     if (!validateForm()) {
//       return;
//     }
//
//     setIsSubmitting(true);
//
//     try {
//       await dispatch(loginAsync({
//         email: formData.email,
//         password: formData.password
//       })).unwrap();
//
//       toast.success('Login successful!');
//
//       // Reset form
//       setFormData({ email: '', password: '' });
//       setCaptchaValue('');
//
//     } catch (error: any) {
//       console.error('Login error:', error);
//
//       // Generate new captcha on failed attempt
//       if (captchaRequired) {
//         setCaptchaAnswer(generateCaptcha());
//         setCaptchaValue('');
//       }
//
//       // Show specific error messages
//       if (error.includes('Invalid credentials')) {
//         setFormErrors({ general: 'Invalid email or password' });
//       } else if (error.includes('Account locked')) {
//         setFormErrors({ general: 'Account temporarily locked. Please try again later.' });
//       } else {
//         setFormErrors({ general: error });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   // Format countdown time
//   const formatCountdown = (seconds: number): string => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
//   };
//
//   if (isRateLimited) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div className="text-center">
//             <Shield className="mx-auto h-16 w-16 text-red-500" />
//             <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
//               Account Temporarily Locked
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Too many failed login attempts. Please wait {formatCountdown(rateLimitCountdown)} before trying again.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="flex justify-center">
//             <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
//               <Shield className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to HealthHorizon
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Secure Healthcare Management System
//           </p>
//         </div>
//
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <input type="hidden" name="remember" value="true" />
//
//           {/* CSRF Token */}
//           <input
//             type="hidden"
//             name="_token"
//             value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
//           />
//
//           <div className="space-y-4">
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   maxLength={100}
//                   className={`appearance-none relative block w-full pl-10 pr-3 py-3 border ${
//                     formErrors.email ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors`}
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               {formErrors.email && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {formErrors.email}
//                 </p>
//               )}
//             </div>
//
//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   maxLength={128}
//                   className={`appearance-none relative block w-full pl-10 pr-12 py-3 border ${
//                     formErrors.password ? 'border-red-300' : 'border-gray-300'
//                   } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors`}
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={(e) => handleInputChange('password', e.target.value)}
//                   disabled={isSubmitting}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isSubmitting}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {formErrors.password && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-1" />
//                   {formErrors.password}
//                 </p>
//               )}
//             </div>
//
//             {/* Captcha */}
//             {captchaRequired && (
//               <div>
//                 <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
//                   Security Check
//                 </label>
//                 <div className="mt-1 flex items-center space-x-3">
//                   <div className="bg-gray-100 px-4 py-2 rounded border text-lg font-mono">
//                     {captchaQuestion}
//                   </div>
//                   <input
//                     id="captcha"
//                     name="captcha"
//                     type="number"
//                     required
//                     className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     placeholder="Answer"
//                     value={captchaValue}
//                     onChange={(e) => setCaptchaValue(e.target.value)}
//                     disabled={isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setCaptchaAnswer(generateCaptcha());
//                       setCaptchaValue('');
//                     }}
//                     className="px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800"
//                     disabled={isSubmitting}
//                   >
//                     Refresh
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//
//           {/* General Error */}
//           {(formErrors.general || error) && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-sm text-red-600 flex items-center">
//                 <AlertCircle className="h-4 w-4 mr-2" />
//                 {formErrors.general || error}
//               </p>
//             </div>
//           )}
//
//           {/* Login Attempts Warning */}
//           {loginAttempts > 0 && loginAttempts < 5 && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <p className="text-sm text-yellow-600">
//                 Warning: {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}.
//                 Account will be locked after 5 failed attempts.
//               </p>
//             </div>
//           )}
//
//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               disabled={isSubmitting || isLoading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {isSubmitting || isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>
//
//           {/* Security Notice */}
//           <div className="text-center">
//             <p className="text-xs text-gray-500">
//               Protected by advanced security measures including rate limiting,
//               input sanitization, and CSRF protection.
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export default LoginForm;