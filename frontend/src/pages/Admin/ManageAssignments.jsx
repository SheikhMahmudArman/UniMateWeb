import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageAssignments.css';

const ManageAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [formData, setFormData] = useState({
        course_id: '',
        title: '',
        description: '',
        due_date: '',
        total_marks: 10,
        semester: '1.1',
        file: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsRes, coursesRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/courses')
            ]);
            if (assignmentsRes.data.success) setAssignments(assignmentsRes.data.data);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingAssignment(null);
        setFormData({
            course_id: '',
            title: '',
            description: '',
            due_date: new Date().toISOString().split('T')[0],
            total_marks: 10,
            semester: '1.1',
            file: null
        });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (assignment) => {
        setEditingAssignment(assignment);
        setFormData({ ...assignment, file: null });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await api.delete(`/assignments/${id}`);
                setSuccess('Assignment deleted successfully.');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete assignment.');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }
        setFormData({ ...formData, file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        if (!formData.course_id || !formData.title || !formData.due_date) {
            setError('Course, Title, and Due Date are required.');
            setUploading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('course_id', formData.course_id);
            data.append('title', formData.title);
            data.append('description', formData.description || '');
            data.append('due_date', formData.due_date);
            data.append('total_marks', formData.total_marks);
            data.append('semester', formData.semester);
            if (formData.file) data.append('file', formData.file);

            if (editingAssignment) {
                data.append('_method', 'PUT');
                await api.post(`/assignments/${editingAssignment.id}`, data);
                setSuccess('Assignment updated successfully.');
            } else {
                await api.post('/assignments', data);
                setSuccess('Assignment added successfully.');
            }
            setShowModal(false);
            fetchData();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setUploading(false);
        }
    };

    const getCourseName = (id) => {
        const course = courses.find(c => c.id === id);
        return course ? `${course.code} - ${course.name}` : 'N/A';
    };

    if (loading && assignments.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-assignments">
            <h2 className="page-title">📋 Manage Assignments</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove assignments.</p>
                <Button variant="primary" onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Assignment
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
                                <th>Title</th>
                                <th>Due Date</th>
                                <th>Total Marks</th>
                                <th>Semester</th>
                                <th>File</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment, idx) => (
                                <tr key={assignment.id}>
                                    <td>{idx + 1}</td>
                                    <td>{getCourseName(assignment.course_id)}</td>
                                    <td>{assignment.title}</td>
                                    <td>{new Date(assignment.due_date).toLocaleDateString()}</td>
                                    <td>{assignment.total_marks}</td>
                                    <td>{assignment.semester}</td>
                                    <td>
                                        {assignment.file_path ? (
                                            <a href={`/storage/${assignment.file_path}`} target="_blank" rel="noreferrer">
                                                <FontAwesomeIcon icon={faFileUpload} /> View
                                            </a>
                                        ) : 'No file'}
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(assignment)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(assignment.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingAssignment ? 'Edit Assignment' : 'Add Assignment'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Assignment Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.title} 
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Assignment 1"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={2}
                                value={formData.description} 
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description about the assignment"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={formData.due_date} 
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Marks</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={formData.total_marks} 
                                onChange={(e) => setFormData({ ...formData, total_marks: parseInt(e.target.value) || 0 })}
                                min="1"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Semester</Form.Label>
                            <Form.Select 
                                value={formData.semester} 
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            >
                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Upload File (optional)</Form.Label>
                            <Form.Control 
                                type="file" 
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.zip"
                            />
                            <small className="text-muted">Max 5MB. PDF, DOC, DOCX, ZIP allowed.</small>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageAssignments;