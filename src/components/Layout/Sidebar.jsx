import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse,
    faCalendarCheck,
    faCalendarAlt,
    faFlag,
    faChartSimple,
    faPercent,
    faUserGraduate,
    faGear,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Sidebar.css';

const menuItems = [
    { id: 'home', label: 'Dashboard', icon: faHouse, path: '/dashboard' },
    { id: 'quiz', label: 'Quiz', icon: faCalendarCheck, path: '/dashboard/quiz' },
    { id: 'mid', label: 'Mid', icon: faCalendarAlt, path: '/dashboard/mid' },
    { id: 'final', label: 'Final', icon: faFlag, path: '/dashboard/final' },
    { id: 'marks', label: 'Marks', icon: faChartSimple, path: '/dashboard/marks' },
    { id: 'cgpa', label: 'CGPA', icon: faPercent, path: '/dashboard/cgpa' },
    { id: 'faculty', label: 'Faculty', icon: faUserGraduate, path: '/dashboard/faculty' },
    { id: 'settings', label: 'Settings', icon: faGear, path: '/dashboard/settings' },
];

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-brand">
                <img src={logo} alt="AUSTMATE" className="sidebar-logo" />
                <span className="sidebar-brand-text">AUSTMATE</span>
            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <p className="sidebar-user-name">{user?.name || 'User'}</p>
                <small className="sidebar-user-role">{user?.role || 'Student'}</small>
            </div>

            <hr className="sidebar-divider" />

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="sidebar-icon" />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;