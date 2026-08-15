import React, { useState } from 'react';
import { Container, Card, Table, Badge, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const AttendancePage = () => {
    // মক অ্যাটেনডেন্স ডাটা
    const [attendanceData] = useState([
        { id: 1, course: 'CSE 1101', date: '2026-08-01', status: 'present' },
        { id: 2, course: 'CSE 1101', date: '2026-08-03', status: 'present' },
        { id: 3, course: 'CSE 1101', date: '2026-08-05', status: 'absent' },
        { id: 4, course: 'CSE 1103', date: '2026-08-02', status: 'present' },
        { id: 5, course: 'CSE 1103', date: '2026-08-04', status: 'present' },
        { id: 6, course: 'CSE 1103', date: '2026-08-06', status: 'present' },
        { id: 7, course: 'CSE 1201', date: '2026-08-01', status: 'present' },
        { id: 8, course: 'CSE 1201', date: '2026-08-08', status: 'absent' },
    ]);

    const [filter, setFilter] = useState('all');

    const filteredData = filter === 'all' 
        ? attendanceData 
        : attendanceData.filter(item => item.status === filter);

    const getStatusBadge = (status) => {
        if (status === 'present') return <Badge bg="success">Present</Badge>;
        else return <Badge bg="danger">Absent</Badge>;
    };

    // উপস্থিতির পরিসংখ্যান
    const totalClasses = attendanceData.length;
    const presentClasses = attendanceData.filter(item => item.status === 'present').length;
    const absentClasses = totalClasses - presentClasses;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    return (
        <Container fluid className="attendance-page" style={{ padding: '20px' }}>
            <h2 className="page-title"><FontAwesomeIcon icon={faCalendarCheck} className="me-2" /> Attendance</h2>
            <p className="text-muted">View your attendance records for all courses.</p>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <h5>Attendance Summary</h5>
                    <div className="d-flex flex-wrap gap-4">
                        <div><strong>Total Classes:</strong> {totalClasses}</div>
                        <div><strong>Present:</strong> {presentClasses}</div>
                        <div><strong>Absent:</strong> {absentClasses}</div>
                        <div><strong>Attendance Percentage:</strong> <span className={attendancePercentage >= 75 ? "text-success" : "text-danger"}>{attendancePercentage}%</span></div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Detailed Records</h5>
                        <Form.Select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </Form.Select>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.course}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(item.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AttendancePage;