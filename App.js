// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BASE_URL = 'http://localhost:8000';

function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState('a');
  const [reportData, setReportData] = useState([]);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async () => {
    try {
      const form = new URLSearchParams();
      form.append('username', loginForm.username);
      form.append('password', loginForm.password);

      const response = await axios.post(`${BASE_URL}/login`, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      setToken(response.data.access_token);
      setUsername(loginForm.username);

      const decoded = JSON.parse(atob(response.data.access_token.split('.')[1]));
      setRole(decoded.role);
      setLoginError('');
    } catch (err) {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks/${taskFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/report/${taskFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data.report);
    } catch (err) {
      console.error('Failed to fetch report', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchReport();
    }
  }, [token, taskFilter]);

  if (!token) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={loginForm.username}
          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>
      <h2>Welcome, {username} ({role})</h2>
      <label>Select Task: </label>
      <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
        <option value="a">Task A</option>
        <option value="b">Task B</option>
        <option value="c">Task C</option>
      </select>

      <h3>Task List</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Report</h3>
      <ResponsiveContainer width="60%" height={300}>
        <BarChart data={reportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
