// src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { getRoleColor } from '../../config/constants';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, authState } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const testCredentials = [
    { email: 'sethnakola@healthhorizon.com', password: 'SuperAdmin123!', role: 'Super Admin' },
    { email: 'admin@hospital.com', password: 'Admin123!', role: 'Hospital Admin' },
    { email: 'doctor@hospital.com', password: 'Doctor123!', role: 'Doctor' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#2D3748',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            HealthHorizon
          </h1>
          <p style={{
            color: '#718096',
            fontSize: '16px',
            margin: 0
          }}>
            Healthcare Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '48px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              border: '1px solid #FECACA'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={authState.isLoading}
            style={{
              width: '100%',
              background: authState.isLoading ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: authState.isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: authState.isLoading ? 0.7 : 1
            }}
          >
            {authState.isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Test Credentials */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '20px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: '15px',
            fontWeight: '500'
          }}>
            Test Credentials
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {testCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFormData({ email: cred.email, password: cred.password })}
                style={{
                  background: 'transparent',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#374151',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{cred.email}</span>
                  <span style={{
                    background: getRoleColor(cred.role as UserRole),
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px'
                  }}>
                    {cred.role}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#9CA3AF',
            margin: 0
          }}>
            © 2025 HealthHorizon. Healthcare Management Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;