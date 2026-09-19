import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Layout/Sidebar';
import TopNavbar from '../components/Layout/TopNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    // Sidebar is CLOSED when the page first loads
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { theme, changeTheme } = useTheme();

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        changeTheme(newTheme);
    };

    return (
        <div className={`dashboard-layout ${theme}`}>

            {/* Sidebar */}
            <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
                <Sidebar />
            </div>

            {/* Dark overlay when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                />
            )}

            {/* Main content */}
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