import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './LoginPage.css';

const LoginPage = () => {
    const [studentId, setStudentId] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!studentId || !gmail || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (!gmail.includes('@')) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        // Mock authentication
        setTimeout(() => {
            // Student credentials
            if (
                studentId === '2023-12345' &&
                gmail === 'student@austmate.com' &&
                password === 'student123'
            ) {
                const user = {
                    id: studentId,
                    email: gmail,
                    name: 'Student User',
                    role: 'student',
                };
                login(user);
                navigate('/dashboard');
                return;
            }

            // Editor credentials
            if (
                studentId === '2023-99999' &&
                gmail === 'editor@austmate.com' &&
                password === 'editor123'
            ) {
                const user = {
                    id: studentId,
                    email: gmail,
                    name: 'Editor User',
                    role: 'editor',
                };
                login(user);
                navigate('/dashboard');
                return;
            }

            setError('Invalid credentials. Please try again.');
            setLoading(false);
        }, 800);
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} lg={5} xl={4}>
                        <Card className="login-card shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                {/* Logo */}
                                <div className="text-center mb-4">
                                    <img src={logo} alt="AUSTMATE" className="login-logo" />
                                    <h1 className="login-brand">AUSTMATE</h1>
                                    <p className="text-muted">Your Ultimate Academic Partner</p>
                                </div>

                                <h5 className="text-center mb-4">Welcome Back!</h5>

                                {error && (
                                    <Alert variant="danger" className="text-center">
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Student ID</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g., 2023-12345"
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                className="ps-5"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                            <Form.Control
                                                type="email"
                                                placeholder="student@austmate.com"
                                                value={gmail}
                                                onChange={(e) => setGmail(e.target.value)}
                                                className="ps-5"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                                            <Form.Control
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="ps-5"
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Form.Check
                                            type="checkbox"
                                            label="Remember Me"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <Link to="#" className="text-decoration-none small">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-100 btn-login"
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="text-decoration-none">
                                            Sign Up
                                        </Link>
                                    </small>
                                </div>
                                <div className="text-center mt-4">
                                    <Link to="/" className="text-decoration-none">
                                        ← Back to Home
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;