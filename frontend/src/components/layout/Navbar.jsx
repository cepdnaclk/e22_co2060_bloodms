import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, User, ShieldAlert, LogIn, LogOut, Moon, Sun, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';
import logoIcon from '../../assets/logo-icon.png';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Highlight active link
    const navLinkClass = (path) =>
        `nav-link ${location.pathname === path ? 'active' : ''}`;

    const mobileLinkClass = (path) =>
        `mobile-link ${location.pathname === path ? 'active' : ''}`;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ─── Scroll detection ───
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ─── Toggle mobile menu ───
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        document.body.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        setMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    return (
        <>
            {/* ==================== MAIN NAVIGATION ==================== */}
            <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">

                {/* LOGO (left side) */}
                <Link to="/" className="nav-logo" onClick={closeMenu}>
                    <img src={logoIcon} alt="Logo" className="nav-logo-img" />
                    <span className="logo-text">HOPEDROP</span>
                </Link>

                {/* DESKTOP LINKS (center — hidden below 1024px) */}
                <div className="nav-links">
                    <Link to="/donor" className={navLinkClass('/donor')}>
                        <User size={16} />
                        <span>Donor</span>
                    </Link>
                    <Link to="/events" className={navLinkClass('/events')}>
                        <Calendar size={16} />
                        <span>Events</span>
                    </Link>
                    <Link to="/doctor" className={navLinkClass('/doctor')}>
                        <Activity size={16} />
                        <span>Medical</span>
                    </Link>
                    <Link to="/staff" className={navLinkClass('/staff')}>
                        <Activity size={16} />
                        <span>Lab</span>
                    </Link>
                    <Link to="/admin" className={navLinkClass('/admin')}>
                        <ShieldAlert size={16} />
                        <span>Admin</span>
                    </Link>
                    <Link to="/contact" className={navLinkClass('/contact')}>
                        <Mail size={16} />
                        <span>Contact</span>
                    </Link>
                    <Link to="/about-us" className={navLinkClass('/about-us')}>
                        <span>About Us</span>
                    </Link>
                    <Link to="/services" className={navLinkClass('/services')}>
                        <span>Services</span>
                    </Link>
                </div>

                {/* ACTIONS (right side) */}
                <div className="nav-actions">
                    {/* Dark Mode Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        aria-label="Toggle dark mode"
                    >
                        <span className={`theme-toggle-track ${theme === 'dark' ? 'dark' : ''}`}>
                            <span className="theme-toggle-thumb">
                                {theme === 'dark'
                                    ? <Moon size={12} />
                                    : <Sun size={12} />
                                }
                            </span>
                        </span>
                    </button>

                    {/* Auth Button */}
                    {isAuthenticated ? (
                        <button className="nav-cta" onClick={handleLogout}>
                            <LogOut size={16} />
                            <span className="cta-text">Logout</span>
                        </button>
                    ) : (
                        <Link to="/login" className="nav-cta" onClick={closeMenu}>
                            <LogIn size={16} />
                            <span className="cta-text">Login</span>
                        </Link>
                    )}

                    {/* SOS Button */}
                    <button className="nav-sos" title="Emergency / Disaster Mode">
                        <ShieldAlert size={16} />
                        <span>SOS</span>
                    </button>
                </div>

                {/* HAMBURGER TOGGLE (visible below 1024px) */}
                <button
                    className={`nav-menu-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                </button>
            </nav>

            {/* ==================== MOBILE FULLSCREEN MENU ==================== */}
            <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-inner">
                    <Link to="/donor" className={mobileLinkClass('/donor')} onClick={closeMenu}>
                        <User size={24} /> Donor
                    </Link>
                    <Link to="/events" className={mobileLinkClass('/events')} onClick={closeMenu}>
                        <Calendar size={24} /> Events
                    </Link>
                    <Link to="/doctor" className={mobileLinkClass('/doctor')} onClick={closeMenu}>
                        <Activity size={24} /> Medical
                    </Link>
                    <Link to="/staff" className={mobileLinkClass('/staff')} onClick={closeMenu}>
                        <Activity size={24} /> Lab
                    </Link>
                    <Link to="/admin" className={mobileLinkClass('/admin')} onClick={closeMenu}>
                        <ShieldAlert size={24} /> Admin
                    </Link>
                    <Link to="/contact" className={mobileLinkClass('/contact')} onClick={closeMenu}>
                        <Mail size={24} /> Contact
                    </Link>
                    <Link to="/about-us" className={mobileLinkClass('/about-us')} onClick={closeMenu}>
                        <span>About Us</span>
                    </Link>
                    <Link to="/services" className={mobileLinkClass('/services')} onClick={closeMenu}>
                        <span>Services</span>
                    </Link>

                    {/* Mobile auth action */}
                    <div className="mobile-menu-actions">
                        <button
                            className="mobile-theme-toggle"
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            {theme === 'dark' ? ' Light Mode' : ' Dark Mode'}
                        </button>

                        {isAuthenticated ? (
                            <button className="mobile-auth-btn" onClick={() => { handleLogout(); closeMenu(); }}>
                                <LogOut size={20} /> Logout
                            </button>
                        ) : (
                            <Link to="/login" className="mobile-auth-btn" onClick={closeMenu}>
                                <LogIn size={20} /> Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
