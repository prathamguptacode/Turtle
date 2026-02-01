import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  code?: number;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code = 404, message = 'Page Not Found' }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--DarkBackground)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}
      >
        <AlertCircle size={72} color="var(--PrimaryGreen)" style={{ marginBottom: '24px' }}  />
        <h1 style={{ fontSize: '48px', color: '#fff', margin: '0 0 12px 0' }}>{code}</h1>
        <p style={{ fontSize: '20px', color: '#b3b3b3', marginBottom: '32px' }}>{message}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '14px 24px',
            background: 'var(--PrimaryGreen)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#059669')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--PrimaryGreen)')}
        >
          <ArrowLeft size={18} />
          Go Home
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
