import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faGraduationCap, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './ManageCGPA.css';

const ManageCGPA = () => {
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [cgpaData, setCgpaData] = useState({ cgpa: 0, credits_completed: 0 });
    const [editingCgpa, setEditingCgpa] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setCgpaData({
            cgpa: student.cgpa || 0,
            credits_completed: student.credits_completed || 0
        });
        setEditingCgpa(false);
        setError('');
        setSuccess('');
    };

    const handleEditCgpa = () => {
        setEditingCgpa(true);
        setError('');
        setSuccess('');
    };

    const handleSaveCgpa = async () => {
        setSaving(true);
        setError('');

        if (!selectedStudent) {
            setError('No student selected.');
            setSaving(false);
            return;
        }

        try {
            await api.put(`/students/${selectedStudent.id}`, {
                ...selectedStudent,
                cgpa: cgpaData.cgpa,
                credits_completed: cgpaData.credits_completed
            });
            setSuccess('CGPA updated successfully.');
            setEditingCgpa(false);
            // Update the students list
            await fetchStudents();
            // Update selected student
            const updated = students.find(s => s.id === selectedStudent.id);
            if (updated) setSelectedStudent(updated);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update CGPA.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-cgpa">
            <h2 className="page-title">🎓 Student CGPA Management</h2>
            <p className="text-muted">View and update student CGPA and credits. This data is private to each student.</p>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header>
                            <h5><FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Students</h5>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {students.length === 0 ? (
                                <p className="text-muted text-center">No students found.</p>
                            ) : (
                                <div className="student-list">
                                    {students.map(student => (
                                        <div 
                                            key={student.id} 
                                            className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                                            onClick={() => handleStudentSelect(student)}
                                            style={{
                                                padding: '10px 15px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee',
                                                backgroundColor: selectedStudent?.id === student.id ? '#e3f2fd' : 'transparent',
                                                borderRadius: '4px',
                                                transition: 'background-color 0.2s'
                                            }}
                                        >
                                            <div><strong>{student.name}</strong></div>
                                            <div className="text-muted small">ID: {student.student_id} | {student.semester}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    {selectedStudent ? (
                        <Card>
                            <Card.Header>
                                <h5>Student Details: {selectedStudent.name}</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Student ID:</strong> {selectedStudent.student_id}</p>
                                        <p><strong>Email:</strong> {selectedStudent.email}</p>
                                        <p><strong>Semester:</strong> {selectedStudent.semester}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Department:</strong> {selectedStudent.department || 'N/A'}</p>
                                        <p><strong>Status:</strong> {selectedStudent.status || 'Active'}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <div className="cgpa-section">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5><FontAwesomeIcon icon={faChartLine} className="me-2" /> Academic Performance</h5>
                                        {!editingCgpa && (
                                            <Button variant="outline-primary" size="sm" onClick={handleEditCgpa}>
                                                <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                                            </Button>
                                        )}
                                    </div>
                                    {editingCgpa ? (
                                        <div className="cgpa-edit-form">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>CGPA (0.00 - 4.00)</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            min="0" 
                                                            max="4" 
                                                            step="0.01"
                                                            value={cgpaData.cgpa} 
                                                            onChange={(e) => setCgpaData({ ...cgpaData, cgpa: parseFloat(e.target.value) || 0 })}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Credits Completed</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            min="0"
                                                            value={cgpaData.credits_completed} 
                                                            onChange={(e) => setCgpaData({ ...cgpaData, credits_completed: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="secondary" className="me-2" onClick={() => {
                                                    setEditingCgpa(false);
                                                    setCgpaData({
                                                        cgpa: selectedStudent.cgpa || 0,
                                                        credits_completed: selectedStudent.credits_completed || 0
                                                    });
                                                }}>
                                                    Cancel
                                                </Button>
                                                <Button variant="primary" onClick={handleSaveCgpa} disabled={saving}>
                                                    <FontAwesomeIcon icon={faSave} className="me-2" />
                                                    {saving ? 'Saving...' : 'Save CGPA'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Row>
                                            <Col md={6}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <h1 className="display-4">{selectedStudent.cgpa || 0.00}</h1>
                                                        <p className="text-muted">Current CGPA</p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={6}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <h1 className="display-4">{selectedStudent.credits_completed || 0}</h1>
                                                        <p className="text-muted">Credits Completed</p>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}
                                    <div className="mt-3">
                                        <Alert variant="info">
                                            <small>Note: CGPA data is private and only visible to the student. Other users cannot view this information.</small>
                                        </Alert>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <FontAwesomeIcon icon={faGraduationCap} size="3x" className="text-muted mb-3" />
                                <h5 className="text-muted">Select a student from the left to view and edit CGPA</h5>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ManageCGPA;