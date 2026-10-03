import { useContext, useEffect, useState } from 'react';
import { Alert, Card, Col, Container, Form, ProgressBar, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import api from '../services/api';
import './DashboardHome.css';

export default function DashboardHome() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(null);
    useEffect(() => {
        let active = true;
        api.get('/dashboard').then(r => { if (active) setData(r.data.data); })
            .catch(() => { if (active) setError('Cannot load dashboard. Please reload.'); });
        return () => { active = false; };
    }, []);
    const toggle = async topic => {
        setBusy(topic.id); setError('');
        try {
            await api.put('/topics/' + topic.id + '/completion', { completed: !topic.completed });
            setData(previous => ({ ...previous, courses: previous.courses.map(course => ({ ...course,
                topics: course.topics.map(t => t.id === topic.id ? { ...t, completed: !t.completed } : t)
            })) }));
        } catch { setError('Cannot save topic progress. Please try again.'); }
        finally { setBusy(null); }
    };
    return <Container fluid className="dashboard-home">
        <h2>Dashboard</h2><p>Welcome back, {user?.name}!</p>
        {error && <Alert variant="danger">{error}</Alert>}
        {!data ? !error && <p>Loading…</p> : <>
            <Row>{[
                ['Upcoming Quizzes', data.stats.upcoming_quizzes, 'quiz'],
                ['Pending Assignments', data.stats.pending_assignments, 'assignments'],
                ['Current CGPA', data.stats.current_cgpa, 'cgpa'],
                ['Notices', data.notices.length, 'notice-board'],
                ['Attendance', data.attendance.percentage + '%', 'attendance'],
                ['Available Books', data.library.available_books, 'library']
            ].map(([label, value, path]) => <Col md={4} className="mb-3" key={path}><Card className="stat-card"><Card.Body>
                <h5>{label}</h5><h2>{value}</h2><Link to={'/dashboard/' + path}>View details</Link>
            </Card.Body></Card></Col>)}</Row>
            {user?.role === 'admin' && <Link className="btn btn-primary mb-3" to="/dashboard/admin">Open admin management</Link>}
            <Row><Col lg={7}><Card className="mb-3"><Card.Header>Semester Routine</Card.Header><Card.Body>
                {data.routine.length ? <Table responsive><thead><tr><th>Semester</th><th>Day</th><th>Time</th><th>Course</th><th>Room</th></tr></thead>
                    <tbody>{data.routine.map(r => <tr key={r.id}><td>{r.semester || 'Unassigned'}</td><td>{r.day}</td><td>{r.time}</td><td>{r.course_code} — {r.course_name}</td><td>{r.room}</td></tr>)}</tbody>
                </Table> : <p>No routine has been added for your semester.</p>}
            </Card.Body></Card></Col><Col lg={5}><Card><Card.Header>Topics & Progress</Card.Header><Card.Body>
                {!data.courses.length && <p>No courses have been added for your semester.</p>}
                {data.courses.map(course => {
                    const progress = course.topics.length ? Math.round(course.topics.filter(t => t.completed).length / course.topics.length * 100) : 0;
                    return <div className="mb-4" key={course.id}><h5>{course.code} — {course.name}</h5>
                        <ProgressBar className="mb-2" now={progress} label={progress + '%'} />
                        {!course.topics.length && <p>No topics added yet.</p>}
                        {course.topics.map(topic => <Form.Check key={topic.id} id={'topic-' + topic.id} label={topic.title} checked={topic.completed} disabled={busy !== null} onChange={() => toggle(topic)} />)}
                    </div>;
                })}
            </Card.Body></Card></Col></Row>
        </>}
    </Container>;
}
