import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './MarksPage.css';

const MarksPage = () => {
    const { user } = useContext(AuthContext);
    const [selectedSemester, setSelectedSemester] = useState('1.1');
    const [semesterData, setSemesterData] = useState({ courses: [], cgpa: 0 });
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (semesters.length > 0) {
            fetchMarks();
        }
    }, [selectedSemester]);

    const fetchSemesters = async () => {
        try {
            const response = await api.get('/semesters');
            if (response.data.success) {
                setSemesters(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedSemester(response.data.data[0].code);
                }
            }
        } catch (error) {
            console.error('Error fetching semesters:', error);
        }
    };

    const fetchMarks = async () => {
        setLoading(true);
        try {
            // Get student
            const studentResponse = await api.get('/students');
            const student = studentResponse.data.data.find(s => s.user_id === user.id);
            
            if (student) {
                const response = await api.get(`/marks?student_id=${student.id}&semester=${selectedSemester}`);
                if (response.data.success) {
                    // Process marks data
                    const marks = response.data.data;
                    const courses = marks.map(m => ({
                        id: m.course_id,
                        code: m.course?.code || 'N/A',
                        name: m.course?.name || 'N/A',
                        credits: m.course?.credits || 3,
                        marks: {
                            quiz: m.quiz || 0,
                            mid: m.mid || 0,
                            online: m.online || 0,
                            final: m.final || 0,
                        }
                    }));
                    
                    // Calculate CGPA
                    let totalPoints = 0;
                    let totalCredits = 0;
                    courses.forEach(course => {
                        const total = course.marks.quiz + course.marks.mid + course.marks.online + course.marks.final;
                        const gradePoint = calculateGradePoint(total);
                        totalPoints += gradePoint * course.credits;
                        totalCredits += course.credits;
                    });
                    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
                    
                    setSemesterData({ courses, cgpa });
                }
            }
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateGradePoint = (total) => {
        if (total >= 80) return 4.0;
        if (total >= 75) return 3.75;
        if (total >= 70) return 3.5;
        if (total >= 65) return 3.25;
        if (total >= 60) return 3.0;
        if (total >= 55) return 2.75;
        if (total >= 50) return 2.5;
        if (total >= 45) return 2.25;
        if (total >= 40) return 2.0;
        return 0;
    };

    const getLetterGrade = (total) => {
        if (total >= 80) return 'A+';
        if (total >= 75) return 'A';
        if (total >= 70) return 'A-';
        if (total >= 65) return 'B+';
        if (total >= 60) return 'B';
        if (total >= 55) return 'B-';
        if (total >= 50) return 'C+';
        if (total >= 45) return 'C';
        if (total >= 40) return 'D';
        return 'F';
    };

    const calculateTotal = (marks) => {
        return marks.quiz + marks.mid + marks.online + marks.final;
    };

    const getProgress = (course) => {
        const { quiz, mid, online, final } = course.marks;
        let filled = 0;
        if (quiz > 0) filled++;
        if (mid > 0) filled++;
        if (online > 0) filled++;
        if (final > 0) filled++;
        return (filled / 4) * 100;
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="marks-page">
            <h2 className="page-title">📊 Marks & CGPA Tracker</h2>
            <p className="text-muted">View your marks and grade points for each semester.</p>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Select Semester</Form.Label>
                        <Form.Select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="semester-select"
                        >
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.code}>
                                    {sem.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-end">
                    <div className="cgpa-display">
                        <h5>Semester CGPA: <Badge bg="primary" className="cgpa-badge">{semesterData.cgpa.toFixed(2)}</Badge></h5>
                    </div>
                </Col>
            </Row>

            {semesterData.courses.length === 0 ? (
                <Card className="text-center p-5">
                    <p className="text-muted">No marks available for this semester.</p>
                </Card>
            ) : (
                <>
                    {semesterData.courses.map((course, idx) => (
                        <Card key={idx} className="course-mark-card mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <h5 className="course-code">{course.code}</h5>
                                        <p className="course-name">{course.name}</p>
                                        <p className="credits">Credits: {course.credits}</p>
                                    </Col>
                                    <Col md={8}>
                                        <Row>
                                            <Col sm={3}>
                                                <Form.Group>
                                                    <Form.Label>Quiz (/30)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        max="30"
                                                        value={course.marks.quiz}
                                                        readOnly
                                                        className="mark-input"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Group>
                                                    <Form.Label>Mid (/30)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        max="30"
                                                        value={course.marks.mid}
                                                        readOnly
                                                        className="mark-input"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Group>
                                                    <Form.Label>Online (/10)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        value={course.marks.online}
                                                        readOnly
                                                        className="mark-input"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={3}>
                                                <Form.Group>
                                                    <Form.Label>Final (/30)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        max="30"
                                                        value={course.marks.final}
                                                        readOnly
                                                        className="mark-input"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <hr />

                                <Row className="mt-2">
                                    <Col md={6}>
                                        <div className="progress-wrapper">
                                            <div className="d-flex justify-content-between">
                                                <span>Completion</span>
                                                <span>{getProgress(course)}%</span>
                                            </div>
                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${getProgress(course)}%` }}
                                                    role="progressbar"
                                                ></div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="result-summary d-flex justify-content-around">
                                            <div>
                                                <small>Total</small>
                                                <strong>{calculateTotal(course.marks)}</strong>
                                            </div>
                                            <div>
                                                <small>Grade Point</small>
                                                <strong>{calculateGradePoint(calculateTotal(course.marks)).toFixed(2)}</strong>
                                            </div>
                                            <div>
                                                <small>Letter</small>
                                                <Badge bg={calculateTotal(course.marks) >= 40 ? 'success' : 'danger'}>
                                                    {getLetterGrade(calculateTotal(course.marks))}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}

                    <Card className="cgpa-summary">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h5>Semester CGPA</h5>
                                    <h2 className="display-4 cgpa-number">{semesterData.cgpa.toFixed(2)}</h2>
                                </Col>
                                <Col md={6}>
                                    <h5>Overall CGPA</h5>
                                    <h2 className="display-4 cgpa-number">{semesterData.cgpa.toFixed(2)}</h2>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default MarksPage;