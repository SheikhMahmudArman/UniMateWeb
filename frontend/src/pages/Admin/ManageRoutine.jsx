import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Table } from 'react-bootstrap';
import api from '../../services/api';

const empty = {
    time: '',
    course_code: '',
    course_name: '',
    room: '',
    day: 'Sunday'
};

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday'
];

const timeOptions = [
    '8:00 AM',
    '8:50 AM',
    '9:40 AM',
    '10:30 AM',
    '11:20 AM',
    '12:10 PM',
    '1:00 PM',
    '1:50 PM',
    '2:40 PM',
    '3:30 PM',
    '4:20 PM',
    '5:10 PM',
    '6:00 PM'
];

// Convert time such as "11:20 AM" to minutes
const timeToMinutes = time => {
    if (!time) return null;

    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (period === 'AM' && hours === 12) {
        hours = 0;
    }

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    }

    return hours * 60 + minutes;
};

// Extract start/end from stored "start - end" value
const getStoredTimes = time => {
    if (!time) {
        return {
            start: '',
            end: ''
        };
    }

    const parts = time.split(' - ');

    return {
        start: parts[0] || '',
        end: parts[1] || ''
    };
};

export default function ManageRoutine() {
    const [rows, setRows] = useState([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const load = async () => {
        try {
            setRows((await api.get('/routine')).data.data);
        } catch {
            setError('Cannot load routine.');
        }
    };

    useEffect(() => {
        load();
    }, []);

    const { start: startTime, end: endTime } =
        getStoredTimes(form.time);

    // End time must be at least 50 minutes after start time
    const availableEndTimes = startTime
        ? timeOptions.filter(
              time =>
                  timeToMinutes(time) >=
                  timeToMinutes(startTime) + 50
          )
        : [];

    const handleStartTimeChange = e => {
        const newStart = e.target.value;

        setForm({
            ...form,
            time: newStart ? `${newStart} - ` : ''
        });
    };

    const handleEndTimeChange = e => {
        const newEnd = e.target.value;

        setForm({
            ...form,
            time: startTime
                ? `${startTime} - ${newEnd}`
                : ''
        });
    };

    const save = async e => {
        e.preventDefault();
        setBusy(true);
        setError('');

        try {
            if (editing) {
                await api.put(`/routine/${editing}`, form);
            } else {
                await api.post('/routine', form);
            }

            setForm(empty);
            setEditing(null);
            await load();
        } catch (e) {
            setError(
                e.response?.data?.message ||
                    'Cannot save routine.'
            );
        } finally {
            setBusy(false);
        }
    };

    const remove = async id => {
        if (!window.confirm('Delete this class?')) return;

        try {
            await api.delete(`/routine/${id}`);
            await load();
        } catch {
            setError('Cannot delete class.');
        }
    };

    const editRow = row => {
        setEditing(row.id);

        setForm({
            time: row.time || '',
            course_code: row.course_code || '',
            course_name: row.course_name || '',
            room: row.room || '',
            day: row.day || 'Sunday'
        });
    };

    return (
        <Container>
            <h2>Manage routine</h2>

            <p>
                The current routine is shared by all students.
                Use the course code to identify each class.
            </p>

            {error && (
                <Alert variant="danger">
                    {error}
                </Alert>
            )}

            <Form onSubmit={save}>
                {/* Day */}
                <Form.Group className="mb-2">
                    <Form.Label>Day</Form.Label>

                    <Form.Select
                        required
                        value={form.day}
                        onChange={e =>
                            setForm({
                                ...form,
                                day: e.target.value
                            })
                        }
                    >
                        {days.map(day => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Start Time */}
                <Form.Group className="mb-2">
                    <Form.Label>Start Time</Form.Label>

                    <Form.Select
                        required
                        value={startTime}
                        onChange={handleStartTimeChange}
                    >
                        <option value="">
                            Select start time
                        </option>

                        {timeOptions.map(time => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* End Time */}
                <Form.Group className="mb-2">
                    <Form.Label>End Time</Form.Label>

                    <Form.Select
                        required
                        value={endTime}
                        onChange={handleEndTimeChange}
                        disabled={!startTime}
                    >
                        <option value="">
                            {startTime
                                ? 'Select end time'
                                : 'Select start time first'}
                        </option>

                        {availableEndTimes.map(time => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Course Code */}
                <Form.Group className="mb-2">
                    <Form.Label>Course Code</Form.Label>

                    <Form.Control
                        required
                        maxLength={255}
                        value={form.course_code}
                        onChange={e =>
                            setForm({
                                ...form,
                                course_code: e.target.value
                            })
                        }
                    />
                </Form.Group>

                {/* Course Name */}
                <Form.Group className="mb-2">
                    <Form.Label>Course Name</Form.Label>

                    <Form.Control
                        required
                        maxLength={255}
                        value={form.course_name}
                        onChange={e =>
                            setForm({
                                ...form,
                                course_name: e.target.value
                            })
                        }
                    />
                </Form.Group>

                {/* Room */}
                <Form.Group className="mb-2">
                    <Form.Label>Room</Form.Label>

                    <Form.Control
                        required
                        maxLength={255}
                        value={form.room}
                        onChange={e =>
                            setForm({
                                ...form,
                                room: e.target.value
                            })
                        }
                    />
                </Form.Group>

                <Button type="submit" disabled={busy}>
                    {editing ? 'Update' : 'Add'} class
                </Button>{' '}

                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                        setEditing(null);
                        setForm(empty);
                    }}
                >
                    Cancel
                </Button>
            </Form>

            <Table responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Course</th>
                        <th>Room</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            <td>{row.day}</td>

                            {/* Combined Start Time - End Time */}
                            <td>{row.time}</td>

                            <td>
                                {row.course_code} —{' '}
                                {row.course_name}
                            </td>

                            <td>{row.room}</td>

                            <td>
                                <Button
                                    size="sm"
                                    onClick={() => editRow(row)}
                                >
                                    Edit
                                </Button>{' '}

                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        remove(row.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
