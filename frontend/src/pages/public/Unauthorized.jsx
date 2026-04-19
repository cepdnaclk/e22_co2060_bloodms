import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth';
import { getRoleConfig } from '../../config/roleConfig';
import { ShieldAlert } from 'lucide-react';
import './Unauthorized.css';

const Unauthorized = () => {
    const { user, isAuthenticated } = useAuth();
    const roleConfig = isAuthenticated ? getRoleConfig(user?.role) : null;

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-card">
                <div className="unauthorized-icon">
                    <ShieldAlert size={56} />
                </div>
                <h1>Access Denied</h1>
                <p className="unauthorized-message">
                    You don't have permission to access this page.
                    {user?.role && (
                        <span> Your current role is <strong>{roleConfig?.label || user.role}</strong>.</span>
                    )}
                </p>
                <div className="unauthorized-actions">
                    {isAuthenticated && roleConfig ? (
                        <Link to={roleConfig.dashboard} className="btn-go-dashboard">
                            Go to My Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="btn-go-dashboard">
                            Login
                        </Link>
                    )}
                    <Link to="/" className="btn-go-home">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
