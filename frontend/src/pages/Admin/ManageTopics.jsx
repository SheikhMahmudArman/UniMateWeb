import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faFolder, faFile, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageTopics.css';

const ManageTopics = () => {
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [formData, setFormData] = useState({
        course_id: '',
        title: '',
        description: '',
        order: 1
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, topicsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/topics')
            ]);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
            if (topicsRes.data.success) setTopics(topicsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setError('');
        setSuccess('');
    };

    const getCourseTopics = () => {
        return topics.filter(t => t.course_id === selectedCourse?.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const handleAdd = () => {
        if (!selectedCourse) {
            setError('Please select a course first.');
            return;
        }
        setEditingTopic(null);
        setFormData({
            course_id: selectedCourse.id,
            title: '',
            description: '',
            order: getCourseTopics().length + 1
        });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic);
        setFormData({ ...topic });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            try {
                await api.delete(`/topics/${id}`);
                setSuccess('Topic deleted successfully.');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete topic.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.title) {
            setError('Topic title is required.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                course_id: selectedCourse.id,
                title: formData.title,
                description: formData.description || '',
                order: formData.order || 1
            };

            if (editingTopic) {
                await api.put(`/topics/${editingTopic.id}`, payload);
                setSuccess('Topic updated successfully.');
            } else {
                await api.post('/topics', payload);
                setSuccess('Topic added successfully.');
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

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-topics">
            <h2 className="page-title">📚 Manage Topics & Progress</h2>
            <p className="text-muted">Add, edit, or remove topics for each course. Students can track their progress individually.</p>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5><FontAwesomeIcon icon={faFolder} className="me-2" /> Courses</h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {courses.length === 0 ? (
                                <p className="text-muted text-center">No courses found.</p>
                            ) : (
                                <div className="course-list">
                                    {courses.map(course => (
                                        <div 
                                            key={course.id} 
                                            className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
                                            onClick={() => handleCourseSelect(course)}
                                            style={{
                                                padding: '12px 15px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee',
                                                backgroundColor: selectedCourse?.id === course.id ? '#e3f2fd' : 'transparent',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <div><strong>{course.code}</strong> - {course.name}</div>
                                            <div className="text-muted small">
                                                {getCourseTopics().length} topics
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    {selectedCourse ? (
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5>
                                    <FontAwesomeIcon icon={faFile} className="me-2" />
                                    {selectedCourse.code} - Topics
                                </h5>
                                <Button variant="primary" size="sm" onClick={handleAdd}>
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Topic
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {getCourseTopics().length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted">No topics added yet. Click "Add Topic" to create one.</p>
                                    </div>
                                ) : (
                                    <div className="topic-list">
                                        {getCourseTopics().map((topic, idx) => (
                                            <div 
                                                key={topic.id} 
                                                className="topic-item"
                                                style={{
                                                    padding: '15px',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    marginBottom: '10px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div className="d-flex align-items-center">
                                                        <Badge bg="secondary" className="me-2">{topic.order || idx + 1}</Badge>
                                                        <h6 className="mb-1">{topic.title}</h6>
                                                    </div>
                                                    {topic.description && (
                                                        <p className="text-muted small mb-1">{topic.description}</p>
                                                    )}
                                                    <div className="text-muted small">
                                                        <FontAwesomeIcon icon={faCircle} className="me-1" style={{ color: '#6c757d' }} />
                                                        Click to track progress (student feature)
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(topic)} className="me-2">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(topic.id)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-3">
                                    <Alert variant="info">
                                        <small>
                                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                            Students can click on individual topics to mark them as completed. Progress tracking is personal to each student.
                                        </small>
                                    </Alert>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <FontAwesomeIcon icon={faFolder} size="3x" className="text-muted mb-3" />
                                <h5 className="text-muted">Select a course from the left to manage topics</h5>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Add/Edit Topic Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTopic ? 'Edit Topic' : 'Add Topic'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Topic Title</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.title} 
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Introduction to Programming"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description (optional)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={2}
                                value={formData.description} 
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the topic"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Order</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1"
                                value={formData.order} 
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            />
                            <small className="text-muted">Topics will be displayed in this order.</small>
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

export default ManageTopics;