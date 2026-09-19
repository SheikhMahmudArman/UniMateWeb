import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import './FolderPage.css';

const FolderPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const response = await api.get('/semesters');
            if (response.data.success) {
                setSemesters(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching semesters:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="folder-page">
            <h2 className="page-title">📁 Semester Folders</h2>
            <p className="text-muted">Click a folder to browse documents for that semester.</p>
            <Row className="folder-grid">
                {semesters.map((sem) => (
                    <Col key={sem.id} md={3} sm={6} xs={12} className="mb-4">
                        <Link to={`/dashboard/drive/${sem.code}`} className="folder-link">
                            <Card className="folder-card">
                                <Card.Body className="text-center">
                                    <FontAwesomeIcon icon={faFolderOpen} className="folder-icon" />
                                    <h5 className="folder-label">{sem.code}</h5>
                                    <small className="text-muted">{sem.name}</small>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FolderPage;