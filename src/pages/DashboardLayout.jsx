import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import TopNavbar from '../components/Layout/TopNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState('light');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

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