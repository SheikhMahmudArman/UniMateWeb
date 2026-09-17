import { createContext, useEffect, useState } from 'react';
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
        const clear = () => { setUser(null); };
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
        try {
            const { data } = await api.post(path, payload);
            localStorage.setItem('token', data.token);
            updateUser(data.user);
            return { success: true, role: data.user.role };
        } catch (error) {
            return { success: false, error: Object.values(error.response?.data?.errors || {}).flat()[0] || error.response?.data?.message || 'Cannot reach server. Please try again.' };
        }
    };
    const logout = async () => {
        try { await api.post('/logout'); }
        catch { /* Clear this browser even when the server cannot be reached. */ }
        finally { localStorage.removeItem('token'); updateUser(null); }
    };
    return <AuthContext.Provider value={{ user, loading, updateUser, login: (email, password) => authenticate('/login', { email, password }), register: data => authenticate('/register', data), logout }}>{children}</AuthContext.Provider>;
};
