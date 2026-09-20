import { useContext, useEffect, useState } from 'react';
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
import api from '../../services/api';

import './TopNavbar.css';

const TopNavbar = ({ toggleSidebar, theme, toggleTheme }) => {

    const { user, logout } = useContext(AuthContext);
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoUserId, setPhotoUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const loadPhoto = async () => {
            if (!user?.id) return;

            try {
                const response = await api.get('/profile/photo', {
                    params: { user: user.id, v: Date.now() },
                    responseType: 'blob',
                });
                const nextUrl = URL.createObjectURL(response.data);
                if (active) {
                    setPhotoUrl(previousUrl => {
                        if (previousUrl) URL.revokeObjectURL(previousUrl);
                        return nextUrl;
                    });
                    setPhotoUserId(user.id);
                } else {
                    URL.revokeObjectURL(nextUrl);
                }
            } catch {
                if (active) setPhotoUrl(previousUrl => {
                    if (previousUrl) URL.revokeObjectURL(previousUrl);
                    return '';
                });
                setPhotoUserId(null);
            }
        };
        loadPhoto();
        window.addEventListener('unimate:profile-photo-updated', loadPhoto);
        return () => {
            active = false;
            window.removeEventListener('unimate:profile-photo-updated', loadPhoto);
            setPhotoUrl(previousUrl => {
                if (previousUrl) URL.revokeObjectURL(previousUrl);
                return '';
            });
            setPhotoUserId(null);
        };
    }, [user?.id]);

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
                        onClick={() => navigate('/dashboard/notifications')}
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
                            {photoUrl && photoUserId === user?.id ? <img src={photoUrl} alt="Profile" className="top-avatar" /> : <div className="top-avatar">{user?.name?.charAt(0) || 'U'}</div>}

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