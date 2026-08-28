import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Table, Badge, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AttendancePage = () => {
    const { user } = useContext(AuthContext);
    const [attendanceData, setAttendanceData] = useState([]);
    const [summary, setSummary] = useState({ total_classes: 0, present: 0, absent: 0, percentage: 0 });
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            // Fetch student ID first
            const studentResponse = await api.get('/students');
            const student = studentResponse.data.data.find(s => s.user_id === user.id);
            
            if (student) {
                const response = await api.get(`/attendance/summary?student_id=${student.id}`);
                if (response.data.success) {
                    setSummary(response.data.data);
                    setAttendanceData(response.data.data.records || []);
                }
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = filter === 'all' 
        ? attendanceData 
        : attendanceData.filter(item => item.status === filter);

    const getStatusBadge = (status) => {
        if (status === 'present') return <Badge bg="success">Present</Badge>;
        else return <Badge bg="danger">Absent</Badge>;
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="attendance-page" style={{ padding: '20px' }}>
            <h2 className="page-title"><FontAwesomeIcon icon={faCalendarCheck} className="me-2" /> Attendance</h2>
            <p className="text-muted">View your attendance records for all courses.</p>

            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <h5>Attendance Summary</h5>
                    <div className="d-flex flex-wrap gap-4">
                        <div><strong>Total Classes:</strong> {summary.total_classes}</div>
                        <div><strong>Present:</strong> {summary.present}</div>
                        <div><strong>Absent:</strong> {summary.absent}</div>
                        <div>
                            <strong>Attendance Percentage:</strong> 
                            <span className={summary.percentage >= 75 ? "text-success" : "text-danger"}>
                                {summary.percentage}%
                            </span>
                        </div>
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
                            {filteredData.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">No records found</td></tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.course?.code || 'N/A'}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td>{getStatusBadge(item.status)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AttendancePage;