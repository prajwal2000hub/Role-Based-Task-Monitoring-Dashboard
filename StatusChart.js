import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function StatusChart({ logs }) {
  const statusCounts = logs.reduce(
    (acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Status Count',
        data: Object.values(statusCounts),
        backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    width: 200,
    height: 200,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="mt-6">
      <h3 className="text-md mb-2">Task Status Distribution</h3>
      <div style={{ width: 200, height: 200 }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
