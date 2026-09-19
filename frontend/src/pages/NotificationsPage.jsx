import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default function NotificationsPage() {
    return <Container><h2>Notifications</h2><Alert variant="info">Automatic reminders are not available yet. Your saved reminder settings do not send notifications.</Alert><Link to="/dashboard/notice-board">Read published notices</Link></Container>;
}
