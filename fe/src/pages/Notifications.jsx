import React, { useState, useEffect
 } from "react";
import "../styles/notifications.css";
import { getAlerts, getTodos } from "../api/notifications";
import {useAuth} from "../context/AuthContext";


const sampleNotices = [
  { id: 1, title: "System Update", message: "New features added to Dashboard.", time: "Yesterday" },
  { id: 2, title: "Profile Reminder", message: "Complete your KYC for full access.", time: "2 days ago" },
];

const Notifications = () => {
    const { user } = useAuth();
    const userId = user ? user.id : null;

    const [alerts, setAlerts] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const alertsDB = await getAlerts(userId);
      setAlerts(alertsDB.notices);
      console.log("alerts in fe", alerts);
    };
    const fetchTodos = async () => {
      const todosDB = await getTodos(userId);
      setTodos(todosDB.todo);
    };

    if (userId) {
      fetchAlerts();
      fetchTodos();
    }
  }, [userId]);

  const toggleTodo = (id) => {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <div className="notifications-page" style={{ background: "var(--light-background)", minHeight: "100vh", padding: "32px 0" }}>
      <div className="container" style={{ margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 16px rgba(30,86,49,0.08)", padding: "32px" }}>
        <h1 className="font-bold" style={{ color: "var(--primary-green)", marginBottom: 24 }}>Notifications</h1>
        <div className="notifications-sections" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* Alerts */}
          <section className="notifications-section" style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ color: "var(--secondary-green)", marginBottom: 12 }}>Alerts</h2>
            <ul>
              {alerts.map((alert, index) => (
                <li key={index} className="notification-card alert-card">
                  <div className="font-bold">{alert.title}</div>
                  <div style={{ color: "var(--muted-gray-text)" }}>{alert.message}</div>
                  <div className="notification-time">{alert.time}</div>
                </li>
              ))}
              {alerts.length === 0 && <li className="notification-card">No alerts.</li>}
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
    {todos.map(todo => (
      <li key={todo.task} className="notification-card todo-card">
        <div className="font-bold">{todo.task}</div>
        <div style={{ color: "var(--muted-gray-text)" }}>
          {todo.description}
        </div>
        <div className="notification-time">
          Due: {new Date(todo.due_date).toLocaleDateString()}
        </div>
      </li>
    ))}
    {todos.length === 0 && <li className="notification-card">No to-dos.</li>}
  </ul>
</section>
        </div>
      </div>
    </div>
  );
};

export default Notifications;