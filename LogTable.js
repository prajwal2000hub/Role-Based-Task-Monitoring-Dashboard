import React from 'react';

export default function LogTable({ logs }) {
  return (
    <table border="1" cellPadding="5" className="mt-4 w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Robot</th>
          <th>Task</th>
          <th>Status</th>
          <th>Remarks</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.id}</td>
            <td>{log.robot_id}</td>
            <td>{`Task_${log.task_id}`}</td>
            <td>{log.status}</td>
            <td>{log.remarks}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
