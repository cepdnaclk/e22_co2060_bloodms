import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';          // ✅ Added: needed for API calls
import { jwtDecode } from 'jwt-decode';  // ✅ Added: needed to decode JWT tokens
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); //initialize state
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(null);  // ✅ Added: state for tokens
    const [loading, setLoading] = useState(true);

    // ✅ Fixed: Check localStorage for REAL tokens on page load
    useEffect(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (storedTokens) {
            const tokens = JSON.parse(storedTokens);
            setAuthTokens(tokens);
            setUser(jwtDecode(tokens.access));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // ✅ Fixed: login receives email & password, calls Django API
    const login = async (email, password) => {
        const response = await axios.post("http://localhost:8000/api/token", {
            email,
            password,
        });

        const tokens = response.data;               // { access: "eyJ...", refresh: "eyJ..." }
        const userData = jwtDecode(tokens.access);   // decode to get user info

        setAuthTokens(tokens);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("authTokens", JSON.stringify(tokens));

        return userData;  // return user data so Login.jsx can use it
    };

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your current session!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C62828',
            cancelButtonColor: '#637381',
            confirmButtonText: 'Yes, log me out'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsAuthenticated(false);
                setUser(null);
                setAuthTokens(null);
                localStorage.removeItem('authTokens');  // ✅ Fixed: correct key

                Swal.fire({
                    title: 'Logged Out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#C62828',
                    timer: 1500
                });
            }
        });
    };

    const value = {
        isAuthenticated,
        user,
        role: user?.role || null,   // ✅ Role from JWT for navbar & route guards
        authTokens,      // ✅ Added: expose tokens for useAxios hook
        setAuthTokens,   // ✅ Added: expose setter for useAxios hook
        setUser,         // ✅ Added: expose setter for useAxios hook
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
