import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUserGroup, faChalkboardUser, faFile, faPen, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        faculty: 0,
        documents: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [students, courses, faculty, documents] = await Promise.all([
                api.get('/students'),
                api.get('/courses'),
                api.get('/faculty'),
                api.get('/documents'),
            ]);
            setStats({
                students: students.data.data.length,
                courses: courses.data.data.length,
                faculty: faculty.data.data.length,
                documents: documents.data.data.length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const adminCards = [
        { title: 'Manage Courses', icon: faBook, path: '/dashboard/admin/courses', color: '#0B4F6C', count: stats.courses },
        { title: 'Manage Students', icon: faUserGroup, path: '/dashboard/admin/students', color: '#1A759F', count: stats.students },
        { title: 'Manage Faculty', icon: faChalkboardUser, path: '/dashboard/admin/faculty', color: '#F4A261', count: stats.faculty },
        { title: 'Manage Documents', icon: faFile, path: '/dashboard/admin/documents', color: '#E76F51', count: stats.documents },
        { title: 'Manage Marks', icon: faPen, path: '/dashboard/admin/marks', color: '#2A9D8F' },
        { title: 'Manage Notices', icon: faBullhorn, path: '/dashboard/admin/notices', color: '#6c757d' },
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
                                    {card.count !== undefined && (
                                        <span className="badge bg-secondary">{card.count}</span>
                                    )}
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