import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHouse, faFolderOpen, faCalendarCheck, faCalendarAlt, faFlag,
    faChartSimple, faPercent, faUserGraduate, faGear, faRightFromBracket,
    faShield, faBook, faUserGroup, faChalkboardUser, faFile, faPen
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { menuItems } from '../../data/mockData';
import logo from '../../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getIcon = (id) => {
        const map = {
            home: faHouse,
            folders: faFolderOpen,
            quiz: faCalendarCheck,
            mid: faCalendarAlt,
            final: faFlag,
            marks: faChartSimple,
            cgpa: faPercent,
            faculty: faUserGraduate,
            settings: faGear,
            'admin-dashboard': faShield,
            'manage-courses': faBook,
            'manage-students': faUserGroup,
            'manage-faculty': faChalkboardUser,
            'manage-documents': faFile,
            'manage-marks': faPen,
        };
        return map[id] || faHouse;
    };

    const filteredItems = menuItems.filter(item =>
        item.roles.includes(user?.role || 'student')
    );

    return (
        <div className={`sidebar ${user?.role === 'admin' ? 'admin-sidebar' : ''}`}>
            <div className="sidebar-brand">
                <img src={logo} alt="AUSTMATE" className="sidebar-logo" />
                <span className="sidebar-brand-text">AUSTMATE</span>
            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">{user?.name?.charAt(0) || 'U'}</div>
                <p className="sidebar-user-name">{user?.name || 'User'}</p>
                <small className="sidebar-user-role">
                    {user?.role === 'admin' ? (
                        <span className="admin-badge">👑 Admin</span>
                    ) : (
                        user?.role || 'Student'
                    )}
                </small>
            </div>

            <hr className="sidebar-divider" />

            <nav className="sidebar-nav">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        end={item.id === 'home'}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <FontAwesomeIcon icon={getIcon(item.id)} className="sidebar-icon" />
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