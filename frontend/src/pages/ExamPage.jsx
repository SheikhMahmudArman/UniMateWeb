import { useContext, useEffect, useState } from 'react';
import { Alert, Card, Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import api from '../services/api';

export default function ExamPage({ type, title }) {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        let active = true;
        Promise.all([api.get('/marks'), api.get('/notices')]).then(([marks, notices]) => {
            if (active) setData({ marks: marks.data.data.filter(m => m.student?.user_id === user.id),
                notices: notices.data.data.filter(n => n.type === 'exam' && n.is_published) });
        }).catch(() => { if (active) setError('Cannot load exam information. Please reload.'); });
        return () => { active = false; };
    }, [user.id]);
    return <Container><h2>{title}</h2>{error && <Alert variant="danger">{error}</Alert>}
        {user.role === 'admin' && <p><Link to="/dashboard/admin/notices">Publish exam notices</Link> · <Link to="/dashboard/admin/marks">Enter exam marks</Link></p>}
        {!data ? !error && <p>Loading…</p> : <>
            <h4>Recorded results</h4>{!data.marks.length ? <p>No results have been entered for your account.</p> : <Table responsive><thead><tr><th>Semester</th><th>Course</th><th>Marks</th></tr></thead>
                <tbody>{data.marks.map(m => <tr key={m.id}><td>{m.semester}</td><td>{m.course?.code} — {m.course?.name}</td><td>{m[type]}</td></tr>)}</tbody></Table>}
            <h4>Published exam notices</h4>{!data.notices.length && <p>No exam notices published yet.</p>}
            {data.notices.map(n => <Card className="mb-3" key={n.id}><Card.Body><h5>{n.title}</h5><p>{n.date}</p><p style={{ whiteSpace: 'pre-wrap' }}>{n.content}</p></Card.Body></Card>)}
            <Link to="/dashboard/topics">Course topics</Link> · <Link to="/dashboard/folders">Semester materials</Link>
        </>}
    </Container>;
}
