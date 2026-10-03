import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import api from '../services/api';

export default function AcademicPage({ resource, title }) {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);
    useEffect(() => {
        let active = true;
        api.get(`/${resource}`).then(r => { if (active) setRows(r.data.data); })
            .catch(() => { if (active) setError('Cannot load records. Please reload.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [resource]);
    const toggle = async row => {
        setBusy(row.id); setError('');
        try {
            await api.put(`/${resource}/${row.id}/completion`, { completed: !row.completed });
            setRows(previous => previous.map(r => r.id === row.id ? { ...r, completed: !row.completed } : r));
        } catch { setError('Could not save your progress. Please try again.'); }
        finally { setBusy(null); }
    };
    const download = async row => {
        try {
            const response = await api.get(`/assignments/${row.id}/download`, { responseType: 'blob' });
            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a'); link.href = url; link.download = row.file_name || row.title; link.click();
            URL.revokeObjectURL(url);
        } catch { setError('Cannot download this attachment. Please try again.'); }
    };
    return <Container><h2>{title}</h2>{error && <Alert variant="danger">{error}</Alert>}
        {resource === 'assignments' && <p>Mark an assignment complete to remove it from your pending count. This is a personal checklist, not an online submission.</p>}
        {loading ? <p>Loading…</p> : !rows.length ? <p>No records for your semester yet.</p> : rows.map(row => <Card className="mb-3" key={row.id}><Card.Body>
            <h5>{row.title}</h5><p>{row.course?.code} — {row.course?.name} (Semester {row.course?.semester})</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{row.description}</p>
            {row.date && <p>Quiz: {row.date} {row.time?.slice(0, 5)} {row.room && `• Room ${row.room}`}</p>}
            {row.due_date && <p>Due: {row.due_date}</p>}
            {row.total_marks != null && <p>Marks: {row.total_marks}</p>}
            {row.has_file && <Button variant="link" onClick={() => download(row)}>Download attachment</Button>}
            {resource !== 'quizzes' && <Form.Check id={`${resource}-${row.id}`} label="Completed" checked={row.completed} disabled={busy !== null} onChange={() => toggle(row)} />}
        </Card.Body></Card>)}
    </Container>;
}
