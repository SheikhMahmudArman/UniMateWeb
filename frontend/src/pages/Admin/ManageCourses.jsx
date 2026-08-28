import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageCourses.css';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', credits: 3, semester: '1.1' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCourse(null);
        setFormData({ code: '', name: '', credits: 3, semester: '1.1' });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({ code: course.code, name: course.name, credits: course.credits, semester: course.semester });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/courses/${id}`);
                setSuccess('Course deleted.');
                fetchCourses();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete course.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.code || !formData.name) {
            setError('Code and name required.');
            setLoading(false);
            return;
        }

        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse.id}`, formData);
                setSuccess('Course updated.');
            } else {
                await api.post('/courses', formData);
                setSuccess('Course added.');
            }
            setShowModal(false);
            fetchCourses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && courses.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-courses">
            <h2 className="page-title">📚 Manage Courses</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove courses.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Course</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Credits</th><th>Semester</th><th>Actions</th></tr></thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td>{course.credits}</td>
                                    <td>{course.semester}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(course)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(course.id)}>
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
                <Modal.Header closeButton><Modal.Title>{editingCourse ? 'Edit Course' : 'Add Course'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Course Code</Form.Label><Form.Control type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Course Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Credits</Form.Label><Form.Control type="number" min="1" max="4" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Semester</Form.Label>
                            <Form.Select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })}>
                                {['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'].map(s => <option key={s} value={s}>{s}</option>)}
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

export default ManageCourses;