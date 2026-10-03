import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Table } from 'react-bootstrap';
import api from '../../services/api';
export default function ManageAttendance() {
    const [rows,setRows]=useState([]), [students,setStudents]=useState([]), [courses,setCourses]=useState([]), [error,setError]=useState(''), [busy,setBusy]=useState(false);
    const [semester,setSemester]=useState('');
    const [form,setForm]=useState({student_id:'',course_id:'',date:'',status:'present'});
    const load=()=>Promise.all([api.get('/attendance'),api.get('/students'),api.get('/courses')]).then(([a,s,c])=>{setRows(a.data.data);setStudents(s.data.data);setCourses(c.data.data);}).catch(()=>setError('Cannot load attendance.'));
    useEffect(()=>{load();},[]);
    const save=async e=>{e.preventDefault();setBusy(true);setError('');try{await api.post('/attendance',form);await load();}catch(e){setError(e.response?.data?.message || 'Cannot save attendance.');}finally{setBusy(false);}};
    const remove=async id=>{if(!window.confirm('Delete this attendance record?'))return;try{await api.delete(`/attendance/${id}`);await load();}catch{setError('Cannot delete record.');}};
    return <Container><h2>Manage attendance</h2><p>Save one record per student, course and day. Saving the same selection updates its status.</p>{error&&<Alert variant="danger">{error}</Alert>}
    <Form.Label>Semester</Form.Label><Form.Select value={semester} onChange={e=>{setSemester(e.target.value);setForm({...form,student_id:'',course_id:''});}}><option value="">All semesters</option>{[...new Set(courses.map(c=>c.semester))].sort().map(s=><option key={s} value={s}>{s}</option>)}</Form.Select>
    <Form onSubmit={save}>
    <Form.Label>Student</Form.Label><Form.Select required value={form.student_id} onChange={e=>setForm({...form,student_id:e.target.value,course_id:''})}><option value="">Select student</option>{students.filter(s=>!semester || s.semester===semester).map(s=><option key={s.id} value={s.id}>{s.student_id} — {s.name}</option>)}</Form.Select>
    <Form.Label>Course</Form.Label><Form.Select required value={form.course_id} onChange={e=>setForm({...form,course_id:e.target.value})}><option value="">Select course</option>{courses.filter(c=>(!semester || c.semester===semester) && (!form.student_id || c.semester===students.find(s=>String(s.id)===String(form.student_id))?.semester)).map(c=><option key={c.id} value={c.id}>{c.code}</option>)}</Form.Select>
    <Form.Label>Date</Form.Label><Form.Control required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
    <Form.Label>Status</Form.Label><Form.Select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="present">Present</option><option value="absent">Absent</option></Form.Select>
    <Button className="my-3" type="submit" disabled={busy}>Save attendance</Button></Form>
    <Table responsive><thead><tr><th>Student</th><th>Course</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.filter(r=>!semester || r.course?.semester===semester).map(r=><tr key={r.id}><td>{r.student?.student_id}</td><td>{r.course?.code}</td><td>{r.date}</td><td>{r.status}</td><td><Button size="sm" onClick={()=>{setSemester(r.course?.semester || '');setForm({student_id:r.student_id,course_id:r.course_id,date:r.date.slice(0,10),status:r.status});}}>Edit</Button> <Button size="sm" variant="danger" onClick={()=>remove(r.id)}>Delete</Button></td></tr>)}</tbody></Table></Container>;
}
