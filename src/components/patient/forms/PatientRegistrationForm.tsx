// src/components/patient/forms/PatientRegistrationForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerPatientAsync } from '../../../store/slices/patientSlice';
import { patientRegistrationSchema, PatientRegistrationFormData } from '../../../utils/validators';
import { SecurityUtils } from '../../../utils/security';

interface PatientRegistrationFormProps {
  hospitalId?: string;
  onSuccess?: (patient: any) => void;
}

export const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({ 
  hospitalId, 
  onSuccess 
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.patient);
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch
  } = useForm<PatientRegistrationFormData>({
    resolver: zodResolver(patientRegistrationSchema),
    mode: 'onBlur',
    defaultValues: {
      hospitalId: hospitalId || '',
      gender: 'MALE'
    }
  });

  const watchEmail = watch('email');
  const watchPhoneNumber = watch('phoneNumber');

  const onSubmit = async (data: PatientRegistrationFormData) => {
    try {
      clearErrors();

      // Sanitize inputs
      const sanitizedData = {
        ...data,
        firstName: SecurityUtils.sanitizeInput(data.firstName),
        lastName: SecurityUtils.sanitizeInput(data.lastName),
        email: data.email ? SecurityUtils.sanitizeInput(data.email.toLowerCase().trim()) : undefined,
        phoneNumber: data.phoneNumber ? SecurityUtils.sanitizeInput(data.phoneNumber) : undefined,
        address: data.address ? SecurityUtils.sanitizeInput(data.address) : undefined,
        emergencyContactName: data.emergencyContactName ? SecurityUtils.sanitizeInput(data.emergencyContactName) : undefined,
        emergencyContactPhone: data.emergencyContactPhone ? SecurityUtils.sanitizeInput(data.emergencyContactPhone) : undefined,
        emergencyContactRelationship: data.emergencyContactRelationship ? SecurityUtils.sanitizeInput(data.emergencyContactRelationship) : undefined,
        initialSymptoms: data.initialSymptoms ? SecurityUtils.sanitizeInput(data.initialSymptoms) : undefined,
        allergies: data.allergies ? SecurityUtils.sanitizeInput(data.allergies) : undefined,
        currentMedications: data.currentMedications ? SecurityUtils.sanitizeInput(data.currentMedications) : undefined,
        chronicConditions: data.chronicConditions ? SecurityUtils.sanitizeInput(data.chronicConditions) : undefined,
      };

      // Additional validation
      if (sanitizedData.email && !SecurityUtils.isValidEmail(sanitizedData.email)) {
        setError('email', { message: 'Please enter a valid email address' });
        return;
      }

      const result = await dispatch(registerPatientAsync(sanitizedData)).unwrap();
      
      // Success callback
      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate('/patients', { 
          state: { 
            message: `Patient ${result.fullName} registered successfully with MRN: ${result.mrn}` 
          } 
        });
      }

    } catch (error: any) {
      console.error('Patient registration error:', error);
      setError('root', { 
        message: error.message || 'Failed to register patient. Please try again.' 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Register New Patient</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter patient information to create a new medical record
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                {...register('dateOfBirth')}
                type="date"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                {...register('gender')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.gender ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter full address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                {...register('bloodGroup')}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.bloodGroup ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodGroup && (
                <p className="mt-1 text-sm text-red-600">{errors.bloodGroup.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SSN Last 4 Digits
              </label>
              <input
                {...register('ssnLast4')}
                type="text"
                maxLength={4}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.ssnLast4 ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Last 4 digits of SSN"
              />
              {errors.ssnLast4 && (
                <p className="mt-1 text-sm text-red-600">{errors.ssnLast4.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Symptoms / Chief Complaint
              </label>
              <textarea
                {...register('initialSymptoms')}
                rows={3}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.initialSymptoms ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Describe initial symptoms or reason for visit"
              />
              {errors.initialSymptoms && (
                <p className="mt-1 text-sm text-red-600">{errors.initialSymptoms.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies
              </label>
              <textarea
                {...register('allergies')}
                rows={2}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.allergies ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="List any known allergies"
              />
              {errors.allergies && (
                <p className="mt-1 text-sm text-red-600">{errors.allergies.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                {...register('currentMedications')}
                rows={2}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.currentMedications ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="List current medications"
              />
              {errors.currentMedications && (
                <p className="mt-1 text-sm text-red-600">{errors.currentMedications.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chronic Conditions
              </label>
              <textarea
                {...register('chronicConditions')}
                rows={2}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.chronicConditions ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="List any chronic medical conditions"
              />
              {errors.chronicConditions && (
                <p className="mt-1 text-sm text-red-600">{errors.chronicConditions.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                {...register('emergencyContactName')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Emergency contact name"
              />
              {errors.emergencyContactName && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                {...register('emergencyContactPhone')}
                type="tel"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Emergency contact phone"
              />
              {errors.emergencyContactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship
              </label>
              <input
                {...register('emergencyContactRelationship')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.emergencyContactRelationship ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Relationship (e.g., Spouse, Parent)"
              />
              {errors.emergencyContactRelationship && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(error || errors.root) && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.root?.message || error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registering Patient...
              </div>
            ) : (
              'Register Patient'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;