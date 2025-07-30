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
import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryBreakdown: React.FC = () => {
  const { transactions, budgets } = useBudget();
  const { isDarkMode } = useTheme();

  const data = {
    labels: budgets.map(b => b.category),
    datasets: [
      {
        label: 'Spent',
        data: budgets.map(b => b.spent),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#EF4444',
        borderWidth: 1,
      },
      {
        label: 'Budget',
        data: budgets.map(b => b.allocated),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#E5E7EB' : '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
        },
      },
      y: {
        grid: {
          color: isDarkMode ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          callback: (value: any) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Budget vs Spending by Category
      </h3>
      
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryBreakdown;