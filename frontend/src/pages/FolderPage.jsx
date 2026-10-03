import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import { Alert } from 'react-bootstrap';
import './FolderPage.css';

const FolderPage = () => {
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSemesters() {
        try {
            const response = await api.get('/semesters');
            if (response.data.success) {
                setSemesters(response.data.data);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Cannot load semester folders.');
        } finally {
            setLoading(false);
        }
        }
        fetchSemesters();
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="folder-page">
            {error && <Alert variant="danger">{error}</Alert>}
            {user?.role === 'admin' && <Link className="btn btn-primary mb-3" to="/dashboard/admin/semesters">Manage semester drives</Link>}
            <h2 className="page-title"> Semester Folders</h2>
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
                        {sem.drive_url && <a className="btn btn-outline-primary mt-2" href={sem.drive_url} target="_blank" rel="noopener noreferrer">Open shared drive</a>}
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default FolderPage;
