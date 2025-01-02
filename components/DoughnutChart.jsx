import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data, currency }) => {
  // Group by categoryName and sum amounts
  const categoryMap = data.reduce((acc, item) => {
    const categoryName = item.categoryName;
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += item.amount;
    return acc;
  }, {});

  // Data for the doughnut chart
  const labels = Object.keys(categoryMap);
  const amounts = Object.values(categoryMap);

  // Chart.js data object
  const chartData = {
    labels: labels,
    datasets: [{
      data: amounts,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Customize colors here
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const amount = context.raw;
            const formattedAmount = new Intl.NumberFormat().format(amount);
            return `${currency} ${formattedAmount}`;
          }
        }
      }
    },
    // Size configuration
    options: {
      height: '50%', // Height of the chart
      width: '50%', // Width of the chart
    }
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default DoughnutChart;
