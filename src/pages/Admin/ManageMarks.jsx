import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ManageMarks.css';

const ManageMarks = () => {
    const [marks, setMarks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMark, setEditingMark] = useState(null);
    const [formData, setFormData] = useState({
        id: '', studentId: '', courseCode: '', semester: '1.1',
        quiz: 0, mid: 0, online: 0, final: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('admin_marks');
        if (stored) {
            setMarks(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, studentId: '2023-12345', courseCode: 'CSE 1101', semester: '1.1', quiz: 20, mid: 25, online: 8, final: 27 },
                { id: 2, studentId: '2023-12345', courseCode: 'CSE 1103', semester: '1.1', quiz: 18, mid: 22, online: 7, final: 24 },
            ];
            setMarks(initial);
            localStorage.setItem('admin_marks', JSON.stringify(initial));
        }
    }, []);

    const saveMarks = (newMarks) => {
        setMarks(newMarks);
        localStorage.setItem('admin_marks', JSON.stringify(newMarks));
    };

    const handleAdd = () => {
        setEditingMark(null);
        setFormData({ id: '', studentId: '', courseCode: '', semester: '1.1', quiz: 0, mid: 0, online: 0, final: 0 });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (mark) => {
        setEditingMark(mark);
        setFormData({ ...mark });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            const newMarks = marks.filter(m => m.id !== id);
            saveMarks(newMarks);
            setSuccess('Marks deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.studentId || !formData.courseCode) {
            setError('Student ID and Course Code are required.');
            return;
        }
        if (editingMark) {
            const updated = marks.map(m => m.id === editingMark.id ? { ...formData } : m);
            saveMarks(updated);
            setSuccess('Marks updated.');
        } else {
            const newId = marks.length ? Math.max(...marks.map(m => m.id)) + 1 : 1;
            saveMarks([...marks, { ...formData, id: newId }]);
            setSuccess('Marks added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <Container fluid className="manage-marks">
            <h2 className="page-title">✏️ Manage Marks</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove student marks.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Marks</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr><th>ID</th><th>Student</th><th>Course</th><th>Semester</th><th>Quiz</th><th>Mid</th><th>Online</th><th>Final</th><th>Total</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {marks.map(mark => {
                                const total = mark.quiz + mark.mid + mark.online + mark.final;
                                return (
                                    <tr key={mark.id}>
                                        <td>{mark.id}</td>
                                        <td>{mark.studentId}</td>
                                        <td>{mark.courseCode}</td>
                                        <td>{mark.semester}</td>
                                        <td>{mark.quiz}</td>
                                        <td>{mark.mid}</td>
                                        <td>{mark.online}</td>
                                        <td>{mark.final}</td>
                                        <td><strong>{total}</strong></td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(mark)} className="me-2">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(mark.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{editingMark ? 'Edit Marks' : 'Add Marks'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Student ID</Form.Label><Form.Control type="text" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Course Code</Form.Label><Form.Control type="text" value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Semester</Form.Label>
                            <Form.Select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })}>
                                {['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'].map(s => <option key={s} value={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Quiz (out of 30)</Form.Label><Form.Control type="number" min="0" max="30" value={formData.quiz} onChange={(e) => setFormData({ ...formData, quiz: parseInt(e.target.value) || 0 })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Mid (out of 30)</Form.Label><Form.Control type="number" min="0" max="30" value={formData.mid} onChange={(e) => setFormData({ ...formData, mid: parseInt(e.target.value) || 0 })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Online (out of 10)</Form.Label><Form.Control type="number" min="0" max="10" value={formData.online} onChange={(e) => setFormData({ ...formData, online: parseInt(e.target.value) || 0 })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Final (out of 30)</Form.Label><Form.Control type="number" min="0" max="30" value={formData.final} onChange={(e) => setFormData({ ...formData, final: parseInt(e.target.value) || 0 })} /></Form.Group>
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

export default ManageMarks;