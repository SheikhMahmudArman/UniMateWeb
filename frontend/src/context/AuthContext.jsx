import { createContext, useCallback, useEffect, useState } from 'react';
import api from '../services/api';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateUser = data => {
        setUser(data);
        if (data) localStorage.setItem('user', JSON.stringify(data));
        else localStorage.removeItem('user');
    };
    useEffect(() => {
        let active = true;
        const clear = () => updateUser(null);
        window.addEventListener('unimate:logout', clear);
        const restore = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const { data } = await api.get('/user');
                    if (active) updateUser(data.user);
                }
            } catch { if (active) setUser(null); }
            finally { if (active) setLoading(false); }
        };
        restore();
        return () => { active = false; window.removeEventListener('unimate:logout', clear); };
    }, []);
    const authenticate = async (path, payload) => {
        // Never let a previous account remain active while a new account is
        // being authenticated on this device.
        localStorage.removeItem('token');
        updateUser(null);
        try {
            const { data } = await api.post(path, payload);
            localStorage.setItem('token', data.token);
            updateUser(data.user);
            return { success: true, role: data.user.role };
        } catch (error) {
            return { success: false, error: Object.values(error.response?.data?.errors || {}).flat()[0] || error.response?.data?.message || 'Cannot reach server. Please try again.' };
        }
    };
    const authenticateWithGoogleToken = useCallback(token => {
        localStorage.removeItem('token');
        updateUser(null);
        localStorage.setItem('token', token);
        return api.get('/user').then(({ data }) => {
            updateUser(data.user);
            return { success: true, role: data.user.role };
        }).catch(() => {
            localStorage.removeItem('token');
            return { success: false, error: 'Google sign-in could not be completed.' };
        });
    }, []);
    const logout = async () => {
        try { await api.post('/logout'); }
        catch { /* Clear this browser even when the server cannot be reached. */ }
        finally { localStorage.removeItem('token'); updateUser(null); }
    };
    return <AuthContext.Provider value={{ user, loading, updateUser, login: (email, password) => authenticate('/login', { email, password }), loginWithGoogleToken: authenticateWithGoogleToken, register: data => authenticate('/register', data), logout }}>{children}</AuthContext.Provider>;
};
