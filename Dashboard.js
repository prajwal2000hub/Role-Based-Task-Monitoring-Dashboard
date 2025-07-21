import React, { useEffect, useState } from 'react';
import { getLogs } from '../api';
import LogTable from './LogTable';
import StatusChart from './StatusChart';

export default function Dashboard({ token }) {
  const [logs, setLogs] = useState([]);
  const [filterTask, setFilterTask] = useState('All');
  const [taskOptions, setTaskOptions] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await getLogs(token);
      setLogs(res.data);

      // Extract unique task IDs for dropdown
      const tasks = Array.from(new Set(res.data.map(log => log.task_id)))
        .sort((a, b) => a - b)
        .map(id => `Task_${id}`);
      setTaskOptions(tasks);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  useEffect(() => {
    fetchLogs(); // Initial fetch
    const interval = setInterval(fetchLogs, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  const filteredLogs =
    filterTask === 'All'
      ? logs
      : logs.filter(log => `Task_${log.task_id}` === filterTask);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Robot Task Logs</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Task Type:</label>
        <select
          value={filterTask}
          onChange={(e) => setFilterTask(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          {taskOptions.map((taskName) => (
            <option key={taskName} value={taskName}>
              {taskName}
            </option>
          ))}
        </select>
      </div>

      <LogTable logs={filteredLogs} />
      <StatusChart logs={filteredLogs} />
    </div>
  );
}
