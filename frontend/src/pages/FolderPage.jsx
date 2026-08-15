import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { semesters } from '../data/mockData';
import './FolderPage.css';

const FolderPage = () => {
    return (
        <Container fluid className="folder-page">
            <h2 className="page-title">📁 Semester Folders</h2>
            <p className="text-muted">Click a folder to browse documents for that semester.</p>
            <Row className="folder-grid">
                {semesters.map((sem) => (
                    <Col key={sem} md={3} sm={6} xs={12} className="mb-4">
                        <Link to={`/dashboard/drive/${sem}`} className="folder-link">
                            <Card className="folder-card">
                                <Card.Body className="text-center">
                                    <FontAwesomeIcon icon={faFolderOpen} className="folder-icon" />
                                    <h5 className="folder-label">{sem}</h5>
                                    <small className="text-muted">Semester {sem}</small>
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