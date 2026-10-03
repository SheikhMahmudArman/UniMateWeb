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