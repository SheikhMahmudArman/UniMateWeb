import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBook,
    faArrowLeft,
    faPlus,
    faEdit,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageCourses.css';

const semesters = [
    { id: '1.1', year: 'Year 1', semester: 'Semester 1' },
    { id: '1.2', year: 'Year 1', semester: 'Semester 2' },
    { id: '2.1', year: 'Year 2', semester: 'Semester 1' },
    { id: '2.2', year: 'Year 2', semester: 'Semester 2' },
    { id: '3.1', year: 'Year 3', semester: 'Semester 1' },
    { id: '3.2', year: 'Year 3', semester: 'Semester 2' },
    { id: '4.1', year: 'Year 4', semester: 'Semester 1' },
    { id: '4.2', year: 'Year 4', semester: 'Semester 2' },
];

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: 3,
        semester: '1.1',
        hours_per_week: '',
        prerequisite: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedSemester) {
            fetchCourses(selectedSemester);
        }
    }, [selectedSemester]);

    const fetchCourses = async (semester) => {
        setLoading(true);

        try {
            const response = await api.get(`/courses?semester=${semester}`);

            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses.');
        } finally {
            setLoading(false);
        }
    };

    const handleSemesterClick = (semester) => {
        setError('');
        setSuccess('');
        setSelectedSemester(semester);
    };

    const handleBack = () => {
        setSelectedSemester(null);
        setCourses([]);
        setError('');
        setSuccess('');
    };

    const handleAdd = () => {
        setEditingCourse(null);

        setFormData({
            code: '',
            name: '',
            credits: 3,
            semester: selectedSemester || '1.1',
            hours_per_week: '',
            prerequisite: ''
        });

        setError('');
        setShowModal(true);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);

        setFormData({
            code: course.code || '',
            name: course.name || '',
            credits: course.credits || '',
            semester: course.semester || selectedSemester,
            hours_per_week: course.hours_per_week || '',
            prerequisite: course.prerequisite || ''
        });

        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) {
            return;
        }

        try {
            await api.delete(`/courses/${id}`);

            setSuccess('Course deleted successfully.');
            fetchCourses(selectedSemester);

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('Failed to delete course.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        if (!formData.code || !formData.name) {
            setError('Course code and name are required.');
            setLoading(false);
            return;
        }

        try {
            const data = {
                ...formData,
                credits: parseFloat(formData.credits)
            };

            if (editingCourse) {
                await api.put(`/courses/${editingCourse.id}`, data);
                setSuccess('Course updated successfully.');
            } else {
                await api.post('/courses', data);
                setSuccess('Course added successfully.');
            }

            setShowModal(false);

            fetchCourses(selectedSemester);

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Operation failed.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================
    // SEMESTER FOLDER VIEW
    // ============================

    if (!selectedSemester) {
        return (
            <Container fluid className="manage-courses">
                <h2 className="page-title">📚 Manage Courses</h2>

                <p className="text-muted">
                    Select a semester to view its course information.
                </p>

                <Row className="mt-4">
                    {semesters.map((item) => (
                        <Col
                            key={item.id}
                            md={6}
                            lg={3}
                            className="mb-4"
                        >
                            <Card
                                className="semester-card"
                                onClick={() => handleSemesterClick(item.id)}
                            >
                                <Card.Body className="text-center">
                                    <FontAwesomeIcon
                                        icon={faBook}
                                        className="semester-icon"
                                    />

                                    <h3>{item.id}</h3>

                                    <p className="semester-year">
                                        {item.year}
                                    </p>

                                    <p className="semester-name">
                                        {item.semester}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        );
    }

    // Find selected semester information
    const semesterInfo = semesters.find(
        item => item.id === selectedSemester
    );

    // ============================
    // COURSE TABLE VIEW
    // ============================

    return (
        <Container fluid className="manage-courses">

            <div className="courses-header">
                <Button
                    variant="outline-secondary"
                    onClick={handleBack}
                    className="mb-3"
                >
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="me-2"
                    />
                    Back to Semesters
                </Button>

                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="page-title">
                            📚 {semesterInfo?.year} — {semesterInfo?.semester}
                        </h2>

                        <p className="text-muted">
                            Semester {selectedSemester} course information
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleAdd}
                    >
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="me-2"
                        />
                        Add Course
                    </Button>
                </div>
            </div>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success">
                    {success}
                </Alert>
            )}

            <Card className="course-table-card">
                <Card.Body>

                    {loading ? (
                        <div className="text-center py-5">
                            Loading courses...
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="empty-semester">
                            <FontAwesomeIcon
                                icon={faBook}
                                className="empty-icon"
                            />

                            <h5>No courses available</h5>

                            <p>
                                No course information has been added
                                for semester {selectedSemester} yet.
                            </p>
                        </div>
                    ) : (
                        <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="curriculum-table"
                        >
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Title</th>
                                    <th>Hours/Week</th>
                                    <th>Credits</th>
                                    <th>Prerequisite</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <strong>
                                                {course.code}
                                            </strong>
                                        </td>

                                        <td>
                                            {course.name}
                                        </td>

                                        <td>
                                            {course.hours_per_week || '—'}
                                        </td>

                                        <td>
                                            {course.credits}
                                        </td>

                                        <td>
                                            {course.prerequisite || '—'}
                                        </td>

                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleEdit(course)}
                                                className="me-2"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(course.id)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                </Card.Body>
            </Card>

            {/* ADD / EDIT MODAL */}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCourse
                            ? 'Edit Course'
                            : 'Add Course'}
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleSubmit}>

                    <Modal.Body>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Course Code
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                code: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Credits
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        step="0.25"
                                        min="0"
                                        max="10"
                                        value={formData.credits}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                credits: e.target.value
                                            })
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Course Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Semester
                                    </Form.Label>

                                    <Form.Select
                                        value={formData.semester}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                semester: e.target.value
                                            })
                                        }
                                    >
                                        {semesters.map(item => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.id}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Hours per Week
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 3-0 or 0-3"
                                        value={formData.hours_per_week}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                hours_per_week: e.target.value
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Prerequisite
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. CSE1101"
                                        value={formData.prerequisite}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                prerequisite: e.target.value
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal>

        </Container>
    );
};

export default ManageCourses;