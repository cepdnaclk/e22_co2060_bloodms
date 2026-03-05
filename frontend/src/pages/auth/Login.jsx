import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/* ── Shared SweetAlert2 theme ─────────────────────────────── */
const swalBase = {
    customClass: {
        popup:          'swal-hopedrop-popup',
        title:          'swal-hopedrop-title',
        htmlContainer:  'swal-hopedrop-html',
        confirmButton:  'swal-hopedrop-confirm',
        icon:           'swal-hopedrop-icon',
    },
    width: 'clamp(260px, 90vw, 380px)',
    padding: 'clamp(1.2rem, 4vw, 2rem)',
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/donor';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');

            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all required fields.',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
            });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            let selectedRole = 'donor';
            if (email.includes('@frontend.lk')) {
                selectedRole = email.split('@')[0];
            }

            login({ email, name: email.split('@')[0], role: selectedRole });

            /* ── Login success toast ── */
            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'success',
                title: 'Login Successful!',
                text: `Welcome back, ${email.split('@')[0]}.`,
                showConfirmButton: false,
                timer: 1800,
                timerProgressBar: true,
                toast: true,
            }).then(() => {
                navigate(`/${selectedRole}`, { replace: true });
            });
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* Logo mark */}
                <div className="auth-logo-mark">
                    <div className="logo-icon">🩸</div>
                    <span className="logo-text">HOPEDROP</span>
                </div>

                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to access your HOPEDROP dashboard</p>
                </div>

                {error && <div className="auth-error-message">⚠️ {error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email or Username</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className={error && !email ? 'error-input' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Login As</label>
                        <select
                            id="role"
                            onChange={(e) => setEmail(e.target.value + '@frontend.lk')}
                            disabled={loading}
                            className="auth-select"
                        >
                            <option value="donor">Donor</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Medical Officer</option>
                            <option value="staff">Hospital Staff</option>
                            <option value="admin">System Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className={error && !password ? 'error-input' : ''}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember Me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner"></span> : 'Login'}
                    </button>
                </form>

                <div className="auth-divider"><span>OR</span></div>

                <div className="social-login">
                    <button className="btn-social btn-google" type="button">
                        <span className="social-icon">G</span>
                        Continue with Google
                    </button>
                    <button className="btn-social btn-facebook" type="button">
                        <span className="social-icon">f</span>
                        Continue with Facebook
                    </button>
                </div>

                <div className="auth-footer">
                    <p>Don&apos;t have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
