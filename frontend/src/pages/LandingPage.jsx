import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faFolderOpen,
    faBell,
    faChartLine,
    faUserGraduate,
    faGraduationCap,
    faBookOpen,
    faCalendarCheck,
    faClock,
    faStar,
    faArrowRight,
    faQuoteLeft,
} from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './LandingPage.css';

library.add(fab);

const LandingPage = () => {
    return (
        <>
            {/* Header */}
            <header className="landing-header">
                <Container>
                    <Row className="align-items-center py-3">
                        <Col>
                            <div className="brand-container">
                                <img src={logo} alt="AUSTMATE Logo" className="brand-logo" />
                                <span className="brand-text">AUSTMATE</span>
                            </div>
                        </Col>
                        <Col className="text-end">
                            <Link to="/about" className="btn btn-outline-secondary me-2">About</Link>
                            <Link to="/login" className="btn btn-outline-primary me-2 me-md-3">Login</Link>
                            <Link to="/signup" className="btn btn-primary">Get Started</Link>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="hero-text">
                            <h1 className="hero-heading">
                                Welcome to <br />
                                <span className="text-gradient">AUSTMATE</span>
                            </h1>
                            <p className="hero-subheading">
                                Your Ultimate Academic Partner
                            </p>
                            <p className="hero-description">
                                Are you tired of pulling all-nighters and still struggling to keep up with your coursework?
                                AUSTMATE brings everything you need – semester documents, schedules, marks, and faculty contacts –
                                into one powerful, easy-to-use dashboard.
                            </p>
                            <div className="mt-4 d-flex flex-wrap gap-3">
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                                </Link>
                                <Link to="/login" className="btn btn-outline-secondary btn-lg">
                                    Login
                                </Link>
                            </div>
                            <div className="mt-3">
                                <small className="text-muted">
                                    Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
                                </small>
                            </div>
                            <div className="mt-4 d-flex gap-4 stats-mini">
                                <span><strong>4200+</strong> Students</span>
                                <span><strong>120+</strong> Courses</span>
                                <span><strong>4.8★</strong> Rating</span>
                            </div>
                        </Col>
                        <Col lg={6} className="text-center mt-5 mt-lg-0">
                            <div className="hero-illustration">
                                <div className="illustration-box">
                                    <FontAwesomeIcon icon={faGraduationCap} className="illustration-icon" />
                                    <h4>Smart Dashboard Preview</h4>
                                    <p className="text-muted">All your academic data in one place</p>
                                    <div className="feature-pills">
                                        <span className="pill">Semester Docs</span>
                                        <span className="pill">CGPA Tracker</span>
                                        <span className="pill">Smart Reminders</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats Bar */}
            <section className="stats-section">
                <Container>
                    <Row className="text-center">
                        <Col xs={6} md={3} className="mb-3 mb-md-0">
                            <h3 className="display-6 fw-bold">4200+</h3>
                            <p className="text-light">Active Students</p>
                        </Col>
                        <Col xs={6} md={3} className="mb-3 mb-md-0">
                            <h3 className="display-6 fw-bold">120+</h3>
                            <p className="text-light">University Courses</p>
                        </Col>
                        <Col xs={6} md={3} className="mb-3 mb-md-0">
                            <h3 className="display-6 fw-bold">180+</h3>
                            <p className="text-light">Learner Reviews</p>
                        </Col>
                        <Col xs={6} md={3} className="mb-3 mb-md-0">
                            <h3 className="display-6 fw-bold">135+</h3>
                            <p className="text-light">Expert Teachers</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <span className="badge bg-secondary-custom">Features</span>
                        <h2 className="display-5 fw-semibold mt-2">Everything You Need to Succeed</h2>
                        <p className="text-muted">Designed by students, for students – to make your academic life easier.</p>
                    </div>
                    <Row>
                        <Col md={6} lg={3} className="mb-4">
                            <Card className="feature-card h-100">
                                <Card.Body className="text-center">
                                    <div className="feature-icon-wrapper">
                                        <FontAwesomeIcon icon={faFolderOpen} className="feature-icon" />
                                    </div>
                                    <Card.Title>Semester-wise Docs</Card.Title>
                                    <Card.Text>
                                        Organize all your course files, notes, slides, and question banks by semester –
                                        everything in one place.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <Card className="feature-card h-100">
                                <Card.Body className="text-center">
                                    <div className="feature-icon-wrapper">
                                        <FontAwesomeIcon icon={faBell} className="feature-icon" />
                                    </div>
                                    <Card.Title>Smart Notifications</Card.Title>
                                    <Card.Text>
                                        Never miss a quiz, midterm, or deadline again. Get timely reminders
                                        and stay ahead of your schedule.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <Card className="feature-card h-100">
                                <Card.Body className="text-center">
                                    <div className="feature-icon-wrapper">
                                        <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
                                    </div>
                                    <Card.Title>Progress Tracking</Card.Title>
                                    <Card.Text>
                                        Visualize your CGPA, track marks for each component, and monitor
                                        your topic completion in real-time.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} lg={3} className="mb-4">
                            <Card className="feature-card h-100">
                                <Card.Body className="text-center">
                                    <div className="feature-icon-wrapper">
                                        <FontAwesomeIcon icon={faUserGraduate} className="feature-icon" />
                                    </div>
                                    <Card.Title>Faculty Directory</Card.Title>
                                    <Card.Text>
                                        Access professor contact information, consultation hours,
                                        and department details instantly.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Why AUSTMATE? Section */}
            <section className="why-section py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <span className="badge bg-secondary-custom">Why AUSTMATE?</span>
                            <h2 className="display-5 fw-semibold mt-2">Designed for Student Success</h2>
                            <p className="lead">
                                We understand the struggle of juggling multiple subjects, deadlines, and files.
                                AUSTMATE was built to eliminate the chaos and help you focus on what truly matters – learning.
                            </p>
                            <ul className="why-list mt-3">
                                <li>
                                    <FontAwesomeIcon icon={faClock} className="me-3 text-secondary" />
                                    <span>All your files in one place – accessible anytime, anywhere</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faCalendarCheck} className="me-3 text-secondary" />
                                    <span>Never forget a quiz, assignment, or exam date again</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faBookOpen} className="me-3 text-secondary" />
                                    <span>Focus on learning, not on organizing your academic life</span>
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faStar} className="me-3 text-secondary" />
                                    <span>Join 4200+ students who have simplified their university journey</span>
                                </li>
                            </ul>
                            <Link to="/signup" className="btn btn-primary mt-3">
                                Join Now <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                            </Link>
                        </Col>
                        <Col lg={6} className="mt-4 mt-lg-0">
                            <div className="testimonial-box">
                                <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
                                <p className="testimonial-text">
                                    "AUSTMATE completely transformed how I manage my studies.
                                    I went from constantly missing deadlines to being on top of everything.
                                    It's like having a personal academic assistant!"
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">JD</div>
                                    <div>
                                        <strong>John Doe</strong>
                                        <p className="text-muted small mb-0">CSE Student, Class of 2026</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Call to Action */}
            <section className="cta-section py-5">
                <Container className="text-center">
                    <h2 className="display-5 fw-bold mb-3">Ready to Simplify Your Academic Life?</h2>
                    <p className="lead mb-4">Join thousands of students who are already using AUSTMATE.</p>
                    <Link to="/signup" className="btn btn-primary-custom btn-lg">
                        Get Started Now <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Link>
                    <div className="mt-3">
                        <small className="text-white-50">
                            Already have an account? <Link to="/login" className="text-white text-decoration-underline">Login</Link>
                        </small>
                    </div>
                </Container>
            </section>

            {/* Footer */}
            <footer className="footer">
                <Container>
                    <Row>
                        <Col md={4} className="mb-3 mb-md-0">
                            <div className="d-flex align-items-center gap-2">
                                <img src={logo} alt="AUSTMATE" className="footer-logo" />
                                <h5 className="mb-0">AUSTMATE</h5>
                            </div>
                            <p className="text-muted small mt-2">Your Ultimate Academic Partner</p>
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                            <h6>Quick Links</h6>

                            <ul className="list-unstyled">
                                <li>
                                    <Link to="/" className="text-muted small">
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/signup" className="text-muted small">
                                        Sign Up
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/login" className="text-muted small">
                                        Login
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/about" className="text-muted small">
                                        About Us
                                    </Link>
                                </li>

                                <li>
                                    <Link to="#" className="text-muted small">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>


                        </Col>
                        <Col md={4}>
                            <h6>Follow Us</h6>
                            <div className="d-flex gap-3 social-links">
                                <a href="#" className="text-muted" aria-label="Facebook">
                                    <FontAwesomeIcon icon={['fab', 'facebook']} />
                                </a>
                                <a href="#" className="text-muted" aria-label="Twitter">
                                    <FontAwesomeIcon icon={['fab', 'twitter']} />
                                </a>
                                <a href="#" className="text-muted" aria-label="LinkedIn">
                                    <FontAwesomeIcon icon={['fab', 'linkedin']} />
                                </a>
                                <a href="#" className="text-muted" aria-label="Instagram">
                                    <FontAwesomeIcon icon={['fab', 'instagram']} />
                                </a>
                            </div>
                            <p className="text-muted small mt-3">© 2026 AUSTMATE. All rights reserved.</p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </>
    );
};

export default LandingPage;