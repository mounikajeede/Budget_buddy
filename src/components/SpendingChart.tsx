import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart: React.FC = () => {
  const { transactions } = useBudget();
  const { isDarkMode } = useTheme();

  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Group expenses by category
  const categorySpending = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(categorySpending),
    datasets: [
      {
        data: Object.values(categorySpending),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#F97316', // Orange
          '#06B6D4', // Cyan
        ],
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: isDarkMode ? '#E5E7EB' : '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Spending by Category
      </h3>
      
      {Object.keys(categorySpending).length > 0 ? (
        <div className="h-80">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No expense data available
        </div>
      )}
    </div>
  );
};

export default SpendingChart;