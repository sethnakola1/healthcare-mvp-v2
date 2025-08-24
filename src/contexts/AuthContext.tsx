import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Types
interface User {
userId: string;
email: string;
firstName: string;
lastName: string;
fullName: string;
username: string;
role: string;
roleDisplayName: string;
isActive: boolean;
emailVerified: boolean;
phoneNumber?: string;
territory?: string;
partnerCode?: string;
lastLogin?: string;
createdAt?: string;
}
interface LoginCredentials {
email: string;
password: string;
}
interface LoginResponse {
accessToken: string;
refreshToken: string;
tokenType: string;
expiresIn: number;
userId: string;
email: string;
firstName: string;
lastName: string;
role: string;
loginTime: string;
}
interface AuthContextType {
user: User | null;
token: string | null;
loading: boolean;
error: string | null;
login: (credentials: LoginCredentials) => Promise<void>;
logout: () => void;
clearError: () => void;
refreshToken: () => Promise<void>;
isAuthenticated: boolean;
}
// Create Context
const AuthContext = createContext<AuthContextType | null>(null);
// Auth Provider Component
interface AuthProviderProps {
children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
// Base API URL - adjust this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// Initialize auth state from localStorage
useEffect(() => {
initializeAuth();
}, []);
const initializeAuth = async () => {
try {
setLoading(true);
const storedToken = localStorage.getItem('accessToken');
const storedUser = localStorage.getItem('user');
  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));

    // Verify token is still valid
    try {
      await validateToken(storedToken);
    } catch (error) {
      // Token is invalid, try to refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          await refreshTokens();
        } catch (refreshError) {
          // Refresh failed, logout
          logout();
        }
      } else {
        logout();
      }
    }
  }
} catch (error) {
  console.error('Auth initialization error:', error);
  logout();
} finally {
  setLoading(false);
}
};
const validateToken = async (token: string) => {
const response = await fetch(${API_BASE_URL}/api/auth/validate, {
method: 'GET',
headers: {
'Authorization': Bearer ${token},
'Content-Type': 'application/json',
},
});
if (!response.ok) {
  throw new Error('Token validation failed');
}

return response.json();
};
const login = async (credentials: LoginCredentials) => {
try {
setLoading(true);
setError(null);
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Login failed');
  }

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Invalid login response');
  }

  const loginData: LoginResponse = data.data;

  // Store tokens securely
  localStorage.setItem('accessToken', loginData.accessToken);
  localStorage.setItem('refreshToken', loginData.refreshToken);
  localStorage.setItem('tokenType', loginData.tokenType);
  localStorage.setItem('expiresIn', loginData.expiresIn.toString());

  // Create user object
  const userData: User = {
    userId: loginData.userId,
    email: loginData.email,
    firstName: loginData.firstName,
    lastName: loginData.lastName,
    fullName: `${loginData.firstName} ${loginData.lastName}`,
    username: loginData.email, // Using email as username
    role: loginData.role,
    roleDisplayName: loginData.role.replace('_', ' '),
    isActive: true,
    emailVerified: true,
  };

  localStorage.setItem('user', JSON.stringify(userData));

  setToken(loginData.accessToken);
  setUser(userData);

  // Get additional user details
  try {
    await getCurrentUser(loginData.accessToken);
  } catch (error) {
    console.warn('Failed to get additional user details:', error);
    // Don't fail login if we can't get additional details
  }

} catch (error: any) {
  console.error('Login error:', error);
  setError(error.message || 'Login failed. Please try again.');
  throw error;
} finally {
  setLoading(false);
}
};
const getCurrentUser = async (authToken?: string) => {
try {
const tokenToUse = authToken || token;
if (!tokenToUse) return;
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokenToUse}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    if (data.success && data.data) {
      const updatedUser: User = {
        ...user!,
        ...data.data,
        fullName: `${data.data.firstName} ${data.data.lastName}`,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
} catch (error) {
  console.warn('Failed to get current user:', error);
}
};
const refreshTokens = async () => {
try {
const refreshToken = localStorage.getItem('refreshToken');
if (!refreshToken) {
throw new Error('No refresh token available');
}
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Token refresh failed');
  }

  const loginData: LoginResponse = data.data;

  // Update tokens
  localStorage.setItem('accessToken', loginData.accessToken);
  localStorage.setItem('refreshToken', loginData.refreshToken);
  localStorage.setItem('expiresIn', loginData.expiresIn.toString());

  setToken(loginData.accessToken);

  return loginData.accessToken;
} catch (error) {
  console.error('Token refresh failed:', error);
  logout();
  throw error;
}
};
const logout = () => {
// Clear all auth data
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('tokenType');
localStorage.removeItem('expiresIn');
localStorage.removeItem('user');
setUser(null);
setToken(null);
setError(null);

// Optional: Call backend logout
if (token) {
  fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).catch(console.warn); // Don't fail logout if backend call fails
}
};
const clearError = () => {
setError(null);
};
const contextValue: AuthContextType = {
user,
token,
loading,
error,
login,
logout,
clearError,
refreshToken: refreshTokens,
isAuthenticated: !!user && !!token,
};
return (
<AuthContext.Provider value={contextValue}>
{children}
</AuthContext.Provider>
);
};
// useAuth Hook
export const useAuth = (): AuthContextType => {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};
// Export default
export default AuthContext;