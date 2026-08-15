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
import { documents } from '../data/mockData';
import './DrivePage.css';

const DrivePage = () => {
    const { semesterId } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [offlineMode, setOfflineMode] = useState(false);
    const [activeTab, setActiveTab] = useState('theory');
    const [filteredDocs, setFilteredDocs] = useState([]);

    const semesterData = documents[semesterId];
    const theoryDocs = semesterData?.theory || [];
    const labDocs = semesterData?.lab || [];

    useEffect(() => {
        // Filter based on search term
        const docs = activeTab === 'theory' ? theoryDocs : labDocs;
        const filtered = docs.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDocs(filtered);
    }, [searchTerm, activeTab, semesterId]);

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

    if (!semesterData) {
        return (
            <Container className="drive-page">
                <h2>Semester not found</h2>
                <Link to="/dashboard/folders" className="btn btn-primary">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Folders
                </Link>
            </Container>
        );
    }

    return (
        <Container fluid className="drive-page">
            {/* Header */}
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

            {/* Search */}
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

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="drive-tabs"
            >
                <Tab eventKey="theory" title={`Theory Docs (${theoryDocs.length})`}>
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
                                            <Button variant="outline-primary" size="sm" className="me-1">
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button variant="primary" size="sm">
                                                <FontAwesomeIcon icon={faDownload} /> Download
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </Tab>
                <Tab eventKey="lab" title={`Lab Docs (${labDocs.length})`}>
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
                                            <Button variant="outline-primary" size="sm" className="me-1">
                                                <FontAwesomeIcon icon={faEye} /> View
                                            </Button>
                                            <Button variant="primary" size="sm">
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