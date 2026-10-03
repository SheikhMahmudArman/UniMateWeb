import { useState } from 'react';
import { NotificationContext } from './notification';
function savedPreferences() {
    try { return JSON.parse(localStorage.getItem('notificationPrefs')) || {}; }
    catch { return {}; }
}
export const NotificationProvider = ({ children }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => savedPreferences().enabled ?? true);
    const [reminderTime, setReminderTime] = useState(() => savedPreferences().time || '15');
    const updateNotificationPrefs = (enabled, time) => {
        setNotificationsEnabled(enabled); setReminderTime(time);
        localStorage.setItem('notificationPrefs', JSON.stringify({ enabled, time }));
    };
    return <NotificationContext.Provider value={{ notificationsEnabled, reminderTime, updateNotificationPrefs }}>{children}</NotificationContext.Provider>;
};
