import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css';
import './SignUp.css';

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

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        bloodGroup: '',
        email: '',
        phone: '',
        hospital: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
    const navigate = useNavigate();

    /* Hospital autocomplete mock */
    const handleHospitalSearch = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, hospital: value });
        if (value.length > 2) {
            setHospitalSuggestions([
                `${value} City General Hospital`,
                `${value} Medical Center`,
                `National Blood Bank — ${value}`
            ]);
        } else {
            setHospitalSuggestions([]);
        }
    };

    const selectHospital = (hospital) => {
        setFormData({ ...formData, hospital });
        setHospitalSuggestions([]);
    };

    /* Password strength meter */
    useEffect(() => {
        let strength = 0;
        const { password } = formData;
        if (password.length > 7) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const { username, bloodGroup, email, password, confirmPassword } = formData;

        /* Validation */
        if (!username || !bloodGroup || !email || !password) {
            const msg = 'Please fill all required fields.';
            setError(msg);
            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'warning',
                title: 'Missing Fields',
                text: msg,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
            });
            return;
        }

        if (password !== confirmPassword) {
            const msg = 'Passwords do not match.';
            setError(msg);
            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'error',
                title: 'Password Mismatch',
                text: msg,
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                toast: true,
            });
            return;
        }

        setLoading(true);

        /* Mock API */
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            /* ── Registration success alert ── */
            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'success',
                title: 'Account Created!',
                text: `Welcome to HOPEDROP, ${username}. Redirecting to login…`,
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true,
                toast: true,
            }).then(() => {
                navigate('/login');
            });
        }, 1500);
    };

    return (
        <div className="signup-container new-design">
            <div className="signup-split-card-new">

                {/* ── Left Visual Panel ── */}
                <div className="signup-visual-section-new">
                    <div className="visual-orbs">
                        <div className="orb orb-1"></div>
                        <div className="orb orb-2"></div>
                        <div className="orb orb-3"></div>
                    </div>
                    <div className="visual-content-new">
                        <div className="visual-badge">
                            🩸&nbsp; HOPEDROP Platform
                        </div>
                        <h1 className="visual-title-new">
                            Join &amp;<br />Save Lives
                        </h1>
                        <p className="visual-subtitle-new">
                            Register today and become part of Sri Lanka's National Blood Donation Network.
                        </p>
                        <div className="visual-stats">
                            <div className="visual-stat">
                                <span className="stat-num">10k+</span>
                                <span className="stat-label">Donors</span>
                            </div>
                            <div className="visual-stat">
                                <span className="stat-num">250+</span>
                                <span className="stat-label">Hospitals</span>
                            </div>
                            <div className="visual-stat">
                                <span className="stat-num">48h</span>
                                <span className="stat-label">Alerts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Form Panel ── */}
                <div className="signup-form-section-new">
                    <div className="auth-header-new">
                        <h2>Hello! Tell us a little<br />about yourself.</h2>
                        <p>Fields marked with <strong>*</strong> are required.</p>
                    </div>

                    {error && <div className="auth-error-message">⚠️ {error}</div>}

                    {success && (
                        <div className="auth-success-message">
                            <div className="success-icon-check">✓</div>
                            Account created! Redirecting…
                        </div>
                    )}

                    <form className="auth-form-new" onSubmit={handleSubmit}>

                        {/* Row 1 */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={loading || success}
                                />
                            </div>
                            <div className="form-group-new half-width">
                                <label>Blood Group *</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    disabled={loading || success}
                                    className="auth-select-new"
                                >
                                    <option value="" disabled>Select…</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Phone */}
                        <div className="form-group-new">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+94 77 000 0000"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading || success}
                                className="w-50"
                            />
                        </div>

                        {/* Row 3: Email */}
                        <div className="form-group-new">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading || success}
                            />
                        </div>

                        {/* Row 4: Nearest Hospital */}
                        <div className="form-group-new hospital-autocomplete">
                            <label>Nearest Hospital</label>
                            <input
                                type="text"
                                name="hospital"
                                placeholder="Search hospital…"
                                value={formData.hospital}
                                onChange={handleHospitalSearch}
                                disabled={loading || success}
                            />
                            {hospitalSuggestions.length > 0 && (
                                <ul className="suggestions-list-new">
                                    {hospitalSuggestions.map((hosp, i) => (
                                        <li key={i} onClick={() => selectHospital(hosp)}>{hosp}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Row 5: Passwords */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading || success}
                                />
                                {formData.password && (
                                    <div className="password-strength-meter">
                                        <div className={`strength-bar level-${passwordStrength}`}></div>
                                    </div>
                                )}
                            </div>
                            <div className="form-group-new half-width">
                                <label>Confirm Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        {/* Show/hide toggle */}
                        <label style={{
                            fontSize: '0.82rem', cursor: 'pointer', userSelect: 'none',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            <input
                                type="checkbox"
                                style={{ accentColor: '#C62828' }}
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show passwords
                        </label>

                        <div className="form-actions-new">
                            <Link to="/login" className="btn-back-new">BACK</Link>
                            <button
                                type="submit"
                                className={`btn-next-new ${loading ? 'loading' : ''}`}
                                disabled={loading || success}
                            >
                                {loading ? <span className="spinner-small"></span> : 'CREATE ACCOUNT'}
                            </button>
                        </div>
                    </form>

                    <p className="signup-login-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
