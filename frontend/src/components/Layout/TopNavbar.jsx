import React, { useContext } from 'react';
import { Container, Navbar, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faBell,
    faMoon,
    faSun,
    faUser,
    faUserGear,
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './TopNavbar.css';

const TopNavbar = ({ toggleSidebar, theme, toggleTheme }) => {

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    return (
        <Navbar className={`top-navbar ${theme}`}>
            <Container fluid>

                {/* Hamburger */}
                <Button
                    variant="link"
                    className="sidebar-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle navigation menu"
                >
                    ☰
                </Button>

                {/* Right side */}
                <div className="ms-auto d-flex align-items-center gap-2">

                    {/* Notifications */}
                    <Button
                        variant="link"
                        className="nav-icon-btn"
                    >
                        <FontAwesomeIcon icon={faBell} />
                    </Button>

                    {/* Theme */}
                    <Button
                        variant="link"
                        className="nav-icon-btn"
                        onClick={toggleTheme}
                    >
                        <FontAwesomeIcon
                            icon={theme === 'dark' ? faSun : faMoon}
                        />
                    </Button>

                    {/* User profile */}
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            className="profile-dropdown"
                        >
                            <div className="top-avatar">
                                {user?.name?.charAt(0) || 'U'}
                            </div>

                            <div className="top-user-info">
                                <span className="top-user-name">
                                    {user?.name || 'User'}
                                </span>

                                <span className="top-user-role">
                                    {user?.role || 'Student'}
                                </span>
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            <Dropdown.Item
                                onClick={() => navigate('/dashboard/profile')}
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="me-2"
                                />
                                Profile
                            </Dropdown.Item>

                            <Dropdown.Item
                                onClick={() => navigate('/dashboard/settings')}
                            >
                                <FontAwesomeIcon
                                    icon={faUserGear}
                                    className="me-2"
                                />
                                Settings
                            </Dropdown.Item>

                            <Dropdown.Divider />

                            <Dropdown.Item
                                onClick={handleLogout}
                            >
                                <FontAwesomeIcon
                                    icon={faRightFromBracket}
                                    className="me-2"
                                />
                                Logout
                            </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>

                </div>

            </Container>
        </Navbar>
    );
};

export default TopNavbar;