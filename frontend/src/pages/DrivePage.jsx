import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Container, Form, ListGroup } from 'react-bootstrap';
import api from '../services/api';
function documentLink(doc) {
    if (doc.file_path) return `/storage/${doc.file_path}`;
    try { const url = new URL(doc.url); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
}
export default function DrivePage() {
    const { semesterId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true; setLoading(true); setError('');
        api.get('/documents', { params: { semester: semesterId } }).then(r => { if (active) setDocuments(r.data.data); })
            .catch(() => { if (active) setError('Cannot load documents. Please refresh.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [semesterId]);
    return <Container><Link to="/dashboard/folders">Back to semesters</Link><h2>Semester {semesterId} documents</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control aria-label="Search documents" placeholder="Search documents" value={search} onChange={e => setSearch(e.target.value)} />
        {loading ? <p>Loading...</p> : <ListGroup className="mt-3">{documents.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(doc => <ListGroup.Item key={doc.id}>
            <strong>{doc.name}</strong> ({doc.type}) {' '}
            {documentLink(doc) ? <a href={documentLink(doc)} target="_blank" rel="noopener noreferrer">Open / download</a> : <span>No file or link attached</span>}
        </ListGroup.Item>)}</ListGroup>}
        {!loading && !documents.length && <p>No documents have been added yet.</p>}
    </Container>;
}
