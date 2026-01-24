import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/auth/me');
            const userData = response.data.user;
            
            // Only allow admin and editor roles
            if (userData.role === 'admin' || userData.role === 'editor') {
                setUser(userData);
            } else {
                console.warn('User does not have admin/editor role:', userData.role);
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user: userData } = response.data;
            
            // Only allow admin and editor roles
            if (userData.role !== 'admin' && userData.role !== 'editor') {
                throw new Error('Access denied. Admin or editor account required.');
            }
            
            localStorage.setItem('token', token);
            setUser(userData);
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || err.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
