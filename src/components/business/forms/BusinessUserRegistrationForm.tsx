export{};
// // import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../../store/hooks';
// import { createBusinessUserAsync } from '../../../store/slices/businessSlice';
// // import { useForm } from 'react-hook-form';
// // import { zodResolver } from '@hookform/resolvers/zod';

// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { z } from 'zod';
// import { RootState, AppDispatch } from '../../../store';
// import { BusinessUserFormData } from '../../../types/auth.types';
// import { addUser, setError } from '../../../store/slices/businessSlice';


// const businessUserSchema = z.object({
//   firstName: z.string().min(1, 'First name is required'),
//   lastName: z.string().min(1, 'Last name is required'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(8, 'Password must be at least 8 characters'),
//   confirmPassword: z.string().min(1, 'Please confirm your password'),
//   phoneNumber: z.string().optional(),
//   territory: z.string().min(1, 'Territory is required'),
//   role: z.enum(['SUPER_ADMIN', 'TECH_ADVISOR']),
// }).refine((data: BusinessUserFormData) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// const BusinessUserRegistrationForm: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => state.business);

//   const [formData, setFormData] = useState<BusinessUserFormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phoneNumber: '',
//     territory: '',
//     role: 'TECH_ADVISOR',
//   });

//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       // Validate form data
//       businessUserSchema.parse(formData);
//       setValidationErrors({});

//       // Create new user object
//       const newUser = {
//         id: Date.now().toString(), // Temporary ID generation
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         territory: formData.territory,
//         role: formData.role,
//       };

//       // Dispatch action to add user
//       dispatch(addUser(newUser));

//       // Reset form
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         phoneNumber: '',
//         territory: '',
//         role: 'TECH_ADVISOR',
//       });

//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const errors: Record<string, string> = {};
//         error.errors.forEach((err) => {
//           if (err.path) {
//             errors[err.path[0] as string] = err.message;
//           }
//         });
//         setValidationErrors(errors);
//       } else {
//         dispatch(setError('An unexpected error occurred'));
//       }
//     }
//   };


// type BusinessUserFormData = z.infer<typeof businessUserSchema>;

// const BusinessUserRegistrationForm = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//    const { isLoading, error } = useAppSelector((state) => state.business);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setError,
//   } = useForm<BusinessUserFormData>({
//     resolver: zodResolver(businessUserSchema),
//     defaultValues: {
//       role: 'TECH_ADVISOR'
//     }
//   });

//   const onSubmit = async (data: BusinessUserFormData) => {
//     try {
//       await dispatch(createBusinessUserAsync(data)).unwrap();
//       navigate('/dashboard', {
//         state: { 
//           message: `User ${data.firstName} ${data.lastName} created successfully`
//         } 
//       });
//     } catch (error: any) {
//       setError('root', { 
//         message: error || 'Failed to create user. Please try again.'
//       });
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">Create Business User</h2>
//         <p className="mt-2 text-sm text-gray-600">
//           Register a new Super Admin or Tech Advisor
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Role *
//           </label>
//           <select
//             {...register('role')}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="TECH_ADVISOR">Tech Advisor</option>
//             <option value="SUPER_ADMIN">Super Admin</option>
//           </select>
//           {errors.role && (
//             <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
//           )}
//         </div>

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               First Name *
//             </label>
//             <input
//               {...register('firstName')}
//               type="text"
//               className={`mt-1 block w-full px-3 py-2 border ${
//                 errors.firstName ? 'border-red-300' : 'border-gray-300'
//               } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//               placeholder="Enter first name"
//             />
//             {errors.firstName && (
//               <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name *
//             </label>
//             <input
//               {...register('lastName')}
//               type="text"
//               className={`mt-1 block w-full px-3 py-2 border ${
//                 errors.lastName ? 'border-red-300' : 'border-gray-300'
//               } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//               placeholder="Enter last name"
//             />
//             {errors.lastName && (
//               <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email Address *
//           </label>
//           <input
//             {...register('email')}
//             type="email"
//             className={`mt-1 block w-full px-3 py-2 border ${
//               errors.email ? 'border-red-300' : 'border-gray-300'
//             } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//             placeholder="Enter email address"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Username *
//           </label>
//           <input
//             {...register('username')}
//             type="text"
//             className={`mt-1 block w-full px-3 py-2 border ${
//               errors.username ? 'border-red-300' : 'border-gray-300'
//             } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//             placeholder="Enter username"
//           />
//           {errors.username && (
//             <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Territory *
//           </label>
//           <input
//             {...register('territory')}
//             type="text"
//             className={`mt-1 block w-full px-3 py-2 border ${
//               errors.territory ? 'border-red-300' : 'border-gray-300'
//             } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//             placeholder="Enter territory/region"
//           />
//           {errors.territory && (
//             <p className="mt-1 text-sm text-red-600">{errors.territory.message}</p>
//           )}
//         </div>

//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password *
//             </label>
//             <input
//               {...register('password')}
//               type="password"
//               className={`mt-1 block w-full px-3 py-2 border ${
//                 errors.password ? 'border-red-300' : 'border-gray-300'
//               } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//               placeholder="Enter password"
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password *
//             </label>
//             <input
//               {...register('confirmPassword')}
//               type="password"
//               className={`mt-1 block w-full px-3 py-2 border ${
//                 errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
//               } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//               placeholder="Confirm password"
//             />
//             {errors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
//             )}
//           </div>
//         </div>

//         {(error || errors.root) && (
//           <div className="rounded-md bg-red-50 p-4">
//             <div className="flex">
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">
//                   {errors.root?.message || error}
//                 </h3>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => navigate('/dashboard')}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting || isLoading}
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {isSubmitting || isLoading ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Creating User...
//               </div>
//             ) : (
//               'Create User'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BusinessUserRegistrationForm;