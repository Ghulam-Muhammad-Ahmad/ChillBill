import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Helper function to get the week number within the month
function getWeekOfMonth(date) {
  const d = new Date(date);
  const day = d.getDate();
  return Math.ceil(day / 7);
}

// Helper function to get the full month name
function getMonthName(date) {
  const d = new Date(date);
  return d.toLocaleString('default', { month: 'long' });
}

const BarChart = ({ data, currency = 'Rs ' }) => {
  // Aggregate data by "MonthName - WeekNumber"
  const weekMap = {};
  data.forEach(({ date, amount }) => {
    const week = getWeekOfMonth(date);
    const monthName = getMonthName(date);
    const key = `${monthName} - Week ${week}`;
    weekMap[key] = (weekMap[key] || 0) + amount;
  });

  // Sort the keys chronologically
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const sortedWeeks = Object.keys(weekMap).sort((a, b) => {
    const [monthA, weekA] = a.split(' - Week ').map((val, idx) => idx === 1 ? parseInt(val) : val);
    const [monthB, weekB] = b.split(' - Week ').map((val, idx) => idx === 1 ? parseInt(val) : val);

    const monthIndexA = monthOrder.indexOf(monthA);
    const monthIndexB = monthOrder.indexOf(monthB);

    if (monthIndexA !== monthIndexB) return monthIndexA - monthIndexB;
    return weekA - weekB;
  });

  const amounts = sortedWeeks.map((week) => weekMap[week]);

  // Define a fixed color palette
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#C9CBCF', '#8BC34A', '#E91E63', '#00BCD4',
  ];
  const backgroundColors = sortedWeeks.map((_, i) => baseColors[i % baseColors.length]);

  const dataConfig = {
    labels: sortedWeeks,
    datasets: [
      {
        label: 'Amount Spent',
        data: amounts,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${currency}${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
        },
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          display: false,
          callback: (val) => `${currency}${val.toLocaleString()}`,
        },
        title: {
          display: false,
        },
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div className='w-full'>
      <Bar data={dataConfig} options={options} />
    </div>
  );
};

export default BarChart;
