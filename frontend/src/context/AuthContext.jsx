import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for dummy auth state on load
        const token = localStorage.getItem('hopedrop_token');
        if (token) {
            setIsAuthenticated(true);
            setUser(JSON.parse(localStorage.getItem('hopedrop_user')));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('hopedrop_token', 'dummy-token');
        localStorage.setItem('hopedrop_user', JSON.stringify(userData));
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
                localStorage.removeItem('hopedrop_token');
                localStorage.removeItem('hopedrop_user');

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
