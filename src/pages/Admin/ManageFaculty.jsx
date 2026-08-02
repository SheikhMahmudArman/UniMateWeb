import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ManageFaculty.css';

const ManageFaculty = () => {
    const [faculty, setFaculty] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [formData, setFormData] = useState({
        id: '', name: '', department: '', designation: '', email: '', room: '', consultationHours: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('admin_faculty');
        if (stored) {
            setFaculty(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, name: 'Dr. Ahmed Hasan', department: 'CSE', designation: 'Professor & Head', email: 'ahmed.hasan@austmate.edu', room: 'Room 401', consultationHours: 'Mon/Wed 2:00 PM – 4:00 PM' },
                { id: 2, name: 'Dr. Fatima Rahman', department: 'CSE', designation: 'Associate Professor', email: 'fatima.rahman@austmate.edu', room: 'Room 402', consultationHours: 'Tue/Thu 10:00 AM – 12:00 PM' },
            ];
            setFaculty(initial);
            localStorage.setItem('admin_faculty', JSON.stringify(initial));
        }
    }, []);

    const saveFaculty = (newFaculty) => {
        setFaculty(newFaculty);
        localStorage.setItem('admin_faculty', JSON.stringify(newFaculty));
    };

    const handleAdd = () => {
        setEditingFaculty(null);
        setFormData({ id: '', name: '', department: '', designation: '', email: '', room: '', consultationHours: '' });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (fac) => {
        setEditingFaculty(fac);
        setFormData({ ...fac });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            const newFaculty = faculty.filter(f => f.id !== id);
            saveFaculty(newFaculty);
            setSuccess('Faculty deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            setError('Name and Email are required.');
            return;
        }
        if (editingFaculty) {
            const updated = faculty.map(f => f.id === editingFaculty.id ? { ...formData } : f);
            saveFaculty(updated);
            setSuccess('Faculty updated.');
        } else {
            const newId = faculty.length ? Math.max(...faculty.map(f => f.id)) + 1 : 1;
            saveFaculty([...faculty, { ...formData, id: newId }]);
            setSuccess('Faculty added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Container fluid className="manage-faculty">
            <h2 className="page-title">👨‍🏫 Manage Faculty</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove faculty members.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Faculty</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Email</th><th>Room</th><th>Consultation</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {faculty.map(f => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td>{f.name}</td>
                                    <td>{f.department}</td>
                                    <td>{f.designation}</td>
                                    <td>{f.email}</td>
                                    <td>{f.room}</td>
                                    <td>{f.consultationHours}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(f)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(f.id)}>
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
                <Modal.Header closeButton><Modal.Title>{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Department</Form.Label>
                            <Form.Select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                <option value="CSE">CSE</option><option value="EEE">EEE</option><option value="ME">ME</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Designation</Form.Label><Form.Control type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Room</Form.Label><Form.Control type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Consultation Hours</Form.Label><Form.Control type="text" value={formData.consultationHours} onChange={(e) => setFormData({ ...formData, consultationHours: e.target.value })} placeholder="e.g., Mon/Wed 2-4 PM" /></Form.Group>
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

export default ManageFaculty;