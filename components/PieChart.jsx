import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, currency = 'Rs ' }) => {
  // Aggregate amounts by category
  const categoryMap = {};
  data.forEach((item) => {
    const { categoryName, amount } = item;
    categoryMap[categoryName] = (categoryMap[categoryName] || 0) + amount;
  });

  const labels = Object.keys(categoryMap);
  const amounts = Object.values(categoryMap);

  // Generate distinct colors for each category
  const backgroundColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
    '#8BC34A',
    '#E91E63',
    '#00BCD4',
  ];

  const dataConfig = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className='m-auto csm:max-h-full max-h-[250px]'>
      <Pie data={dataConfig} options={options} />
    </div>
  );
};

export default PieChart;
