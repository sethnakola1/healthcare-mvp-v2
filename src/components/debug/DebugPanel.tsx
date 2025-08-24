import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAuth } from '../../store/slices/authSlice';
import { useAuth } from '../../contexts/AuthContext';
const DebugPanel: React.FC = () => {
const [isVisible, setIsVisible] = useState(false);
const auth = useAuth();
if (process.env.NODE_ENV !== 'development') {
return null;
}
return (
<div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
<button
onClick={() => setIsVisible(!isVisible)}
style={{
background: '#333',
color: 'white',
border: 'none',
padding: '8px 12px',
borderRadius: '4px',
cursor: 'pointer'
}}
>
Debug
</button>
  {isVisible && (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        right: 0,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '16px',
        minWidth: '300px',
        maxHeight: '400px',
        overflow: 'auto',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h4>Auth Debug Info</h4>
      <pre style={{ fontSize: '12px', overflow: 'auto' }}>
        {JSON.stringify({
          isAuthenticated: auth.isAuthenticated,
          user: auth.user,
          hasToken: !!auth.token,
          loading: auth.loading,
          error: auth.error
        }, null, 2)}
      </pre>
    </div>
  )}
</div>
);
};
export default DebugPanel;