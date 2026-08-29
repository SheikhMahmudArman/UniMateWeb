import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faBook,
    faFileCircleCheck,
    faBullhorn,
    faCheckDouble,
} from '@fortawesome/free-solid-svg-icons';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const notifications = [
        {
            id: 1,
            type: 'assignment',
            icon: faBook,
            title: 'Assignment Deadline',
            message: 'Your Database Systems assignment is due tomorrow.',
            time: '2 hours ago',
            unread: true,
        },
        {
            id: 2,
            type: 'exam',
            icon: faFileCircleCheck,
            title: 'Midterm Examination',
            message: 'Your CSE 2201 midterm examination is scheduled for next week.',
            time: '5 hours ago',
            unread: true,
        },
        {
            id: 3,
            type: 'announcement',
            icon: faBullhorn,
            title: 'University Announcement',
            message: 'The university has published a new academic notice.',
            time: 'Yesterday',
            unread: false,
        },
        {
            id: 4,
            type: 'reminder',
            icon: faBell,
            title: 'Study Reminder',
            message: 'You have pending study tasks for today.',
            time: 'Yesterday',
            unread: false,
        },
    ];

    return (
        <div className="notifications-page">
            <Container fluid>
                <div className="notifications-header">
                    <div>
                        <h2>Notifications</h2>
                        <p>Stay updated with your academic activities.</p>
                    </div>

                    <Button className="mark-read-btn">
                        <FontAwesomeIcon icon={faCheckDouble} className="me-2" />
                        Mark all as read
                    </Button>
                </div>

                <div className="notification-list">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`notification-card ${notification.unread ? 'unread' : ''
                                }`}
                        >
                            <div className={`notification-icon ${notification.type}`}>
                                <FontAwesomeIcon icon={notification.icon} />
                            </div>

                            <div className="notification-content">
                                <div className="notification-title-row">
                                    <h5>{notification.title}</h5>

                                    {notification.unread && (
                                        <span className="unread-dot"></span>
                                    )}
                                </div>

                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {notification.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default NotificationsPage;