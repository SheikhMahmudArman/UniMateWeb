import { useContext, useEffect, useState } from 'react';
import { Alert, Card, Container, Form, Table } from 'react-bootstrap';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
const grade = total => total >= 80 ? 4 : total >= 75 ? 3.75 : total >= 70 ? 3.5 : total >= 65 ? 3.25 : total >= 60 ? 3 : total >= 55 ? 2.75 : total >= 50 ? 2.5 : total >= 45 ? 2.25 : total >= 40 ? 2 : 0;
const total = row => ['quiz', 'mid', 'online', 'final'].reduce((sum, key) => sum + Number(row[key] || 0), 0);
const average = rows => {
    const credits = rows.reduce((sum, row) => sum + Number(row.course?.credits || 0), 0);
    return credits ? rows.reduce((sum, row) => sum + grade(total(row)) * Number(row.course?.credits || 0), 0) / credits : 0;
};
export default function MarksPage() {
    const { user } = useContext(AuthContext);
    const [rows, setRows] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [semester, setSemester] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        Promise.all([api.get('/marks'), api.get('/semesters')]).then(([marks, terms]) => {
            if (!active) return;
            setRows(marks.data.data.filter(row => row.student?.user_id === user.id)); setSemesters(terms.data.data);
            setSemester(terms.data.data[0]?.code || '');
        }).catch(e => { if (active) setError(e.response?.data?.message || 'Cannot load marks. Please refresh.'); })
          .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);
    const selected = rows.filter(row => row.semester === semester);
    if (loading) return <p>Loading marks...</p>;
    return <Container fluid><h2>Marks and CGPA</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>These results use the project's current 30 + 30 + 10 + 30 mark scheme. Confirm the scheme with your teacher.</p>
        <Form.Select aria-label="Semester" value={semester} onChange={e => setSemester(e.target.value)}>
            {semesters.map(s => <option key={s.id} value={s.code}>{s.name}</option>)}
        </Form.Select>
        <Card className="my-3 p-3"><strong>Semester GPA: {average(selected).toFixed(2)}</strong><strong>Overall CGPA: {average(rows).toFixed(2)}</strong></Card>
        <Table responsive striped><thead><tr><th>Course</th><th>Credits</th><th>Quiz</th><th>Mid</th><th>Online</th><th>Final</th><th>Total</th><th>Grade point</th></tr></thead>
        <tbody>{selected.map(row => <tr key={row.id}><td>{row.course?.code} — {row.course?.name}</td><td>{row.course?.credits}</td>{['quiz','mid','online','final'].map(k => <td key={k}>{row[k]}</td>)}<td>{total(row)}</td><td>{grade(total(row)).toFixed(2)}</td></tr>)}</tbody></Table>
        {!selected.length && <p>No marks have been entered for this semester.</p>}
    </Container>;
}
