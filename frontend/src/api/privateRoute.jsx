
import { useAuth } from '../context/auth/useAuth';
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();  // ← use the custom hook
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
