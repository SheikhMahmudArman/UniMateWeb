import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faClock } from '@fortawesome/free-solid-svg-icons';

const NoticeBoardPage = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        
        const storedNotices = localStorage.getItem('notices');
        if (storedNotices) {
            setNotices(JSON.parse(storedNotices));
        } else {
            
            const defaultNotices = [
                { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will start from 15th August. Please check the detailed schedule on the notice board.', date: '2026-08-10', type: 'exam' },
                { id: 2, title: 'Library Renovation', content: 'The library will remain closed from 20th to 25th August for renovation.', date: '2026-08-08', type: 'general' },
                { id: 3, title: 'CSE Department Seminar', content: 'A seminar on "AI in Modern World" will be held on 25th August at 10 AM in Room 401.', date: '2026-08-18', type: 'event' },
            ];
            setNotices(defaultNotices);
            localStorage.setItem('notices', JSON.stringify(defaultNotices));
        }
    }, []);

    const getTypeBadge = (type) => {
        switch (type) {
            case 'exam': return <Badge bg="danger">Exam</Badge>;
            case 'event': return <Badge bg="success">Event</Badge>;
            default: return <Badge bg="secondary">General</Badge>;
        }
    };

    return (
        <Container fluid className="notice-board-page" style={{ padding: '20px' }}>
            <h2 className="page-title"><FontAwesomeIcon icon={faBullhorn} className="me-2" /> Notice Board</h2>
            <p className="text-muted">Stay updated with the latest notices and announcements.</p>
            
            <Row>
                {notices.length === 0 ? (
                    <Col md={12}>
                        <Alert variant="info">No notices available.</Alert>
                    </Col>
                ) : (
                    notices.map((notice) => (
                        <Col md={6} lg={4} key={notice.id} className="mb-4">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">{notice.title}</h5>
                                        {getTypeBadge(notice.type)}
                                    </div>
                                    <Card.Text>{notice.content}</Card.Text>
                                    <div className="text-muted small">
                                        <FontAwesomeIcon icon={faClock} className="me-1" /> {new Date(notice.date).toLocaleDateString()}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default NoticeBoardPage;