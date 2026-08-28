import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageRoutine.css';

const ManageRoutine = () => {
    const [routines, setRoutines] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [formData, setFormData] = useState({
        course_id: '',
        day: 'Monday',
        start_time: '09:00',
        end_time: '10:00',
        room: '',
        semester: '1.1'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [routinesRes, coursesRes] = await Promise.all([
                api.get('/routines'),
                api.get('/courses')
            ]);
            if (routinesRes.data.success) setRoutines(routinesRes.data.data);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRoutine(null);
        setFormData({ course_id: '', day: 'Monday', start_time: '09:00', end_time: '10:00', room: '', semester: '1.1' });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (routine) => {
        setEditingRoutine(routine);
        setFormData({ ...routine });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/routines/${deleteId}`);
            setSuccess('Routine deleted successfully.');
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
            setDeleteModal(false);
        } catch (error) {
            setError('Failed to delete routine.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.course_id || !formData.day || !formData.start_time || !formData.end_time) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        try {
            if (editingRoutine) {
                await api.put(`/routines/${editingRoutine.id}`, formData);
                setSuccess('Routine updated successfully.');
            } else {
                await api.post('/routines', formData);
                setSuccess('Routine added successfully.');
            }
            setShowModal(false);
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    const getCourseName = (id) => {
        const course = courses.find(c => c.id === id);
        return course ? `${course.code} - ${course.name}` : 'N/A';
    };

    if (loading && routines.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-routine">
            <h2 className="page-title">📅 Manage Routine</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove class routines.</p>
                <Button variant="primary" onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Routine
                </Button>
            </div>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
            
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Course</th>
                                <th>Day</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Room</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routines.map((routine, idx) => (
                                <tr key={routine.id}>
                                    <td>{idx + 1}</td>
                                    <td>{getCourseName(routine.course_id)}</td>
                                    <td>{routine.day}</td>
                                    <td>{routine.start_time}</td>
                                    <td>{routine.end_time}</td>
                                    <td>{routine.room}</td>
                                    <td>{routine.semester}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(routine)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(routine.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingRoutine ? 'Edit Routine' : 'Add Routine'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course</Form.Label>
                                    <Form.Select 
                                        value={formData.course_id} 
                                        onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })} 
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Select 
                                        value={formData.semester} 
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    >
                                        {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Day</Form.Label>
                                    <Form.Select 
                                        value={formData.day} 
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        required
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Room</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={formData.room} 
                                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                        placeholder="e.g., Room 301"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control 
                                        type="time" 
                                        value={formData.start_time} 
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control 
                                        type="time" 
                                        value={formData.end_time} 
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this routine entry?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ManageRoutine;