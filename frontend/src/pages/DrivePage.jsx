import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Tabs, Tab, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faFilePdf,
    faFilePowerpoint,
    faFileWord,
    faFileAlt,
    faDownload,
    faEye,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import './DrivePage.css';

const DrivePage = () => {
    const { semesterId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [offlineMode, setOfflineMode] = useState(false);
    const [activeTab, setActiveTab] = useState('theory');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, [semesterId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/documents?semester=${semesterId}`);
            if (response.data.success) {
                setDocuments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return faFilePdf;
            case 'ppt': return faFilePowerpoint;
            case 'docx': return faFileWord;
            default: return faFileAlt;
        }
    };

    const getFileColor = (type) => {
        switch (type) {
            case 'pdf': return '#e74c3c';
            case 'ppt': return '#f39c12';
            case 'docx': return '#2980b9';
            default: return '#7f8c8d';
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-5">Loading documents...</div>;
    }

    return (
        <Container fluid className="drive-page">
            <div className="drive-header">
                <Link to="/dashboard/folders" className="btn btn-outline-primary back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </Link>
                <h2 className="drive-title">📂 Semester {semesterId}</h2>
                <div className="drive-controls">
                    <Form.Check
                        type="switch"
                        label="Offline Mode"
                        checked={offlineMode}
                        onChange={() => setOfflineMode(!offlineMode)}
                        className="offline-toggle"
                    />
                </div>
            </div>

            <div className="drive-search">
                <div className="search-wrapper">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <Form.Control
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="drive-tabs"
            >
                <Tab eventKey="theory" title={`Theory Docs`}>
                    <div className="doc-list">
                        {filteredDocs.length === 0 ? (
                            <p className="text-muted text-center py-4">No documents found.</p>
                        ) : (
                            <ListGroup variant="flush">
                                {filteredDocs.map(doc => (
                                    <ListGroup.Item key={doc.id} className="doc-item">
                                        <div className="doc-info">
                                            <FontAwesomeIcon
                                                icon={getFileIcon(doc.type)}
                                                className="doc-icon"
                                                style={{ color: getFileColor(doc.type) }}
                                            />
                                            <span className="doc-name">{doc.name}</span>
                                            <Badge bg="light" text="dark" className="doc-badge">
                                                {doc.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="doc-actions">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-1"
                                                onClick={() => window.open(doc.url || doc.file_path, '_blank')}
                                            >
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => {
                                                    if (doc.file_path) {
                                                        window.open(`/storage/${doc.file_path}`, '_blank');
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faDownload} /> Download
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </Tab>
                <Tab eventKey="lab" title={`Lab Docs`}>
                    <div className="doc-list">
                        {filteredDocs.length === 0 ? (
                            <p className="text-muted text-center py-4">No lab documents found.</p>
                        ) : (
                            <ListGroup variant="flush">
                                {filteredDocs.map(doc => (
                                    <ListGroup.Item key={doc.id} className="doc-item">
                                        <div className="doc-info">
                                            <FontAwesomeIcon
                                                icon={getFileIcon(doc.type)}
                                                className="doc-icon"
                                                style={{ color: getFileColor(doc.type) }}
                                            />
                                            <span className="doc-name">{doc.name}</span>
                                            <Badge bg="light" text="dark" className="doc-badge">
                                                {doc.type.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="doc-actions">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-1"
                                                onClick={() => window.open(doc.url || doc.file_path, '_blank')}
                                            >
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => {
                                                    if (doc.file_path) {
                                                        window.open(`/storage/${doc.file_path}`, '_blank');
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faDownload} /> Download
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default DrivePage;