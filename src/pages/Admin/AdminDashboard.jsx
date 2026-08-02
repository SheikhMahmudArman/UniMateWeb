import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUserGroup, faChalkboardUser, faFile, faPen } from '@fortawesome/free-solid-svg-icons';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const adminCards = [
        { title: 'Manage Courses', icon: faBook, path: '/dashboard/admin/courses', color: '#0B4F6C' },
        { title: 'Manage Students', icon: faUserGroup, path: '/dashboard/admin/students', color: '#1A759F' },
        { title: 'Manage Faculty', icon: faChalkboardUser, path: '/dashboard/admin/faculty', color: '#F4A261' },
        { title: 'Manage Documents', icon: faFile, path: '/dashboard/admin/documents', color: '#E76F51' },
        { title: 'Manage Marks', icon: faPen, path: '/dashboard/admin/marks', color: '#2A9D8F' },
    ];

    return (
        <Container fluid className="admin-dashboard">
            <h2 className="page-title">👑 Admin Panel</h2>
            <p className="text-muted">Welcome, {user?.name}. Manage all aspects of the system.</p>
            <Row className="mt-4">
                {adminCards.map((card, idx) => (
                    <Col key={idx} md={4} lg={3} className="mb-4">
                        <Link to={card.path} className="admin-card-link">
                            <Card className="admin-card" style={{ borderTop: `4px solid ${card.color}` }}>
                                <Card.Body className="text-center">
                                    <FontAwesomeIcon icon={card.icon} className="admin-card-icon" style={{ color: card.color }} />
                                    <h5>{card.title}</h5>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminDashboard;