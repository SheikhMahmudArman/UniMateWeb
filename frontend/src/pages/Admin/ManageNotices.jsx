import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageNotices = () => {
    const [notices, setNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', type: 'general' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('notices');
        if (stored) {
            setNotices(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will start from 15th August.', date: '2026-08-10', type: 'exam' },
                { id: 2, title: 'Library Renovation', content: 'The library will remain closed from 20th to 25th August.', date: '2026-08-08', type: 'general' },
            ];
            setNotices(initial);
            localStorage.setItem('notices', JSON.stringify(initial));
        }
    }, []);

    const saveNotices = (newNotices) => {
        setNotices(newNotices);
        localStorage.setItem('notices', JSON.stringify(newNotices));
    };

    const handleAdd = () => {
        setEditingNotice(null);
        setFormData({ title: '', content: '', type: 'general' });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({ title: notice.title, content: notice.content, type: notice.type });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            const newNotices = notices.filter(n => n.id !== id);
            saveNotices(newNotices);
            setSuccess('Notice deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            setError('Title and content are required.');
            return;
        }
        if (editingNotice) {
            const updated = notices.map(n => n.id === editingNotice.id ? { ...n, ...formData, date: new Date().toISOString().split('T')[0] } : n);
            saveNotices(updated);
            setSuccess('Notice updated.');
        } else {
            const newId = notices.length ? Math.max(...notices.map(n => n.id)) + 1 : 1;
            const newNotice = { id: newId, ...formData, date: new Date().toISOString().split('T')[0] };
            saveNotices([...notices, newNotice]);
            setSuccess('Notice added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

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
                        <Button variant="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageNotices;