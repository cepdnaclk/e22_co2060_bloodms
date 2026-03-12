import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ROLE_OPTIONS } from '../../config/roleConfig';
import { getCountries, getDistricts, getDistrictCenter, getCountryCenter } from '../../config/locationData';
import HospitalMapPicker from '../../components/ui/HospitalMapPicker';
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

/* ── Validation helpers ── */
const VALIDATORS = {
    role:       (v) => (!v ? 'Please select a role.' : ''),
    username:   (v) => (!v ? 'Username is required.' : v.length < 3 ? 'Username must be at least 3 characters.' : ''),
    nic:        (v) => {
        if (!v) return 'NIC is required.';
        // Old format: 9 digits + V/X   |   New format: 12 digits
        if (!/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(v)) return 'Enter a valid NIC (e.g. 200012345V or 200012345678).';
        return '';
    },
    bloodGroup: (v) => (!v ? 'Blood group is required.' : ''),
    email:      (v) => {
        if (!v) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address.';
        return '';
    },
    phone:      (v) => {
        if (!v) return 'Phone number is required.';
        if (!/^(\+94|0)7[0-9]{8}$/.test(v.replace(/\s/g, ''))) return 'Enter a valid Sri Lankan number (+94XXXXXXXXX or 07XXXXXXXX).';
        return '';
    },
    country:    (v) => (!v ? 'Please select a country.' : ''),
    district:   (v) => (!v ? 'Please select a district.' : ''),
    password:   (v) => {
        if (!v) return 'Password is required.';
        if (v.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter.';
        if (!/[0-9]/.test(v)) return 'Password must contain at least one number.';
        if (!/[^A-Za-z0-9]/.test(v)) return 'Password must contain at least one special character.';
        return '';
    },
    confirmPassword: (v, form) => {
        if (!v) return 'Please confirm your password.';
        if (v !== form.password) return 'Passwords do not match.';
        return '';
    },
};

const SignUp = () => {
    const [formData, setFormData] = useState({
        role: '',
        username: '',
        nic: '',
        bloodGroup: '',
        email: '',
        phone: '',
        country: '',
        district: '',
        password: '',
        confirmPassword: '',
    });

    const [selectedHospital, setSelectedHospital] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [districts, setDistricts] = useState([]);
    const navigate = useNavigate();

    /* ── Countries list ── */
    const countries = getCountries();

    /* ── Update districts when country changes ── */
    useEffect(() => {
        if (formData.country) {
            setDistricts(getDistricts(formData.country));
            setFormData((prev) => ({ ...prev, district: '' }));
            setSelectedHospital(null);
        } else {
            setDistricts([]);
        }
    }, [formData.country]);

    /* ── Password strength meter ── */
    useEffect(() => {
        let strength = 0;
        const { password } = formData;
        if (password.length > 7) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    }, [formData.password]);

    /* ── Field change handler ── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    /* ── Blur validation ── */
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const validator = VALIDATORS[name];
        if (validator) {
            const errMsg = validator(value, formData);
            setFieldErrors((prev) => ({ ...prev, [name]: errMsg }));
        }
    };

    /* ── Full form validation ── */
    const validateAll = () => {
        const errors = {};
        Object.keys(VALIDATORS).forEach((key) => {
            const val = formData[key] || '';
            const errMsg = VALIDATORS[key](val, formData);
            if (errMsg) errors[key] = errMsg;
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /* ── Hospital selection from map ── */
    const handleSelectHospital = useCallback((hospital) => {
        setSelectedHospital(hospital);
    }, []);

    /* ── Map props ── */
    const districtCenter = formData.country && formData.district
        ? getDistrictCenter(formData.country, formData.district)
        : null;
    const countryData = formData.country ? getCountryCenter(formData.country) : { center: [7.8731, 80.7718], zoom: 8 };

    /* ── Submit ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!validateAll()) {
            const msg = 'Please fix the errors below.';
            setError(msg);
            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'warning',
                title: 'Validation Errors',
                text: msg,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                toast: true,
            });
            return;
        }

        setLoading(true);

        /* Mock API — replace with real backend call */
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            Swal.fire({
                ...swalBase,
                position: 'top-end',
                icon: 'success',
                title: 'Account Created!',
                text: `Welcome to HOPEDROP, ${formData.username}. Redirecting to login…`,
                showConfirmButton: false,
                timer: 2200,
                timerProgressBar: true,
                toast: true,
            }).then(() => {
                navigate('/login');
            });
        }, 1500);
    };

    /* ── Helper to add error class ── */
    const inputClass = (name) => (fieldErrors[name] ? 'input-error' : '');

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

                        {/* ── Role ── */}
                        <div className="form-group-new">
                            <label>I am registering as *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading || success}
                                className={`auth-select-new ${inputClass('role')}`}
                            >
                                <option value="" disabled>Select your role…</option>
                                {ROLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            {fieldErrors.role && <span className="field-error">{fieldErrors.role}</span>}
                        </div>

                        {/* ── Username + NIC ── */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={inputClass('username')}
                                />
                                {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
                            </div>
                            <div className="form-group-new half-width">
                                <label>NIC (National ID) *</label>
                                <input
                                    type="text"
                                    name="nic"
                                    placeholder="200012345V or 200012345678"
                                    value={formData.nic}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={inputClass('nic')}
                                />
                                {fieldErrors.nic && <span className="field-error">{fieldErrors.nic}</span>}
                            </div>
                        </div>

                        {/* ── Blood Group + Email ── */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Blood Group *</label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={`auth-select-new ${inputClass('bloodGroup')}`}
                                >
                                    <option value="" disabled>Select…</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                                {fieldErrors.bloodGroup && <span className="field-error">{fieldErrors.bloodGroup}</span>}
                            </div>
                            <div className="form-group-new half-width">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={inputClass('email')}
                                />
                                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                            </div>
                        </div>

                        {/* ── Phone ── */}
                        <div className="form-group-new">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="+94 77 123 4567"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading || success}
                                className={`w-50 ${inputClass('phone')}`}
                            />
                            {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
                        </div>

                        {/* ── Country + District ── */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Country *</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={`auth-select-new ${inputClass('country')}`}
                                >
                                    <option value="" disabled>Select country…</option>
                                    {countries.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
                            </div>
                            <div className="form-group-new half-width">
                                <label>District *</label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success || !formData.country}
                                    className={`auth-select-new ${inputClass('district')}`}
                                >
                                    <option value="" disabled>
                                        {formData.country ? 'Select district…' : 'Select country first'}
                                    </option>
                                    {districts.map(d => (
                                        <option key={d.name} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                                {fieldErrors.district && <span className="field-error">{fieldErrors.district}</span>}
                            </div>
                        </div>

                        {/* ── Nearest Hospital (Map Picker) ── */}
                        <div className="form-group-new">
                            <label>Nearest Hospital</label>
                            <HospitalMapPicker
                                districtName={formData.district}
                                districtCenter={districtCenter}
                                countryCenter={countryData.center}
                                countryZoom={countryData.zoom}
                                selectedHospital={selectedHospital}
                                onSelectHospital={handleSelectHospital}
                                disabled={loading || success}
                            />
                        </div>

                        {/* ── Passwords ── */}
                        <div className="form-row-new">
                            <div className="form-group-new half-width">
                                <label>Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={inputClass('password')}
                                />
                                {formData.password && (
                                    <div className="password-strength-meter">
                                        <div className={`strength-bar level-${passwordStrength}`}></div>
                                    </div>
                                )}
                                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                            </div>
                            <div className="form-group-new half-width">
                                <label>Confirm Password *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={loading || success}
                                    className={inputClass('confirmPassword')}
                                />
                                {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
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
