import React from "react";
import "../styles/notifications.css";

const sampleNotices = [
  { id: 1, title: "System Update", message: "New features added to Dashboard.", time: "Yesterday" },
  { id: 2, title: "Profile Reminder", message: "Complete your KYC for full access.", time: "2 days ago" },
  { id: 3, title: "Policy Alert: Tax & Digital Economy", message: "Government rolls out new tax reform and digital banking push.", time: "Today" },
  { id: 4, title: "Infrastructure Review", message: "Ongoing projects being reprioritized; unviable ones may be scrapped.", time: "Today" },
];

const sampleAlerts = [
  { id: 1, title: "Security Alert", message: "Suspicious login detected from a new device.", time: "Just now" },
  { id: 2, title: "Storage Limit", message: "Your cloud storage is 90% full. Consider upgrading.", time: "1 hour ago" },
  { id: 3, title: "Payment Due", message: "Your subscription payment is due tomorrow.", time: "Today" },
  { id: 4, title: "System Downtime", message: "Scheduled maintenance from 2 AM to 4 AM tonight.", time: "Today" },
];

const sampleTodos = [
  { id: 1, title: "Irrigation", message: "Water the paddy field in the morning.", time: "Today" },
  { id: 2, title: "Fertilizer Application", message: "Apply urea fertilizer to maize crop.", time: "Tomorrow" },
  { id: 3, title: "Weeding", message: "Remove weeds from vegetable plots.", time: "This week" },
  { id: 4, title: "Pest Control", message: "Spray organic pesticide on tomato plants.", time: "2 days later" },
];

const Notifications = () => {
  return (
    <div className="notifications-page" style={{ background: "var(--light-background)", minHeight: "100vh", padding: "32px 0" }}>
      <div className="container" style={{ margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(30,86,49,0.08)", padding: "32px" }}>
        <h1 className="font-bold" style={{ color: "var(--primary-green)", marginBottom: 24 }}>Notifications</h1>
        <div className="notifications-sections" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* Alerts */}
          <section className="notifications-section" style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ color: "var(--secondary-green)", marginBottom: 12 }}>Alerts</h2>
            <ul>
              {sampleAlerts.map((alert, index) => (
                <li key={index} className="notification-card alert-card">
                  <div className="font-bold">{alert.title}</div>
                  <div style={{ color: "var(--muted-gray-text)" }}>{alert.message}</div>
                  <div className="notification-time">{alert.time}</div>
                </li>
              ))}
              {sampleAlerts.length === 0 && <li className="notification-card">No alerts.</li>}
            </ul>
          </section>
          {/* Notices */}
          <section className="notifications-section" style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ color: "var(--yellow-accent)", marginBottom: 12 }}>Notices</h2>
            <ul>
              {sampleNotices.map(notice => (
                <li key={notice.id} className="notification-card notice-card">
                  <div className="font-bold">{notice.title}</div>
                  <div style={{ color: "var(--muted-gray-text)" }}>{notice.message}</div>
                  <div className="notification-time">{notice.time}</div>
                </li>
              ))}
              {sampleNotices.length === 0 && <li className="notification-card">No notices.</li>}
            </ul>
          </section>
          {/* To-Dos */}
          <section className="notifications-section" style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ color: "var(--primary-green)", marginBottom: 12 }}>To-Dos</h2>
            <ul>
              {sampleTodos.map(todo => (
                <li key={todo.task} className="notification-card todo-card">
                  <div className="font-bold">{todo.title}</div>
                  <div style={{ color: "var(--muted-gray-text)" }}>
                    {todo.message}
                  </div>
                  <div className="notification-time">
                    Due: {todo.time}
                  </div>
                </li>
              ))}
              {sampleTodos.length === 0 && <li className="notification-card">No to-dos.</li>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;