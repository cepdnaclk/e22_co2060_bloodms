import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { AuthContext } from './auth/AuthContext';

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
    });

    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (!storedTokens) {
            return null;
        }

        try {
            const tokens = JSON.parse(storedTokens);
            return tokens?.access ? jwtDecode(tokens.access) : null;
        } catch {
            localStorage.removeItem('authTokens');
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem('authTokens')),
    );

    const [loading] = useState(false);

    const login = async (identifier, password) => {
        const response = await axios.post('http://localhost:8000/api/v1/auth/token/', {
            email: identifier,
            password,
        });

        const tokens = response.data;
        const userData = jwtDecode(tokens.access);

        setAuthTokens(tokens);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('authTokens', JSON.stringify(tokens));

        return userData;
    };

    const logout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your current session!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C62828',
            cancelButtonColor: '#637381',
            confirmButtonText: 'Yes, log me out',
        }).then((result) => {
            if (result.isConfirmed) {
                setIsAuthenticated(false);
                setUser(null);
                setAuthTokens(null);
                localStorage.removeItem('authTokens');

                Swal.fire({
                    title: 'Logged Out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    confirmButtonColor: '#C62828',
                    timer: 1500,
                });
            }
        });
    };

    const value = {
        isAuthenticated,
        user,
        role: user?.role || null,
        authTokens,
        setAuthTokens,
        setUser,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
