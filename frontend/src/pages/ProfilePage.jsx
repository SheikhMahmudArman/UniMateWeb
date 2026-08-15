import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faSave } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        id: user?.id || '',
        role: user?.role || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email) {
            setError('Name and Email are required.');
            return;
        }

        // প্রোফাইল আপডেট করার লজিক (শুধু মক)
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser); // কনটেক্সট আপডেট
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Container fluid className="profile-page" style={{ padding: '20px' }}>
            <h2 className="page-title"><FontAwesomeIcon icon={faUser} className="me-2" /> My Profile</h2>
            <p className="text-muted">View and edit your personal information.</p>

            <Row>
                <Col md={8} lg={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label><FontAwesomeIcon icon={faIdCard} className="me-2" /> Student/Admin ID</Form.Label>
                                    <Form.Control type="text" value={formData.id} disabled readOnly />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label><FontAwesomeIcon icon={faUser} className="me-2" /> Full Name</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label><FontAwesomeIcon icon={faEnvelope} className="me-2" /> Email Address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control type="text" value={formData.role} disabled readOnly />
                                </Form.Group>

                                <Button type="submit" variant="primary" className="w-100">
                                    <FontAwesomeIcon icon={faSave} className="me-2" /> Update Profile
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;