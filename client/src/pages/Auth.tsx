import React, { useState } from 'react';
import {
    Mail,
    ArrowRight,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    User,
} from 'lucide-react';
import api from '../api/axios';

type AuthView = 'login' | 'signup' | 'verify-signup';

interface ValidationError {
    field: string;
    message: string;
}

const AuthPage = () => {
    const [view, setView] = useState<AuthView>('login');

    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Signup form state
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [token, setToken] = useState('');

    // OTP state
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [serverError, setServerError] = useState('');

    // Helper function to get error message for a field
    const getFieldError = (field: string): string => {
        const error = errors.find((e) => e.field === field);
        return error ? error.message : '';
    };

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setServerError('');
        setIsLoading(true);

        try {
            const response = await api.post(`/login`, {
                email: loginEmail,
                password: loginPassword,
            });

            // Store token (adjust based on your backend response)
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }

            // Redirect to home page or dashboard
            console.log('Login successful:', response.data);
            window.location.href = '/';
        } catch (error: any) {
            setIsLoading(false);

            if (error.response?.data?.errors) {
                // Validation errors from backend
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                // General error message
                setServerError(error.response.data.message);
            } else {
                setServerError('Login failed. Please try again.');
            }
        }
    };

    // Handle Signup (sends OTP)
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setServerError('');
        setIsLoading(true);

        try {
            const response = await api.post(`/signup`, {
                name: signupName,
                email: signupEmail,
                password: signupPassword,
            });

            setIsLoading(false);

            const tempToken = `Bearer ${response.data.token}`;
            setToken(tempToken);
            // Move to OTP verification view
            setView('verify-signup');
        } catch (error: any) {
            setIsLoading(false);

            if (error.response?.data?.errors) {
                // Validation errors from Zod
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Signup failed. Please try again.');
            }
        }
    };

    // Handle OTP Verification
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setServerError('');
        setIsLoading(true);

        const otpCode = otp.join('');

        try {
            console.log(token)
            console.log(otpCode)
            const response = await api.post(
                `/verify`,
                {
                    otp: otpCode,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            );

            // Store token
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }

            // Redirect to home page
            console.log('Verification successful:', response.data);
            window.location.href = '/';
        } catch (error) {
            console.log(error)
            setIsLoading(false);

            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Invalid OTP. Please try again.');
            }
        }
    };

    // Handle OTP input change
    const handleOTPChange = (index: number, value: string) => {
        if (value.length > 1) return;

        // Convert to uppercase
        const upperValue = value.toUpperCase();

        const newOtp = [...otp];
        newOtp[index] = upperValue;
        setOtp(newOtp);

        // Auto-focus next input
        if (upperValue && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const resetForm = () => {
        setLoginEmail('');
        setLoginPassword('');
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setOtp(['', '', '', '', '', '']);
        setErrors([]);
        setServerError('');
        setShowLoginPassword(false);
        setShowSignupPassword(false);
    };

    const handleBackToSignup = () => {
        setOtp(['', '', '', '', '', '']);
        setErrors([]);
        setServerError('');
        setView('signup');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#0a0f0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily:
                    'Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu, sans-serif',
                padding: '20px',
            }}
        >
            <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-container {
          animation: fadeIn 0.5s ease;
        }

        .otp-input {
          transition: all 0.3s ease;
        }

        .otp-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>

            <div
                className="auth-container"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    background: '#0f1a0f',
                    borderRadius: '8px',
                    padding: '48px 40px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '36px',
                            fontWeight: 700,
                            color: '#10b981',
                            margin: 0,
                            letterSpacing: '0.5px',
                        }}
                    >
                        TURTLE
                    </h1>
                </div>

                {/* Server Error Message */}
                {serverError && (
                    <div
                        style={{
                            padding: '12px 16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '14px',
                            marginBottom: '24px',
                        }}
                    >
                        {serverError}
                    </div>
                )}

                {/* Login Form */}
                {view === 'login' && (
                    <div>
                        <h2
                            style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#fff',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Sign In
                        </h2>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#b3b3b3',
                                margin: '0 0 32px 0',
                            }}
                        >
                            Enter your credentials to continue
                        </p>

                        <form onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e5e5e5',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#b3b3b3',
                                        }}
                                    />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) =>
                                            setLoginEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 48px',
                                            background: '#1a2a1a',
                                            border: `1px solid ${getFieldError('email') ? '#ef4444' : '#2a3a2a'}`,
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition:
                                                'border-color 0.3s ease',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) =>
                                            !getFieldError('email') &&
                                            (e.target.style.borderColor =
                                                '#10b981')
                                        }
                                        onBlur={(e) =>
                                            !getFieldError('email') &&
                                            (e.target.style.borderColor =
                                                '#2a3a2a')
                                        }
                                    />
                                </div>
                                {getFieldError('email') && (
                                    <p
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            margin: '6px 0 0 0',
                                        }}
                                    >
                                        {getFieldError('email')}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div style={{ marginBottom: '24px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e5e5e5',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#b3b3b3',
                                        }}
                                    />
                                    <input
                                        type={
                                            showLoginPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={loginPassword}
                                        onChange={(e) =>
                                            setLoginPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 48px 14px 48px',
                                            background: '#1a2a1a',
                                            border: `1px solid ${getFieldError('password') ? '#ef4444' : '#2a3a2a'}`,
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition:
                                                'border-color 0.3s ease',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) =>
                                            !getFieldError('password') &&
                                            (e.target.style.borderColor =
                                                '#10b981')
                                        }
                                        onBlur={(e) =>
                                            !getFieldError('password') &&
                                            (e.target.style.borderColor =
                                                '#2a3a2a')
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowLoginPassword(
                                                !showLoginPassword,
                                            )
                                        }
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#b3b3b3',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {showLoginPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {getFieldError('password') && (
                                    <p
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            margin: '6px 0 0 0',
                                        }}
                                    >
                                        {getFieldError('password')}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isLoading || !loginEmail || !loginPassword
                                }
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background:
                                        loginEmail &&
                                        loginPassword &&
                                        !isLoading
                                            ? '#10b981'
                                            : '#2a3a2a',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor:
                                        loginEmail &&
                                        loginPassword &&
                                        !isLoading
                                            ? 'pointer'
                                            : 'not-allowed',
                                    transition: 'background 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) =>
                                    loginEmail &&
                                    loginPassword &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#059669')
                                }
                                onMouseLeave={(e) =>
                                    loginEmail &&
                                    loginPassword &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#10b981')
                                }
                            >
                                {isLoading ? (
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation:
                                                'spin 0.8s linear infinite',
                                        }}
                                    />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: '32px',
                                textAlign: 'center',
                                fontSize: '14px',
                                color: '#b3b3b3',
                            }}
                        >
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setView('signup');
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#10b981',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    textDecoration: 'underline',
                                }}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}

                {/* Sign Up Form */}
                {view === 'signup' && (
                    <div>
                        <h2
                            style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#fff',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Create Account
                        </h2>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#b3b3b3',
                                margin: '0 0 32px 0',
                            }}
                        >
                            Enter your details to get started
                        </p>

                        <form onSubmit={handleSignup}>
                            {/* Name Field */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e5e5e5',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#b3b3b3',
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={signupName}
                                        onChange={(e) =>
                                            setSignupName(e.target.value)
                                        }
                                        placeholder="John Doe"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 48px',
                                            background: '#1a2a1a',
                                            border: `1px solid ${getFieldError('name') ? '#ef4444' : '#2a3a2a'}`,
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition:
                                                'border-color 0.3s ease',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) =>
                                            !getFieldError('name') &&
                                            (e.target.style.borderColor =
                                                '#10b981')
                                        }
                                        onBlur={(e) =>
                                            !getFieldError('name') &&
                                            (e.target.style.borderColor =
                                                '#2a3a2a')
                                        }
                                    />
                                </div>
                                {getFieldError('name') && (
                                    <p
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            margin: '6px 0 0 0',
                                        }}
                                    >
                                        {getFieldError('name')}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e5e5e5',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#b3b3b3',
                                        }}
                                    />
                                    <input
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) =>
                                            setSignupEmail(e.target.value)
                                        }
                                        placeholder="you@example.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 48px',
                                            background: '#1a2a1a',
                                            border: `1px solid ${getFieldError('email') ? '#ef4444' : '#2a3a2a'}`,
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition:
                                                'border-color 0.3s ease',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) =>
                                            !getFieldError('email') &&
                                            (e.target.style.borderColor =
                                                '#10b981')
                                        }
                                        onBlur={(e) =>
                                            !getFieldError('email') &&
                                            (e.target.style.borderColor =
                                                '#2a3a2a')
                                        }
                                    />
                                </div>
                                {getFieldError('email') && (
                                    <p
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            margin: '6px 0 0 0',
                                        }}
                                    >
                                        {getFieldError('email')}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div style={{ marginBottom: '24px' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#e5e5e5',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock
                                        size={20}
                                        style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#b3b3b3',
                                        }}
                                    />
                                    <input
                                        type={
                                            showSignupPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={signupPassword}
                                        onChange={(e) =>
                                            setSignupPassword(e.target.value)
                                        }
                                        placeholder="Create a strong password"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '14px 48px 14px 48px',
                                            background: '#1a2a1a',
                                            border: `1px solid ${getFieldError('password') ? '#ef4444' : '#2a3a2a'}`,
                                            borderRadius: '6px',
                                            color: '#fff',
                                            fontSize: '15px',
                                            outline: 'none',
                                            transition:
                                                'border-color 0.3s ease',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) =>
                                            !getFieldError('password') &&
                                            (e.target.style.borderColor =
                                                '#10b981')
                                        }
                                        onBlur={(e) =>
                                            !getFieldError('password') &&
                                            (e.target.style.borderColor =
                                                '#2a3a2a')
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSignupPassword(
                                                !showSignupPassword,
                                            )
                                        }
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#b3b3b3',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {showSignupPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {getFieldError('password') && (
                                    <p
                                        style={{
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            margin: '6px 0 0 0',
                                        }}
                                    >
                                        {getFieldError('password')}
                                    </p>
                                )}
                                <p
                                    style={{
                                        color: '#b3b3b3',
                                        fontSize: '12px',
                                        margin: '6px 0 0 0',
                                    }}
                                >
                                    Min 8 chars, 1 uppercase, 1 lowercase, 1
                                    number, 1 special char
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    !signupName ||
                                    !signupEmail ||
                                    !signupPassword
                                }
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background:
                                        signupName &&
                                        signupEmail &&
                                        signupPassword &&
                                        !isLoading
                                            ? '#10b981'
                                            : '#2a3a2a',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor:
                                        signupName &&
                                        signupEmail &&
                                        signupPassword &&
                                        !isLoading
                                            ? 'pointer'
                                            : 'not-allowed',
                                    transition: 'background 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) =>
                                    signupName &&
                                    signupEmail &&
                                    signupPassword &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#059669')
                                }
                                onMouseLeave={(e) =>
                                    signupName &&
                                    signupEmail &&
                                    signupPassword &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#10b981')
                                }
                            >
                                {isLoading ? (
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation:
                                                'spin 0.8s linear infinite',
                                        }}
                                    />
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: '32px',
                                textAlign: 'center',
                                fontSize: '14px',
                                color: '#b3b3b3',
                            }}
                        >
                            Already have an account?{' '}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setView('login');
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#10b981',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    textDecoration: 'underline',
                                }}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                )}

                {/* OTP Verification (Sign Up) */}
                {view === 'verify-signup' && (
                    <div>
                        <button
                            onClick={handleBackToSignup}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#b3b3b3',
                                cursor: 'pointer',
                                padding: '8px 0',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                transition: 'color 0.3s ease',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = '#10b981')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = '#b3b3b3')
                            }
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                        <h2
                            style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#fff',
                                margin: '0 0 8px 0',
                            }}
                        >
                            Verify Email
                        </h2>
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#b3b3b3',
                                margin: '0 0 32px 0',
                            }}
                        >
                            We sent a verification code to
                            <br />
                            <span style={{ color: '#10b981', fontWeight: 600 }}>
                                {signupEmail}
                            </span>
                        </p>

                        <form onSubmit={handleVerifyOTP}>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    marginBottom: '24px',
                                    justifyContent: 'center',
                                }}
                            >
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleOTPChange(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleOTPKeyDown(index, e)
                                        }
                                        className="otp-input"
                                        style={{
                                            width: '52px',
                                            height: '56px',
                                            background: '#1a2a1a',
                                            border: '2px solid #2a3a2a',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '24px',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.some((d) => !d)}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background:
                                        otp.every((d) => d) && !isLoading
                                            ? '#10b981'
                                            : '#2a3a2a',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor:
                                        otp.every((d) => d) && !isLoading
                                            ? 'pointer'
                                            : 'not-allowed',
                                    transition: 'background 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) =>
                                    otp.every((d) => d) &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#059669')
                                }
                                onMouseLeave={(e) =>
                                    otp.every((d) => d) &&
                                    !isLoading &&
                                    (e.currentTarget.style.background =
                                        '#10b981')
                                }
                            >
                                {isLoading ? (
                                    <div
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff',
                                            borderRadius: '50%',
                                            animation:
                                                'spin 0.8s linear infinite',
                                        }}
                                    />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div
                            style={{
                                marginTop: '24px',
                                textAlign: 'center',
                                fontSize: '14px',
                                color: '#b3b3b3',
                            }}
                        >
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleSignup}
                                disabled={isLoading}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#10b981',
                                    fontWeight: 600,
                                    cursor: isLoading
                                        ? 'not-allowed'
                                        : 'pointer',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    textDecoration: 'underline',
                                }}
                            >
                                Resend
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
