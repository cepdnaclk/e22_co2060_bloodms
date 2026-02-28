import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing base auth styles
import './SignUp.css';

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

    const [passwordStrength, setPasswordStrength] = useState(0); // 0-4
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalSuggestions, setHospitalSuggestions] = useState([]);

    const navigate = useNavigate();

    // Simple mock of Hospital search Auto-complete
    const handleHospitalSearch = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, hospital: value });

        if (value.length > 2) {
            setHospitalSuggestions([
                `${value} City General Hospital`,
                `${value} Medical Center`,
                `National Blood Bank - ${value}`
            ]);
        } else {
            setHospitalSuggestions([]);
        }
    };

    const selectHospital = (hospital) => {
        setFormData({ ...formData, hospital });
        setHospitalSuggestions([]);
    };

    // Password validation
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Form Validation Validation
        const { username, bloodGroup, email, password, confirmPassword } = formData;
        if (!username || !bloodGroup || !email || !password) {
            setError('Please fill all required fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // Mock API Registration
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Redirect to login after success animation
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="signup-container new-design">
            <div className="signup-split-card-new glass-panel-new">

                {/* Left Visual Section */}
                <div className="signup-visual-section-new">
                    <div className="visual-orbs">
                        <div className="orb orb-1"></div>
                        <div className="orb orb-2"></div>
                        <div className="orb orb-3"></div>
                    </div>
                    <div className="visual-content-new">
                        <h1 className="visual-title-new">Welcome</h1>
                        <p className="visual-subtitle-new">To the zone of happiness.</p>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="signup-form-section-new">
                    <div className="auth-header-new">
                        <h2>Hello! Please tell us a little<br />bit about yourself.</h2>
                    </div>

                    {error && <div className="auth-error-message">{error}</div>}

                    {success && (
                        <div className="auth-success-message">
                            <div className="success-icon-check">✓</div>
                            Account created successfully! Redirecting...
                        </div>
                    )}

                    <form className="auth-form-new" onSubmit={handleSubmit}>

                        {/* Row 1: Username & Blood Group */}
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
                                    <option value="" disabled>A+</option>
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
                                placeholder="+91"
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

                        {/* Row 4: Hospital (Acts like "Address") */}
                        <div className="form-group-new hospital-autocomplete">
                            <label>Nearest Hospital</label>
                            <input
                                type="text"
                                name="hospital"
                                placeholder="Search hospital..."
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
                                    placeholder="********"
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
                                    placeholder="********"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading || success}
                                />
                            </div>
                        </div>

                        <div className="form-actions-new">
                            <Link to="/login" className="btn-back-new">BACK</Link>
                            <button
                                type="submit"
                                className={`btn-next-new ${loading ? 'loading' : ''}`}
                                disabled={loading || success}
                            >
                                {loading ? <span className="spinner-small"></span> : 'NEXT'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
