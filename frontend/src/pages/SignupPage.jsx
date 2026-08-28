import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faEnvelope, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './SignupPage.css';

const SignupPage = () => {
    const [studentId, setStudentId] = useState('');
    const [fullName, setFullName] = useState('');
    const [gmail, setGmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!studentId || !fullName || !gmail || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (studentId.length < 5) {
            setError('Student ID must be at least 5 characters.');
            setLoading(false);
            return;
        }

        if (!gmail.includes('@') || !gmail.includes('.')) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        const result = await register({
            student_id: studentId,
            name: fullName,
            email: gmail,
            password: password,
        });

        if (result.success) {
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            setError(result.error || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="signup-card shadow-lg">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <img src={logo} alt="AUSTMATE" className="signup-logo" />
                                    <h1 className="signup-brand">AUSTMATE</h1>
                                    <p className="text-muted">Create Your Account</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="text-center">
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success" className="text-center">
                                        {success}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Full Name</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <Form.Control
                                                type="text"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="ps-5"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Student ID</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faIdCard} className="input-icon" />
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
                                                placeholder="Min 6 characters"
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

                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <div className="input-icon-wrapper">
                                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="ps-5"
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="w-100 btn-signup"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-decoration-none">
                                            Login here
                                        </Link>
                                    </small>
                                </div>

                                <div className="text-center mt-3">
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

export default SignupPage;