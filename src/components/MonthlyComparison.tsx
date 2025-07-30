import React from 'react';
import { Line } from 'react-chartjs-2';
import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

const MonthlyComparison: React.FC = () => {
  const { transactions } = useBudget();
  const { isDarkMode } = useTheme();

  // Get last 6 months
  const months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { month: format(month, 'MMM yyyy'), income, expenses };
  });

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expenses),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
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
        Monthly Income vs Expenses
      </h3>
      
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyComparison;