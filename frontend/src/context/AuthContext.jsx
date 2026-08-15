import React, { createContext, useState, useEffect } from 'react';
import { adminCredentials, studentCredentials } from '../data/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Admin check
        if (email === adminCredentials.email && password === adminCredentials.password) {
            const userData = {
                id: adminCredentials.id,
                email: adminCredentials.email,
                name: adminCredentials.name,
                role: 'admin',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, role: 'admin' };
        }
        // Student check
        if (email === studentCredentials.email && password === studentCredentials.password) {
            const userData = {
                id: studentCredentials.id,
                email: studentCredentials.email,
                name: studentCredentials.name,
                role: 'student',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, role: 'student' };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};