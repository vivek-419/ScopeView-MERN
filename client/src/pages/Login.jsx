import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(formData.email, formData.password)

        setLoading(false)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="auth-page">
            {/* Left Side - Project Description */}
            <div className="auth-left">
                <div className="auth-branding">
                    <div className="brand-logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M3 13h2l2-7 4 14 4-14 2 7h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="brand-title">ScopeView</h1>
                    <p className="brand-tagline">Real-time Telemetry Platform</p>
                </div>

                <div className="auth-description">
                    <p className="description-text">
                        Monitor your system metrics in real-time with powerful visualization and analytics.
                    </p>

                    <div className="feature-list">
                        <div className="feature-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="feature-icon">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="feature-text">Real-time data streaming</span>
                        </div>

                        <div className="feature-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="feature-icon">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="feature-text">Historical analytics</span>
                        </div>

                        <div className="feature-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="feature-icon">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="feature-text">Export to CSV</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to continue</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
