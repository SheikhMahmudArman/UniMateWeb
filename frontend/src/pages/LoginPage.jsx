import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './LoginPage.css';

const LoginPage = () => {
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogleToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const googleError = params.get('google_error');
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const googleToken = hashParams.get('google_token');

        if (googleError) {
            setError(googleError);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (googleToken) {
            setLoading(true);
            loginWithGoogleToken(googleToken).then(result => {
                if (result.success) navigate(result.role === 'admin' ? '/dashboard/admin' : '/dashboard');
                else setError(result.error);
                setLoading(false);
                window.history.replaceState({}, document.title, window.location.pathname);
            });
        }
    }, [loginWithGoogleToken, navigate]);

    const handleGoogleLogin = () => {
        const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
        window.location.href = `${apiBaseUrl.replace(/\/$/, '')}/auth/google/redirect`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!gmail || !password) {
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

        const result = await login(gmail, password);
        if (result.success) {
            navigate(result.role === 'admin' ? '/dashboard/admin' : '/dashboard');
        } else {
            setError(result.error || 'Invalid credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} lg={5} xl={4}>
                        <Card className="login-card shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <img src={logo} alt="AUSTMATE" className="login-logo" />
                                    <h1 className="login-brand">AUSTMATE</h1>
                                    <p className="text-muted">Your Ultimate Academic Partner</p>
                                </div>
                                <h5 className="text-center mb-4">Welcome Back!</h5>
                                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
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
                                        <span className="small text-muted">Password recovery: contact your administrator.</span>
                                    </div>
                                    <Button type="submit" className="w-100 btn-login" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </Form>
                                <div className="d-flex align-items-center gap-2 my-3">
                                    <hr className="flex-grow-1" />
                                    <small className="text-muted">OR</small>
                                    <hr className="flex-grow-1" />
                                </div>
                                <Button type="button" variant="outline-dark" className="w-100" onClick={handleGoogleLogin} disabled={loading}>
                                    <strong className="me-2">G</strong> Continue with Google
                                </Button>
                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Use your own account. Ask your administrator if you cannot sign in.
                                    </small>
                                </div>
                                <div className="text-center mt-4">
                                    <Link to="/" className="text-decoration-none">← Back to Home</Link>
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