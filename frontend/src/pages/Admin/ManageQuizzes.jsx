import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageQuizzes.css';

const ManageQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [formData, setFormData] = useState({
        course_id: '',
        title: '',
        description: '',
        date: '',
        total_marks: 10,
        duration: 30,
        semester: '1.1'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [quizzesRes, coursesRes] = await Promise.all([
                api.get('/quizzes'),
                api.get('/courses')
            ]);
            if (quizzesRes.data.success) setQuizzes(quizzesRes.data.data);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingQuiz(null);
        setFormData({
            course_id: '',
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            total_marks: 10,
            duration: 30,
            semester: '1.1'
        });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);
        setFormData({ ...quiz });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await api.delete(`/quizzes/${id}`);
                setSuccess('Quiz deleted successfully.');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete quiz.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.course_id || !formData.title || !formData.date) {
            setError('Course, Title, and Date are required.');
            setLoading(false);
            return;
        }

        try {
            if (editingQuiz) {
                await api.put(`/quizzes/${editingQuiz.id}`, formData);
                setSuccess('Quiz updated successfully.');
            } else {
                await api.post('/quizzes', formData);
                setSuccess('Quiz added successfully.');
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

    if (loading && quizzes.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-quizzes">
            <h2 className="page-title">📝 Manage Quizzes</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove quizzes.</p>
                <Button variant="primary" onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Quiz
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
                                <th>Date</th>
                                <th>Total Marks</th>
                                <th>Duration (min)</th>
                                <th>Semester</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz, idx) => (
                                <tr key={quiz.id}>
                                    <td>{idx + 1}</td>
                                    <td>{getCourseName(quiz.course_id)}</td>
                                    <td>{quiz.title}</td>
                                    <td>{new Date(quiz.date).toLocaleDateString()}</td>
                                    <td>{quiz.total_marks}</td>
                                    <td>{quiz.duration}</td>
                                    <td>{quiz.semester}</td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(quiz)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(quiz.id)}>
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
                    <Modal.Title>{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</Modal.Title>
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
                            <Form.Label>Quiz Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.title} 
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Quiz 1"
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
                                placeholder="Brief description about the quiz"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={formData.date} 
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={formData.duration} 
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                min="5"
                                max="180"
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageQuizzes;