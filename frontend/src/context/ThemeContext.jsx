import { useState, useEffect } from 'react';
import { ThemeContext } from './theme';
function applyTheme(theme) {
    const effective = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', effective);
}
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    useEffect(() => {
        applyTheme(theme);
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const change = () => applyTheme(theme);
        media.addEventListener('change', change);
        return () => media.removeEventListener('change', change);
    }, [theme]);
    const changeTheme = value => { setTheme(value); localStorage.setItem('theme', value); };
    return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};
