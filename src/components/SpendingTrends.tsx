import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SpendingTrends: React.FC = () => {
  const { transactions } = useBudget();
  const { isDarkMode } = useTheme();

  // Get last 30 days
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  // Calculate daily spending
  const dailySpending = last30Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && t.date === dayStr)
      .reduce((sum, t) => sum + t.amount, 0);
    return dayExpenses;
  });

  const data = {
    labels: last30Days.map(day => format(day, 'MMM dd')),
    datasets: [
      {
        label: 'Daily Spending',
        data: dailySpending,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toLocaleString()}`,
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
        Spending Trends (Last 30 Days)
      </h3>
      
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SpendingTrends;