import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Toast } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faDesktop, faBell, faClock, faLock, faSave } from '@fortawesome/free-solid-svg-icons';
import './SettingsPage.css';

const SettingsPage = () => {
    const { theme, changeTheme } = useTheme();
    const { notificationsEnabled, reminderTime, updateNotificationPrefs } = useNotification();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleThemeChange = (newTheme) => {
        changeTheme(newTheme);
    };

    const handleNotificationToggle = (e) => {
        updateNotificationPrefs(e.target.checked, reminderTime);
    };

    const handleReminderTimeChange = (e) => {
        updateNotificationPrefs(notificationsEnabled, e.target.value);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All password fields are required.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        // Mock success
        setPasswordSuccess('Password changed successfully! (mock)');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <Container fluid className="settings-page">
            <h2 className="page-title">⚙️ Settings</h2>
            <p className="text-muted">Customize your app experience and account settings.</p>

            {/* Theme Section */}
            <Card className="settings-card mb-4">
                <Card.Body>
                    <h5><FontAwesomeIcon icon={faMoon} className="me-2" /> Theme Preference</h5>
                    <p className="text-muted">Choose your preferred theme appearance.</p>
                    <div className="theme-options">
                        <Button
                            variant={theme === 'light' ? 'primary' : 'outline-secondary'}
                            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('light')}
                        >
                            <FontAwesomeIcon icon={faSun} className="me-2" /> Light
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'primary' : 'outline-secondary'}
                            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('dark')}
                        >
                            <FontAwesomeIcon icon={faMoon} className="me-2" /> Dark
                        </Button>
                        <Button
                            variant={theme === 'system' ? 'primary' : 'outline-secondary'}
                            className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => handleThemeChange('system')}
                        >
                            <FontAwesomeIcon icon={faDesktop} className="me-2" /> System
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {/* Notification Preferences */}
            <Card className="settings-card mb-4">
                <Card.Body>
                    <h5><FontAwesomeIcon icon={faBell} className="me-2" /> Notification Preferences</h5>
                    <p className="text-muted">Manage how and when you receive notifications.</p>
                    <Row>
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                id="notif-toggle"
                                label="Enable Notifications"
                                checked={notificationsEnabled}
                                onChange={handleNotificationToggle}
                                className="notif-switch"
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label><FontAwesomeIcon icon={faClock} className="me-2" /> Reminder Time</Form.Label>
                                <Form.Select
                                    value={reminderTime}
                                    onChange={handleReminderTimeChange}
                                    disabled={!notificationsEnabled}
                                    className="reminder-select"
                                >
                                    <option value="5">5 minutes before</option>
                                    <option value="15">15 minutes before</option>
                                    <option value="30">30 minutes before</option>
                                    <option value="60">1 hour before</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Change Password */}
            <Card className="settings-card">
                <Card.Body>
                    <h5><FontAwesomeIcon icon={faLock} className="me-2" /> Change Password</h5>
                    <p className="text-muted">Update your password to keep your account secure.</p>
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
                    <Form onSubmit={handlePasswordSubmit}>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Min 8 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" variant="primary" className="save-btn">
                            <FontAwesomeIcon icon={faSave} className="me-2" /> Update Password
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Toast for feedback */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                className="custom-toast"
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <strong className="me-auto">Success</strong>
                </Toast.Header>
                <Toast.Body>Password changed successfully!</Toast.Body>
            </Toast>
        </Container>
    );
};

export default SettingsPage;