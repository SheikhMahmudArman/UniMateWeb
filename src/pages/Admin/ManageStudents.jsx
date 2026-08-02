import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ManageStudents.css';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', semester: '1.1', cgpa: 0 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('admin_students');
        if (stored) {
            setStudents(JSON.parse(stored));
        } else {
            const initial = [
                { id: '2023-12345', name: 'Student User', email: 'student@austmate.com', semester: '1.1', cgpa: 3.67 },
                { id: '2023-67890', name: 'Jane Smith', email: 'jane@austmate.com', semester: '2.1', cgpa: 3.45 },
                { id: '2024-11111', name: 'Bob Johnson', email: 'bob@austmate.com', semester: '1.2', cgpa: 3.12 },
            ];
            setStudents(initial);
            localStorage.setItem('admin_students', JSON.stringify(initial));
        }
    }, []);

    const saveStudents = (newStudents) => {
        setStudents(newStudents);
        localStorage.setItem('admin_students', JSON.stringify(newStudents));
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setFormData({ id: '', name: '', email: '', semester: '1.1', cgpa: 0 });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ ...student });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm(`Are you sure you want to delete student ${id}?`)) {
            const newStudents = students.filter(s => s.id !== id);
            saveStudents(newStudents);
            setSuccess('Student deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.id || !formData.name || !formData.email) {
            setError('ID, Name, and Email are required.');
            return;
        }
        // Check duplicate ID for new student
        if (!editingStudent && students.some(s => s.id === formData.id)) {
            setError('Student ID already exists.');
            return;
        }
        if (editingStudent) {
            const updated = students.map(s => s.id === editingStudent.id ? { ...formData } : s);
            saveStudents(updated);
            setSuccess('Student updated.');
        } else {
            saveStudents([...students, { ...formData }]);
            setSuccess('Student added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Container fluid className="manage-students">
            <h2 className="page-title">👨‍🎓 Manage Students</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove students.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Student</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Email</th><th>Semester</th><th>CGPA</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.semester}</td>
                                    <td>{student.cgpa}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(student)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(student.id)}>
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
                <Modal.Header closeButton><Modal.Title>{editingStudent ? 'Edit Student' : 'Add Student'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Student ID</Form.Label><Form.Control type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} required disabled={!!editingStudent} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Semester</Form.Label>
                            <Form.Select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })}>
                                {['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'].map(s => <option key={s} value={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>CGPA</Form.Label><Form.Control type="number" min="0" max="4" step="0.01" value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })} /></Form.Group>
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

export default ManageStudents;