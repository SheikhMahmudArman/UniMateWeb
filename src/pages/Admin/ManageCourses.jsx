import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ManageCourses.css';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', credits: 3 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('admin_courses');
        if (stored) {
            setCourses(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, code: 'CSE 1101', name: 'Intro to Programming', credits: 3 },
                { id: 2, code: 'CSE 1103', name: 'Discrete Math', credits: 3 },
            ];
            setCourses(initial);
            localStorage.setItem('admin_courses', JSON.stringify(initial));
        }
    }, []);

    const saveCourses = (newCourses) => {
        setCourses(newCourses);
        localStorage.setItem('admin_courses', JSON.stringify(newCourses));
    };

    const handleAdd = () => {
        setEditingCourse(null);
        setFormData({ code: '', name: '', credits: 3 });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({ code: course.code, name: course.name, credits: course.credits });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            const newCourses = courses.filter(c => c.id !== id);
            saveCourses(newCourses);
            setSuccess('Course deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.code || !formData.name) {
            setError('Code and name required.');
            return;
        }
        if (editingCourse) {
            const updated = courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c);
            saveCourses(updated);
            setSuccess('Course updated.');
        } else {
            const newId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
            saveCourses([...courses, { id: newId, ...formData }]);
            setSuccess('Course added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

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
                        <thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Credits</th><th>Actions</th></tr></thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td>{course.credits}</td>
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

export default ManageCourses;