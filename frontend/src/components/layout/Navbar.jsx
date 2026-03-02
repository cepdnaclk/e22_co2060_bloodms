import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, User, ShieldAlert, LogIn, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
//fggf
const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

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
                    <Heart className="brand-icon" size={28} color="var(--color-primary)" fill="var(--color-primary)" />
                    <span className="brand-text">HopeDrop</span>
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

                    <div className="navbar-actions">
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
