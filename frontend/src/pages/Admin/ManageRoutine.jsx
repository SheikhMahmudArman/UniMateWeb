import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Table } from 'react-bootstrap';
import api from '../../services/api';
const empty = { time: '', course_code: '', course_name: '', room: '', day: 'Sunday' };
export default function ManageRoutine() {
    const [rows, setRows] = useState([]), [form, setForm] = useState(empty), [editing, setEditing] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    const load = async () => { try { setRows((await api.get('/routine')).data.data); } catch { setError('Cannot load routine.'); } };
    useEffect(() => { load(); }, []);
    const save = async e => { e.preventDefault(); setBusy(true); setError(''); try {
        if (editing) await api.put(`/routine/${editing}`, form); else await api.post('/routine', form);
        setForm(empty); setEditing(null); await load();
    } catch(e) { setError(e.response?.data?.message || 'Cannot save routine.'); } finally { setBusy(false); } };
    const remove = async id => { if (!window.confirm('Delete this class?')) return; try { await api.delete(`/routine/${id}`); await load(); } catch { setError('Cannot delete class.'); } };
    return <Container><h2>Manage routine</h2><p>The current routine is shared by all students. Use the course code to identify each class.</p>{error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={save}>{Object.keys(empty).map(key => <Form.Group className="mb-2" key={key}><Form.Label>{key.replaceAll('_', ' ')}</Form.Label><Form.Control required maxLength={255} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} /></Form.Group>)}
        <Button type="submit" disabled={busy}>{editing ? 'Update' : 'Add'} class</Button> <Button variant="secondary" onClick={() => {setEditing(null);setForm(empty);}}>Cancel</Button></Form>
        <Table responsive className="mt-3"><thead><tr><th>Day</th><th>Time</th><th>Course</th><th>Room</th><th>Actions</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{row.day}</td><td>{row.time}</td><td>{row.course_code} — {row.course_name}</td><td>{row.room}</td><td><Button size="sm" onClick={() => {setEditing(row.id);setForm(Object.fromEntries(Object.keys(empty).map(k => [k,row[k]])));}}>Edit</Button> <Button variant="danger" size="sm" onClick={() => remove(row.id)}>Delete</Button></td></tr>)}</tbody></Table>
    </Container>;
}
