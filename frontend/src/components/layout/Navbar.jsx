import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, User, ShieldAlert, LogIn, LogOut, Menu, Moon, Sun, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';
import logoIcon from '../../assets/logo-icon.png';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Highlight active link
    const navLinkClass = (path) =>
        `nav-link ${location.pathname === path ? 'active' : ''}`;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img 
                        src={logoIcon} 
                        alt="Logo" 
                        className="navbar-logo-img" 
                    />
                    <span className="navbar-brand-text">
                        HOPEDROP
                    </span>
                </Link>

                <div className="navbar-links">
                    <Link to="/donor" className={navLinkClass('/donor')}>
                        <User size={18} /> Donor
                    </Link>
                    <Link to="/doctor" className={navLinkClass('/doctor')}>
                        <Activity size={18} /> Medical
                    </Link>
                    <Link to="/lab" className={navLinkClass('/lab')}>
                        <Activity size={18} /> Lab
                    </Link>
                    <Link to="/admin" className={navLinkClass('/admin')}>
                        <ShieldAlert size={18} /> Admin
                    </Link>
                    <Link to="/contact" className={navLinkClass('/contact')}>
                        <Mail size={18} /> Contact
                    </Link>

                    <div className="navbar-actions">
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
                            <span className="theme-toggle-label">
                                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                            </span>
                        </button>

                        {isAuthenticated ? (
                            <button
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={handleLogout}
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="btn btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                            >
                                <LogIn size={18} /> Login
                            </Link>
                        )}
                        <button className="btn btn-danger-pulse disaster-toggle" title="Emergency / Disaster Mode">
                            <ShieldAlert size={18} /> SOS
                        </button>
                    </div>
                </div>

                <button className="mobile-menu-btn">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
