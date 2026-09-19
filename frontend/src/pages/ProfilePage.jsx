import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faSave, faCamera, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        id: user?.student_id || '',
        role: user?.role || '',
        semester: '',
        cgpa: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState('');
    const [photoLoading, setPhotoLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/profile');
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    id: data.student_id || '',
                    role: data.role || '',
                    semester: data.semester || '',
                    cgpa: data.cgpa || ''
                });
                if (data.has_profile_photo) await fetchPhoto();
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPhoto = async () => {
        try {
            const response = await api.get('/profile/photo', { responseType: 'blob' });
            const nextUrl = URL.createObjectURL(response.data);
            setPhotoUrl(previousUrl => {
                if (previousUrl) URL.revokeObjectURL(previousUrl);
                return nextUrl;
            });
        } catch {
            setPhotoUrl(previousUrl => {
                if (previousUrl) URL.revokeObjectURL(previousUrl);
                return '';
            });
        }
    };

    useEffect(() => () => {
        if (photoUrl) URL.revokeObjectURL(photoUrl);
    }, [photoUrl]);

    const handlePhotoChange = async (e) => {
        const photo = e.target.files?.[0];
        if (!photo) return;
        setError('');
        setSuccess('');
        setPhotoLoading(true);
        try {
            const data = new FormData();
            data.append('photo', photo);
            await api.post('/profile/photo', data);
            await fetchPhoto();
            window.dispatchEvent(new Event('unimate:profile-photo-updated'));
            setSuccess('Profile picture updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Could not upload profile picture.');
        } finally {
            setPhotoLoading(false);
            e.target.value = '';
        }
    };

    const handlePhotoDelete = async () => {
        setPhotoLoading(true);
        setError('');
        try {
            await api.delete('/profile/photo');
            setPhotoUrl(previousUrl => {
                if (previousUrl) URL.revokeObjectURL(previousUrl);
                return '';
            });
            window.dispatchEvent(new Event('unimate:profile-photo-updated'));
            setSuccess('Profile picture removed successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Could not remove profile picture.');
        } finally {
            setPhotoLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.email) {
            setError('Name and Email are required.');
            return;
        }

        try {
            const response = await api.put('/profile', {
                name: formData.name,
                email: formData.email,
            });
            if (response.data.success) {
                setSuccess('Profile updated successfully!');
                // Update local user data
                const updatedUser = { ...user, name: formData.name, email: formData.email };
                updateUser(updatedUser);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

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

                            <div className="text-center mb-4">
                                {photoUrl ? <img src={photoUrl} alt="Profile" className="rounded-circle" style={{ width: 120, height: 120, objectFit: 'cover' }} /> : <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 120, height: 120, fontSize: 48 }}>{formData.name?.charAt(0)?.toUpperCase() || 'U'}</div>}
                                <div className="mt-3 d-flex justify-content-center gap-2">
                                    <Form.Label className="btn btn-outline-primary mb-0">
                                        <FontAwesomeIcon icon={faCamera} className="me-2" />
                                        {photoLoading ? 'Uploading...' : 'Change picture'}
                                        <Form.Control type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} hidden disabled={photoLoading} />
                                    </Form.Label>
                                    {photoUrl && <Button variant="outline-danger" onClick={handlePhotoDelete} disabled={photoLoading}><FontAwesomeIcon icon={faTrash} /></Button>}
                                </div>
                                <small className="text-muted d-block mt-2">JPG, PNG, or WebP. Maximum 2 MB.</small>
                            </div>

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

                                {formData.semester && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Current Semester</Form.Label>
                                        <Form.Control type="text" value={formData.semester} disabled readOnly />
                                    </Form.Group>
                                )}

                                {formData.cgpa && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Current CGPA</Form.Label>
                                        <Form.Control type="text" value={formData.cgpa} disabled readOnly />
                                    </Form.Group>
                                )}

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