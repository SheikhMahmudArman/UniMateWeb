import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ManageDocuments.css';

const ManageDocuments = () => {
    const [docs, setDocs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [formData, setFormData] = useState({ id: '', name: '', type: 'pdf', semester: '1.1', url: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('admin_documents');
        if (stored) {
            setDocs(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, name: 'CSE 1101_Intro_to_Programming.pdf', type: 'pdf', semester: '1.1', url: '#' },
                { id: 2, name: 'CSE 1103_Discrete_Math_Notes.pdf', type: 'pdf', semester: '1.1', url: '#' },
            ];
            setDocs(initial);
            localStorage.setItem('admin_documents', JSON.stringify(initial));
        }
    }, []);

    const saveDocs = (newDocs) => {
        setDocs(newDocs);
        localStorage.setItem('admin_documents', JSON.stringify(newDocs));
    };

    const handleAdd = () => {
        setEditingDoc(null);
        setFormData({ id: '', name: '', type: 'pdf', semester: '1.1', url: '' });
        setError('');
        setShowModal(true);
    };

    const handleEdit = (doc) => {
        setEditingDoc(doc);
        setFormData({ ...doc });
        setError('');
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            const newDocs = docs.filter(d => d.id !== id);
            saveDocs(newDocs);
            setSuccess('Document deleted.');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) {
            setError('Document name is required.');
            return;
        }
        if (editingDoc) {
            const updated = docs.map(d => d.id === editingDoc.id ? { ...formData } : d);
            saveDocs(updated);
            setSuccess('Document updated.');
        } else {
            const newId = docs.length ? Math.max(...docs.map(d => d.id)) + 1 : 1;
            saveDocs([...docs, { ...formData, id: newId }]);
            setSuccess('Document added.');
        }
        setShowModal(false);
        setTimeout(() => setSuccess(''), 3000);
    };

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
                            <tr><th>ID</th><th>Name</th><th>Type</th><th>Semester</th><th>URL</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {docs.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.name}</td>
                                    <td>{doc.type}</td>
                                    <td>{doc.semester}</td>
                                    <td><a href={doc.url} target="_blank" rel="noreferrer">Link</a></td>
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
                        <Form.Group className="mb-3"><Form.Label>URL (optional)</Form.Label><Form.Control type="text" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} placeholder="https://..." /></Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default ManageDocuments;