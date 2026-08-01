import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <Container className="py-5 text-center">
            <h1>Login Page</h1>
            <p>This will be built in Issue #2</p>
            <Link to="/">← Back to Home</Link>
        </Container>
    );
};
export default LoginPage;