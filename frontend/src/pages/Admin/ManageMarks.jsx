import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageMarks.css';

const ManageMarks = () => {
    const [marks, setMarks] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMark, setEditingMark] = useState(null);
    const [formData, setFormData] = useState({
        student_id: '', course_id: '', semester: '1.1',
        quiz: 0, mid: 0, online: 0, final: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [marksRes, studentsRes, coursesRes] = await Promise.all([
                api.get('/marks'),
                api.get('/students'),
                api.get('/courses'),
            ]);
            if (marksRes.data.success) setMarks(marksRes.data.data);
            if (studentsRes.data.success) setStudents(studentsRes.data.data);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingMark(null);
        setFormData({ student_id: '', course_id: '', semester: '1.1', quiz: 0, mid: 0, online: 0, final: 0 });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (mark) => {
        setEditingMark(mark);
        setFormData({ ...mark });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/marks/${id}`);
                setSuccess('Marks deleted.');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete marks.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.student_id || !formData.course_id) {
            setError('Student and Course are required.');
            setLoading(false);
            return;
        }

        try {
            if (editingMark) {
                await api.put(`/marks/${editingMark.id}`, formData);
                setSuccess('Marks updated.');
            } else {
                await api.post('/marks', formData);
                setSuccess('Marks added.');
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

    const getStudentName = (id) => {
        const student = students.find(s => s.id === id);
        return student ? student.name : 'N/A';
    };

    const getCourseCode = (id) => {
        const course = courses.find(c => c.id === id);
        return course ? course.code : 'N/A';
    };

    if (loading && marks.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

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
                                        <td>{getStudentName(mark.student_id)}</td>
                                        <td>{getCourseCode(mark.course_id)}</td>
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
                        <Form.Group className="mb-3"><Form.Label>Student</Form.Label>
                            <Form.Select value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: parseInt(e.target.value) })} required>
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Course</Form.Label>
                            <Form.Select value={formData.course_id} onChange={(e) => setFormData({ ...formData, course_id: parseInt(e.target.value) })} required>
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                            </Form.Select>
                        </Form.Group>
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
                        <Button variant="primary" type="submit" disabled={loading}>Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageMarks;