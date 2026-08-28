import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageAttendance.css';

const ManageAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        course_id: '',
        date: '',
        semester: '1.1',
        attendance: []
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
            const [attendanceRes, studentsRes, coursesRes] = await Promise.all([
                api.get('/attendance'),
                api.get('/students'),
                api.get('/courses')
            ]);
            if (attendanceRes.data.success) setAttendanceRecords(attendanceRes.data.data);
            if (studentsRes.data.success) setStudents(studentsRes.data.data);
            if (coursesRes.data.success) setCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRecord(null);
        setFormData({
            course_id: '',
            date: new Date().toISOString().split('T')[0],
            semester: '1.1',
            attendance: students.map(s => ({ student_id: s.id, present: false }))
        });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormData({
            course_id: record.course_id,
            date: record.date,
            semester: record.semester,
            attendance: students.map(s => ({
                student_id: s.id,
                present: record.attendance?.some(a => a.student_id === s.id && a.present) || false
            }))
        });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this attendance record?')) {
            try {
                await api.delete(`/attendance/${id}`);
                setSuccess('Attendance record deleted successfully.');
                fetchData();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete attendance record.');
            }
        }
    };

    const handleAttendanceChange = (studentId, present) => {
        setFormData({
            ...formData,
            attendance: formData.attendance.map(a => 
                a.student_id === studentId ? { ...a, present } : a
            )
        });
    };

    const handleSelectAll = (present) => {
        setFormData({
            ...formData,
            attendance: formData.attendance.map(a => ({ ...a, present }))
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.course_id || !formData.date) {
            setError('Course and Date are required.');
            setLoading(false);
            return;
        }

        // Check if any attendance is marked
        const hasAttendance = formData.attendance.some(a => a.present);
        if (!hasAttendance) {
            setError('Please mark attendance for at least one student.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                course_id: parseInt(formData.course_id),
                date: formData.date,
                semester: formData.semester,
                attendance: formData.attendance.filter(a => a.present)
            };

            if (editingRecord) {
                await api.put(`/attendance/${editingRecord.id}`, payload);
                setSuccess('Attendance updated successfully.');
            } else {
                await api.post('/attendance', payload);
                setSuccess('Attendance saved successfully.');
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

    const getStudentName = (id) => {
        const student = students.find(s => s.id === id);
        return student ? student.name : 'N/A';
    };

    if (loading && attendanceRecords.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-attendance">
            <h2 className="page-title">✅ Manage Attendance</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Record and manage student attendance.</p>
                <Button variant="primary" onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Take Attendance
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
                                <th>Date</th>
                                <th>Semester</th>
                                <th>Present</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record, idx) => {
                                const presentCount = record.attendance?.filter(a => a.present).length || 0;
                                const totalCount = students.length;
                                return (
                                    <tr key={record.id}>
                                        <td>{idx + 1}</td>
                                        <td>{getCourseName(record.course_id)}</td>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>{record.semester}</td>
                                        <td><span className="text-success">{presentCount}</span></td>
                                        <td>{totalCount}</td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" onClick={() => handleEdit(record)} className="me-2">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(record.id)}>
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

            {/* Add/Edit Attendance Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingRecord ? 'Edit Attendance' : 'Take Attendance'}</Modal.Title>
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
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={formData.date} 
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Semester</Form.Label>
                            <Form.Select 
                                value={formData.semester} 
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            >
                                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                        
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Student Attendance</h6>
                            <div>
                                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleSelectAll(true)}>
                                    <FontAwesomeIcon icon={faCheck} className="me-1" /> All Present
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleSelectAll(false)}>
                                    <FontAwesomeIcon icon={faTimes} className="me-1" /> All Absent
                                </Button>
                            </div>
                        </div>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Present</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.attendance.map((item) => (
                                        <tr key={item.student_id}>
                                            <td>{students.find(s => s.id === item.student_id)?.student_id || 'N/A'}</td>
                                            <td>{getStudentName(item.student_id)}</td>
                                            <td>
                                                <Button 
                                                    variant={item.present ? 'success' : 'secondary'} 
                                                    size="sm"
                                                    onClick={() => handleAttendanceChange(item.student_id, !item.present)}
                                                >
                                                    <FontAwesomeIcon icon={item.present ? faCheck : faTimes} />
                                                    {item.present ? ' Present' : ' Absent'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Attendance'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageAttendance;