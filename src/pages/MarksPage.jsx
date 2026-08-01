import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faChartLine, faSave } from '@fortawesome/free-solid-svg-icons';
import { marksData, semestersList } from '../data/mockData';
import './MarksPage.css';

const MarksPage = () => {
    const [selectedSemester, setSelectedSemester] = useState('1.1');
    const [semesterData, setSemesterData] = useState(null);
    const [overallCGPA, setOverallCGPA] = useState(0);

    useEffect(() => {
        // Load data for selected semester
        const data = marksData[selectedSemester];
        if (data) {
            setSemesterData(data);
        }
        // Calculate overall CGPA from all semesters
        const total = Object.values(marksData).reduce((sum, sem) => sum + sem.cgpa, 0);
        const count = Object.values(marksData).filter(sem => sem.cgpa > 0).length;
        setOverallCGPA(count > 0 ? total / count : 0);
    }, [selectedSemester]);

    const handleMarkChange = (courseIndex, component, value) => {
        const newData = { ...semesterData };
        newData.courses[courseIndex].marks[component] = parseFloat(value) || 0;
        setSemesterData(newData);
    };

    const calculateTotal = (marks) => {
        return marks.quiz + marks.mid + marks.online + marks.final;
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

    const calculateSemesterCGPA = () => {
        if (!semesterData) return 0;
        let totalPoints = 0;
        let totalCredits = 0;
        semesterData.courses.forEach(course => {
            const totalMarks = calculateTotal(course.marks);
            const gradePoint = calculateGradePoint(totalMarks);
            totalPoints += gradePoint * course.credits;
            totalCredits += course.credits;
        });
        return totalCredits > 0 ? totalPoints / totalCredits : 0;
    };

    const semesterCGPA = calculateSemesterCGPA();

    const getProgress = (course) => {
        const { quiz, mid, online, final } = course.marks;
        let filled = 0;
        if (quiz > 0) filled++;
        if (mid > 0) filled++;
        if (online > 0) filled++;
        if (final > 0) filled++;
        return (filled / 4) * 100;
    };

    return (
        <Container fluid className="marks-page">
            <h2 className="page-title">📊 Marks & CGPA Tracker</h2>
            <p className="text-muted">Enter your marks to calculate grade points and CGPA.</p>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Select Semester</Form.Label>
                        <Form.Select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="semester-select"
                        >
                            {semestersList.map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-end">
                    <div className="cgpa-display">
                        <h5>Semester CGPA: <Badge bg="primary" className="cgpa-badge">{semesterCGPA.toFixed(2)}</Badge></h5>
                    </div>
                </Col>
            </Row>

            {semesterData && (
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
                                                        onChange={(e) => handleMarkChange(idx, 'quiz', e.target.value)}
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
                                                        onChange={(e) => handleMarkChange(idx, 'mid', e.target.value)}
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
                                                        onChange={(e) => handleMarkChange(idx, 'online', e.target.value)}
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
                                                        onChange={(e) => handleMarkChange(idx, 'final', e.target.value)}
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
                                    <h2 className="display-4 cgpa-number">{semesterCGPA.toFixed(2)}</h2>
                                </Col>
                                <Col md={6}>
                                    <h5>Overall CGPA</h5>
                                    <h2 className="display-4 cgpa-number">{overallCGPA.toFixed(2)}</h2>
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