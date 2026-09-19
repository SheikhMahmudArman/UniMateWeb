import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faClock } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';

const NoticeBoardPage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await api.get('/notices');
            if (response.data.success) {
                setNotices(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case 'exam': return <Badge bg="danger">Exam</Badge>;
            case 'event': return <Badge bg="success">Event</Badge>;
            default: return <Badge bg="secondary">General</Badge>;
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

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