import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Activity, User, ShieldAlert, LogIn, LogOut, Moon, Sun, Mail, Calendar, ClipboardList, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/auth/useAuth';
import { useTheme } from '../../context/theme/ThemeContext';
import { getRoleConfig, PUBLIC_NAV_ITEMS, ICON_MAP } from '../../config/roleConfig';
import './Navbar.css';
import { LOGOS } from '../../config/imageAssets';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, role, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // ─── Build nav items based on role ───
    const roleConfig = isAuthenticated ? getRoleConfig(role) : null;
    const roleNavItems = roleConfig ? roleConfig.navItems : [];

    // Highlight active link
    const navLinkClass = (path) =>
        `nav-link ${location.pathname === path ? 'active' : ''}`;

    const sidebarLinkClass = (path) =>
        `sidebar-link ${location.pathname === path ? 'active' : ''}`;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ─── Scroll detection ───
    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
            if (window.scrollY > 50) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial check in case loaded scrolled down
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ─── Toggle sidebar menu ───
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
        document.body.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        setMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    /** Render a nav icon by its string name from roleConfig */
    const renderIcon = (iconName, size = 16) => {
        const IconComponent = ICON_MAP[iconName];
        return IconComponent ? <IconComponent size={size} /> : null;
    };

    const isHomePage = location.pathname === '/';

    return (
        <>
            {/* ==================== MAIN NAVIGATION ==================== */}
            <nav className={`nav ${scrolled ? 'scrolled' : ''} ${isHomePage ? 'on-home' : ''}`} id="nav">

                {/* LOGO (left side) */}
                <Link to="/" className="nav-logo nav-logo-home">
                    <img src={LOGOS.icon} alt="HOPEDROP Logo" className="nav-logo-img" />
                    <span className="logo-text">HOPEDROP</span>
                </Link>

                {/* DESKTOP LINKS (center — hidden below 1024px) */}
                <div className="nav-links">
                    {/* Role-specific links (only when logged in) */}
                    {isAuthenticated && roleNavItems.map((item) => (
                        <Link key={item.path} to={item.path} className={`${navLinkClass(item.path)} nav-link-home`}>
                            {renderIcon(item.icon)}
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    {/* Public links (always visible) */}
                    {PUBLIC_NAV_ITEMS.map((item) => (
                        <Link key={item.path} to={item.path} className={`${navLinkClass(item.path)} nav-link-home`}>
                            {item.icon && renderIcon(item.icon)}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* ACTIONS (right side) */}
                <div className="nav-actions">
                    {/* Dark Mode Toggle */}
                    <button
                        className="theme-toggle-btn nav-theme-btn-home"
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

                    {/* Desktop Auth Button (Hidden on Mobile) */}
                    <div className="desktop-actions-only">
                        {isAuthenticated ? (
                            <button className="nav-cta" onClick={handleLogout}>
                                <LogOut size={16} />
                                <span className="cta-text">Logout</span>
                            </button>
                        ) : (
                            <Link to="/login" className="nav-cta">
                                <LogIn size={16} />
                                <span className="cta-text">Login</span>
                            </Link>
                        )}
                    </div>

                    {/* HAMBURGER TOGGLE (visible below 1024px) */}
                    <button
                        className={`nav-menu-toggle ${menuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                    </button>
                </div>
            </nav>

            {/* ==================== GLASSMORPHIC SIDEBAR (MOBILE) ==================== */}
            <div className={`sidebar-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
            <aside className={`glass-sidebar ${menuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="nav-logo" onClick={closeMenu}>
                        <img src={LOGOS.icon} alt="HOPEDROP Logo" className="nav-logo-img" />
                        <span className="logo-text">HOPEDROP</span>
                    </Link>
                    <button className="sidebar-close-btn" onClick={closeMenu}>
                        &times;
                    </button>
                </div>

                <div className="sidebar-content">
                    {/* Role-specific links */}
                    {isAuthenticated && roleNavItems.map((item) => (
                        <Link key={`side-${item.path}`} to={item.path} className={sidebarLinkClass(item.path)} onClick={closeMenu}>
                            <div className="sidebar-icon-wrapper">{renderIcon(item.icon, 20)}</div>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    ))}
                    
                    {/* Public links */}
                    {PUBLIC_NAV_ITEMS.map((item) => (
                        <Link key={`side-${item.path}`} to={item.path} className={sidebarLinkClass(item.path)} onClick={closeMenu}>
                            <div className="sidebar-icon-wrapper">{renderIcon(item.icon, 20)}</div>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <button className="sidebar-theme-toggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    {isAuthenticated ? (
                        <button className="sidebar-auth-btn log-out" onClick={() => { handleLogout(); closeMenu(); }}>
                            <LogOut size={18} /> <span>Logout</span>
                        </button>
                    ) : (
                        <Link to="/login" className="sidebar-auth-btn log-in" onClick={closeMenu}>
                            <LogIn size={18} /> <span>Login</span>
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Navbar;
