import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEnvelope, faClock, faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { facultyData, departments } from '../data/mockData';
import './FacultyPage.css';

const FacultyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    // Filter faculty
    const filteredFaculty = facultyData.filter((faculty) => {
        const matchesSearch =
            faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faculty.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faculty.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDepartment === 'All' || faculty.department === selectedDepartment;
        return matchesSearch && matchesDept;
    });

    return (
        <Container fluid className="faculty-page">
            <h2 className="page-title">👨‍🏫 Faculty Directory</h2>
            <p className="text-muted">Find contact details and consultation hours of your professors.</p>

            {/* Search & Filter */}
            <Row className="mb-4 search-filter-row">
                <Col md={7}>
                    <InputGroup>
                        <InputGroup.Text className="search-icon-wrapper">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, department, or designation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </InputGroup>
                </Col>
                <Col md={5}>
                    <Form.Select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="dept-select"
                    >
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Faculty Cards */}
            <Row>
                {filteredFaculty.length === 0 ? (
                    <Col>
                        <p className="text-center text-muted py-5">No faculty members found matching your criteria.</p>
                    </Col>
                ) : (
                    filteredFaculty.map((faculty) => (
                        <Col key={faculty.id} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="faculty-card h-100">
                                <Card.Body className="text-center">
                                    <div className="faculty-avatar">
                                        {faculty.avatar}
                                    </div>
                                    <h5 className="faculty-name">{faculty.name}</h5>
                                    <p className="faculty-designation">{faculty.designation}</p>
                                    <p className="faculty-dept">
                                        <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                        {faculty.department}
                                    </p>
                                    <hr />
                                    <div className="faculty-details">
                                        <p className="faculty-detail-item">
                                            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                            <a href={`mailto:${faculty.email}`} className="email-link">
                                                {faculty.email}
                                            </a>
                                        </p>
                                        <p className="faculty-detail-item">
                                            <FontAwesomeIcon icon={faClock} className="me-2" />
                                            {faculty.consultationHours}
                                        </p>
                                        <p className="faculty-detail-item small text-muted">
                                            <FontAwesomeIcon icon={faUser} className="me-2" />
                                            Room: {faculty.room}
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="contact-btn"
                                        href={`mailto:${faculty.email}`}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                        Contact
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default FacultyPage;