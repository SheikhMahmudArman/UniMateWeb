import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageStudents.css';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', semester: '1.1', cgpa: 0 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setFormData({ id: '', name: '', email: '', semester: '1.1', cgpa: 0 });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ id: student.student_id, name: student.name, email: student.email, semester: student.semester, cgpa: student.cgpa });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete student ${id}?`)) {
            try {
                await api.delete(`/students/${id}`);
                setSuccess('Student deleted.');
                fetchStudents();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete student.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.id || !formData.name || !formData.email) {
            setError('ID, Name, and Email are required.');
            setLoading(false);
            return;
        }

        try {
            if (editingStudent) {
                await api.put(`/students/${editingStudent.id}`, {
                    student_id: formData.id,
                    name: formData.name,
                    email: formData.email,
                    semester: formData.semester,
                    cgpa: formData.cgpa,
                });
                setSuccess('Student updated.');
            } else {
                await api.post('/students', {
                    student_id: formData.id,
                    name: formData.name,
                    email: formData.email,
                    semester: formData.semester,
                    cgpa: formData.cgpa,
                });
                setSuccess('Student added.');
            }
            setShowModal(false);
            fetchStudents();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && students.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

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
                                    <td>{student.student_id}</td>
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
                        <Form.Group className="mb-3"><Form.Label>Student ID</Form.Label><Form.Control type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} required /></Form.Group>
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
                        <Button variant="primary" type="submit" disabled={loading}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageStudents;