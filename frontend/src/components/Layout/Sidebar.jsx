import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faHouse,
    faFolderOpen,
    faCalendarCheck,
    faBullhorn,
    faCalendarAlt,
    faFlag,
    faChartSimple,
    faPercent,
    faUserGraduate,
    faBook,
    faUserGroup,
    faChalkboardUser,
    faFile,
    faPen,
    faShield,
    faChevronDown,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../../context/AuthContext';
import { menuItems } from '../../data/mockData';
import logo from '../../assets/logo.png';

import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Dropdown states
    const [openGroups, setOpenGroups] = useState({
        academic: false,
        campus: false,
        resources: false,
        administration: false
    });

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';   // forces a full page reload to landing page
    };

    const toggleGroup = (group) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const getIcon = (id) => {
        const map = {
            home: faHouse,
            'notice-board': faBullhorn,
            attendance: faCalendarCheck,
            folders: faFolderOpen,
            quiz: faCalendarCheck,
            mid: faCalendarAlt,
            final: faFlag,
            marks: faChartSimple,
            cgpa: faPercent,
            faculty: faUserGraduate,
            library: faBook,
            'admin-dashboard': faShield,
            'manage-courses': faBook,
            'manage-students': faUserGroup,
            'manage-faculty': faChalkboardUser,
            'manage-documents': faFile,
            'manage-marks': faPen,
            'manage-notices': faBullhorn,
        };

        return map[id] || faHouse;
    };

    const filteredItems = menuItems.filter(item =>
        item.roles.includes(user?.role || 'student')
    );

    // Find menu items by their existing IDs
    const getItem = (id) =>
        filteredItems.find(item => item.id === id);

    const renderLink = (item) => {
        if (!item) return null;

        return (
            <NavLink
                key={item.id}
                to={item.path}
                end={item.id === 'home'}
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FontAwesomeIcon
                    icon={getIcon(item.id)}
                    className="sidebar-icon"
                />
                <span>{item.label}</span>
            </NavLink>
        );
    };

    const renderGroup = (title, icon, groupName, itemIds) => {
        const items = itemIds
            .map(id => getItem(id))
            .filter(Boolean);

        // Don't display an empty group
        if (items.length === 0) return null;

        return (
            <div className="sidebar-group">

                <button
                    className="sidebar-group-header"
                    onClick={() => toggleGroup(groupName)}
                >
                    <span>
                        <FontAwesomeIcon
                            icon={icon}
                            className="sidebar-icon"
                        />
                        {title}
                    </span>

                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`group-arrow ${openGroups[groupName] ? 'rotated' : ''
                            }`}
                    />
                </button>

                <div
                    className={`sidebar-group-items ${openGroups[groupName] ? 'expanded' : ''
                        }`}
                >
                    {items.map(renderLink)}
                </div>

            </div>
        );
    };

    return (
        <aside
            className={`sidebar ${user?.role === 'admin' ? 'admin-sidebar' : ''
                }`}
        >

            {/* Logo */}
            <div className="sidebar-brand">
                <img
                    src={logo}
                    alt="AUSTMATE"
                    className="sidebar-logo"
                />

                <span className="sidebar-brand-text">
                    AUSTMATE
                </span>
            </div>

            <hr className="sidebar-divider" />

            <nav className="sidebar-nav">

                {/* Dashboard - standalone */}
                {renderLink(getItem('home'))}

                {/* Academic */}
                {renderGroup(
                    'Academic',
                    faChartSimple,
                    'academic',
                    [
                        'quiz',
                        'mid',
                        'final',
                        'marks',
                        'cgpa'
                    ]
                )}

                {/* Campus */}
                {renderGroup(
                    'Campus',
                    faCalendarCheck,
                    'campus',
                    [
                        'attendance',
                        'notice-board'
                    ]
                )}

                {/* Resources */}
                {renderGroup(
                    'Resources',
                    faFolderOpen,
                    'resources',
                    [
                        'folders',
                        'library'
                    ]
                )}

                {/* Administration - only appears if admin has these items */}
                {renderGroup(
                    'Administration',
                    faShield,
                    'administration',
                    [
                        'admin-dashboard',
                        'manage-courses',
                        'manage-students',
                        'manage-faculty',
                        'manage-documents',
                        'manage-marks',
                        'manage-notices'
                    ]
                )}

            </nav>

            {/* Logout */}
            <button
                className="sidebar-logout"
                onClick={handleLogout}
            >
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="sidebar-icon"
                />
                <span>Logout</span>
            </button>

        </aside>
    );
};

export default Sidebar;