import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './ManageDocuments.css';

const ManageDocuments = () => {
    const [docs, setDocs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'pdf', semester: '1.1', url: '', file: null });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            if (response.data.success) {
                setDocs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingDoc(null);
        setFormData({ name: '', type: 'pdf', semester: '1.1', url: '', file: null });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (doc) => {
        setEditingDoc(doc);
        setFormData({ name: doc.name, type: doc.type, semester: doc.semester, url: doc.url || '', file: null });
        setError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/documents/${id}`);
                setSuccess('Document deleted.');
                fetchDocuments();
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError('Failed to delete document.');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        if (!formData.name) {
            setError('Document name is required.');
            setUploading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('type', formData.type);
            data.append('semester', formData.semester);
            if (formData.url) data.append('url', formData.url);
            if (formData.file) data.append('file', formData.file);

            if (editingDoc) {
                data.append('_method', 'PUT');
                await api.post(`/documents/${editingDoc.id}`, data);
                setSuccess('Document updated.');
            } else {
                await api.post('/documents', data);
                setSuccess('Document added.');
            }
            setShowModal(false);
            fetchDocuments();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Operation failed.');
        } finally {
            setUploading(false);
        }
    };

    if (loading && docs.length === 0) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="manage-documents">
            <h2 className="page-title">📄 Manage Documents</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted">Add, edit, or remove documents.</p>
                <Button variant="primary" onClick={handleAdd}><FontAwesomeIcon icon={faPlus} className="me-2" /> Add Document</Button>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr><th>ID</th><th>Name</th><th>Type</th><th>Semester</th><th>File</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {docs.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.name}</td>
                                    <td>{doc.type}</td>
                                    <td>{doc.semester}</td>
                                    <td>
                                        {doc.file_path ? (
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noreferrer">View File</a>
                                        ) : doc.url ? (
                                            <a href={doc.url} target="_blank" rel="noreferrer">Link</a>
                                        ) : 'N/A'}
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEdit(doc)} className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(doc.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>{editingDoc ? 'Edit Document' : 'Add Document'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Document Name</Form.Label><Form.Control type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Type</Form.Label>
                            <Form.Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                <option value="pdf">PDF</option><option value="ppt">PPT</option><option value="docx">DOCX</option><option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Semester</Form.Label>
                            <Form.Select value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })}>
                                {['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'].map(s => <option key={s} value={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>File (PDF, PPT, DOCX)</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.doc,.docx" />
                            <small className="text-muted">Max 10MB</small>
                        </Form.Group>
                        <Form.Group className="mb-3"><Form.Label>OR URL (optional)</Form.Label>
                            <Form.Control type="text" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageDocuments;