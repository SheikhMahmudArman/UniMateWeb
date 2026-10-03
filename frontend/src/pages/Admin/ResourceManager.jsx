import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Table } from 'react-bootstrap';
import api from '../../services/api';

export default function ResourceManager({ title, resource, fields, courseBased = false }) {
    const initial = () => Object.fromEntries(fields.map(f => [f.name, f.default ?? '']));
    const [rows, setRows] = useState([]);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [semester, setSemester] = useState('');
    const [form, setForm] = useState(initial);
    const [editing, setEditing] = useState(null);
    const [file, setFile] = useState(null);
    const [fileKey, setFileKey] = useState(0);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        Promise.all([api.get(`/${resource}`), ...(courseBased ? [api.get('/courses'), api.get('/semesters')] : [])])
            .then(([r, c, s]) => {
                if (!active) return;
                setRows(r.data.data);
                if (c) setCourses(c.data.data);
                if (s) setSemesters(s.data.data);
            }).catch(() => { if (active) setError(`Cannot load ${title.toLowerCase()}. Please reload.`); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [resource, courseBased, title]);

    const reset = () => { setEditing(null); setForm(initial()); setFile(null); setFileKey(key => key + 1); };
    const reload = async () => setRows((await api.get(`/${resource}`)).data.data);
    const save = async event => {
        event.preventDefault(); setBusy(true); setError('');
        try {
            if (resource === 'assignments') {
                const body = new FormData();
                Object.entries(form).forEach(([key, value]) => body.append(key, value ?? ''));
                if (file) body.append('file', file);
                if (editing) body.append('_method', 'PUT');
                await api.post(`/${resource}${editing ? `/${editing}` : ''}`, body);
            } else if (editing) await api.put(`/${resource}/${editing}`, form);
            else await api.post(`/${resource}`, form);
            reset(); await reload();
        } catch (e) { setError(e.response?.data?.message || 'Cannot save. Please try again.'); }
        finally { setBusy(false); }
    };
    const remove = async id => {
        if (!window.confirm('Delete this record?')) return;
        setBusy(true); setError('');
        try { await api.delete(`/${resource}/${id}`); if (id === editing) reset(); await reload(); }
        catch (e) { setError(e.response?.data?.message || 'Cannot delete this record.'); }
        finally { setBusy(false); }
    };
    const edit = row => {
        setEditing(row.id); setFile(null); setFileKey(key => key + 1);
        if (row.course) setSemester(row.course.semester);
        setForm(Object.fromEntries(fields.map(f => [f.name, f.type === 'time' ? (row[f.name] ?? '').slice(0, 5) : row[f.name] ?? f.default ?? ''])));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return <Container><h2>{title}</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {courseBased && <Form.Group className="mb-3" controlId={`${resource}-semester`}>
            <Form.Label>Semester filter</Form.Label><Form.Select value={semester} onChange={e => { setSemester(e.target.value); reset(); }}>
                <option value="">All semesters</option>{semesters.map(s => <option key={s.id} value={s.code}>{s.name} ({s.code})</option>)}
            </Form.Select></Form.Group>}
        {resource === 'semesters' && <p>Create a semester folder and optionally attach its Google Drive or other shared folder URL. Upload files through Manage Documents. Codes stay fixed after creation.</p>}
        {resource === 'topics' && <p>Add topics to a course. Students can save their own completion progress.</p>}
        <Form onSubmit={save} className="mb-4"><fieldset disabled={busy || loading}>
            <h5>{editing ? 'Edit record' : 'Add record'}</h5>
            {fields.map(f => <Form.Group className="mb-3" controlId={`${resource}-${f.name}`} key={f.name}>
                <Form.Label>{f.label}</Form.Label>
                {f.name === 'course_id' ? <Form.Select required value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}>
                    <option value="">Select course</option>{courses.filter(c => !semester || c.semester === semester).map(c => <option key={c.id} value={c.id}>{c.code} — {c.name} ({c.semester})</option>)}
                </Form.Select> : f.options ? <Form.Select value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })}>
                    {f.options.map(value => <option key={value} value={value}>{value}</option>)}
                </Form.Select> : <Form.Control as={f.type === 'textarea' ? 'textarea' : 'input'} type={f.type === 'textarea' ? undefined : f.type || 'text'}
                    required={!f.optional} maxLength={f.type === 'textarea' ? 10000 : f.type === 'url' ? 2048 : 255} min={f.min} max={f.max}
                    disabled={resource === 'semesters' && f.name === 'code' && Boolean(editing)}
                    value={form[f.name]} onChange={e => setForm({ ...form, [f.name]: e.target.value })} />}
            </Form.Group>)}
            {resource === 'assignments' && <Form.Group className="mb-3" controlId="assignment-file">
                <Form.Label>Attachment (PDF, DOC, DOCX, ZIP; up to 5 MB)</Form.Label>
                <Form.Control key={fileKey} type="file" accept=".pdf,.doc,.docx,.zip" onChange={e => setFile(e.target.files[0] || null)} />
                {editing && <Form.Check label="Remove existing attachment" checked={Boolean(form.remove_file)} onChange={e => setForm({ ...form, remove_file: e.target.checked ? 1 : 0 })} />}
            </Form.Group>}
            <Button type="submit">{busy ? 'Saving…' : editing ? 'Save changes' : 'Add record'}</Button>{' '}
            {editing && <Button variant="secondary" onClick={reset}>Cancel</Button>}
        </fieldset></Form>
        {loading ? <p>Loading…</p> : <Table responsive striped><thead><tr>{fields.map(f => <th key={f.name}>{f.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>{rows.filter(r => !courseBased || !semester || r.course?.semester === semester).map(row => <tr key={row.id}>
                {fields.map(f => <td key={f.name}>{f.name === 'course_id' ? `${row.course?.code || ''} (${row.course?.semester || ''})` : row[f.name] || '—'}</td>)}
                <td><Button size="sm" disabled={busy} onClick={() => edit(row)}>Edit</Button>{' '}<Button size="sm" variant="danger" disabled={busy} onClick={() => remove(row.id)}>Delete</Button></td>
            </tr>)}</tbody></Table>}
        {!loading && !rows.length && <p>No records yet. Use the form above to add one.</p>}
    </Container>;
}
