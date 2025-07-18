import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";

const API = "http://localhost:8000";

export default function App() {
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [selectedTask, setSelectedTask] = useState("a");

  const login = async (username, password) => {
    const res = await axios.post(`${API}/login`,
      new URLSearchParams({ username, password }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    setToken(res.data.access_token);
    const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
    setRole(payload.role);
  };

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks/${selectedTask}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTaskData(res.data);
  };

  const fetchReport = async () => {
    const res = await axios.get(`${API}/report/${selectedTask}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReportData(res.data.report);
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      if (role === "admin") fetchReport();
      const interval = setInterval(() => {
        fetchTasks();
        if (role === "admin") fetchReport();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [token, role, selectedTask]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🧠 Role-Based Dashboard Monitoring</h2>

      {!token ? (
        <div>
          <p><strong>Login:</strong></p>
          <button onClick={() => login("admin", "admin123")}>Login as Admin</button>{" "}
          <button onClick={() => login("employee", "emp123")}>Login as Employee</button>
        </div>
      ) : (
        <div>
          <p>✅ Logged in as <strong>{role}</strong></p>

          <div style={{ margin: "20px 0" }}>
            <label>Select Task: </label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="a">Task A</option>
              <option value="b">Task B</option>
              <option value="c">Task C</option>
            </select>
          </div>

          <h3>📋 Task Data (Task {selectedTask.toUpperCase()})</h3>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {taskData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.description}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {role === "admin" && (
            <div style={{ marginTop: 30 }}>
              <h3>📊 Report Summary</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
