import React, { createContext, useState, useEffect, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [reminderTime, setReminderTime] = useState('15');

    useEffect(() => {
        const saved = localStorage.getItem('notificationPrefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            setNotificationsEnabled(prefs.enabled);
            setReminderTime(prefs.time);
        }
    }, []);

    const updateNotificationPrefs = (enabled, time) => {
        setNotificationsEnabled(enabled);
        setReminderTime(time);
        localStorage.setItem('notificationPrefs', JSON.stringify({ enabled, time }));
    };

    return (
        <NotificationContext.Provider value={{ notificationsEnabled, reminderTime, updateNotificationPrefs }}>
            {children}
        </NotificationContext.Provider>
    );
};