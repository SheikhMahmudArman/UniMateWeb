import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import './TopNavbar.css';

const TopNavbar = ({ toggleSidebar, theme, toggleTheme }) => {
    return (
        <Navbar className={`top-navbar ${theme}`} expand="lg">
            <Container fluid>
                <Button
                    variant="link"
                    className="sidebar-toggle d-md-none"
                    onClick={toggleSidebar}
                >
                    ☰
                </Button>
                <Navbar.Brand className="d-md-none">AUSTMATE</Navbar.Brand>
                <div className="ms-auto d-flex align-items-center gap-3">
                    <Button variant="link" className="nav-icon-btn">
                        <FontAwesomeIcon icon={faBell} />
                    </Button>
                    <Button
                        variant="link"
                        className="nav-icon-btn"
                        onClick={toggleTheme}
                    >
                        <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                    </Button>
                </div>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;