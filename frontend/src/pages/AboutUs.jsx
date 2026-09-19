import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faUsers, faGraduationCap, faHeart } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './AboutUs.css';

const AboutUs = () => {
    const team = [
        { name: 'Mahbuba Alam Jemi', id: '20230204008', role: 'Frontend Designer' },
        { name: 'Md. Nasir Uddin Arman', id: '20230204011', role: 'Backend Designer' },
        { name: 'Maimoona', id: '20230204109', role: 'Lead' },
    ];

    return (
        <div className="about-page">
            {/* Header */}
            <header className="about-header">
                <Container>
                    <Row className="align-items-center py-3">
                        <Col>
                            <div className="brand-container">
                                <img src={logo} alt="AUSTMATE" className="brand-logo" />
                                <span className="brand-text">AUSTMATE</span>
                            </div>
                        </Col>
                        <Col className="text-end">
                            <Link to="/" className="btn btn-outline-primary me-2">Home</Link>
                            <Link to="/login" className="btn btn-primary">Login</Link>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* Hero */}
            <section className="about-hero">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h1 className="display-4 fw-bold">About AUSTMATE</h1>
                            <p className="lead">Your Ultimate Academic Partner – designed by students, for students.</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Our Story */}
            <section className="about-story">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2>Our Story</h2>
                            <p className="about-text">
                                AUSTMATE was born out of the frustration of juggling endless files, scattered deadlines, and missed quizzes.
                                We are a team of university students who experienced the chaos of academic life firsthand.
                                We decided to build a platform that centralises everything – semester documents, schedules, marks, faculty contacts –
                                into one smart dashboard.
                            </p>
                            <p className="about-text">
                                Today, AUSTMATE is used by thousands of students to stay organised, track their progress, and never miss a deadline.
                                We believe that every student deserves a stress‑free academic journey.
                            </p>
                        </Col>
                        <Col lg={6} className="text-center mt-4 mt-lg-0">
                            <FontAwesomeIcon icon={faRocket} className="story-icon" />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Mission */}
            <section className="about-mission">
                <Container>
                    <Row className="text-center">
                        <Col md={4} className="mb-4">
                            <div className="mission-card">
                                <FontAwesomeIcon icon={faGraduationCap} className="mission-icon" />
                                <h4>Empower Learning</h4>
                                <p>Give students the tools they need to focus on learning, not on organising.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="mission-card">
                                <FontAwesomeIcon icon={faHeart} className="mission-icon" />
                                <h4>Built with Care</h4>
                                <p>Designed with the student experience at the centre of every decision.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="mission-card">
                                <FontAwesomeIcon icon={faUsers} className="mission-icon" />
                                <h4>Community First</h4>
                                <p>Created by students, for students – with feedback driving every update.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Team */}
            <section className="about-team">
                <Container>
                    <h2 className="text-center mb-5">Meet the Team</h2>
                    <Row className="justify-content-center">
                        {team.map((member, idx) => (
                            <Col key={idx} md={4} className="mb-4">
                                <Card className="team-card">
                                    <Card.Body className="text-center">
                                        <div className="team-avatar">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <h5>{member.name}</h5>
                                        <p className="team-id">{member.id}</p>
                                        <p className="team-role">{member.role}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <footer className="about-footer">
                <Container>
                    <p className="text-center mb-0">&copy; 2026 AUSTMATE. All rights reserved. Built with ❤️ by Team AUSTMATE.</p>
                </Container>
            </footer>
        </div>
    );
};

export default AboutUs;