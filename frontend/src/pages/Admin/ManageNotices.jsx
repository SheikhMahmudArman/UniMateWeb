import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';

const ManageNotices = () => {
    const [notices, setNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', type: 'general', date: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            if (response.data.success) {
                setNotices(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingNotice(null);
        setFormData({ title: '', content: '', type: 'general', date: new Date().toISOString().split('T')[0] });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({ title: notice.title, content: notice.content, type: notice.type, date: notice.date });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await api.delete(`/notices/${id}`);
                setSuccess('Notice deleted.');
                fetchNotices();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete notice.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.title || !formData.content) {
            setError('Title and content are required.');
            setLoading(false);
            return;
        }

        try {
            if (editingNotice) {
                await api.put(`/notices/${editingNotice.id}`, formData);
                setSuccess('Notice updated.');
            } else {
                await api.post('/notices', formData);
                setSuccess('Notice added.');
            }
            setShowModal(false);
            fetchNotices();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && notices.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-notices" style={{ padding: '20px' }}>
            <h2 className="page-title">📢 Manage Notices</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove notices.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Notice</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr><th>ID</th><th>Title</th><th>Content</th><th>Date</th><th>Type</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.id}>
                                    <td>{notice.id}</td>
                                    <td>{notice.title}</td>
                                    <td>{notice.content.substring(0, 50)}...</td>
                                    <td>{new Date(notice.date).toLocaleDateString()}</td>
                                    <td>{notice.type}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(notice)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(notice.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{editingNotice ? 'Edit Notice' : 'Add Notice'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Content</Form.Label><Form.Control as="textarea" rows={3} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Date</Form.Label><Form.Control type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Type</Form.Label>
                            <Form.Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="general">General</option>
                                <option value="exam">Exam</option>
                                <option value="event">Event</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageNotices;