import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.success) {
                const { token, user: userData } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(userData);
                return { success: true, role: userData.role };
            }
            return { success: false, error: 'Login failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid credentials'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData);
            if (response.data.success) {
                const { token, user: userData } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setUser(userData);
                return { success: true };
            }
            return { success: false, error: 'Registration failed' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};