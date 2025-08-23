// src/components/auth/LoginPage.tsx (Use as default export)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Fixed path

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard'); // Redirect to dashboard on success
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick login for testing (align with backend roles)
  const quickLogin = async (role: string) => {
    const credentials: { [key: string]: { email: string; password: string } } = {
      SUPER_ADMIN: { email: 'super@admin.com', password: 'SuperAdmin123!' },
      // Add others
    };

    if (credentials[role]) {
      setFormData(credentials[role]);
      setTimeout(() => handleSubmit({ preventDefault: () => {} } as React.FormEvent), 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white p-2 rounded">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Quick login buttons */}
        <button onClick={() => quickLogin('SUPER_ADMIN')} className="mt-4 w-full bg-green-500 text-white p-2 rounded">
          Quick Login as Super Admin
        </button>
      </div>
    </div>
  );
};

export default LoginPage;