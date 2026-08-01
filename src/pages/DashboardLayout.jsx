import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Layout/Sidebar';
import TopNavbar from '../components/Layout/TopNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { theme, changeTheme } = useTheme();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        changeTheme(newTheme);
    };

    return (
        <div className={`dashboard-layout ${theme}`}>
            <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
                <Sidebar />
            </div>
            <div className="main-wrapper">
                <TopNavbar
                    toggleSidebar={toggleSidebar}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
                <div className="content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;