import React from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../contexts/BudgetContext';
import SpendingTrends from '../components/SpendingTrends';
import CategoryBreakdown from '../components/CategoryBreakdown';
import MonthlyComparison from '../components/MonthlyComparison';
import InsightsPanel from '../components/InsightsPanel';

const Analytics: React.FC = () => {
  const { transactions } = useBudget();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into your spending patterns and financial behavior
        </p>
      </div>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            📊
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No data available yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some transactions to see your analytics and insights
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <InsightsPanel />
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CategoryBreakdown />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SpendingTrends />
            </motion.div>
          </div>

          {/* Monthly Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MonthlyComparison />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Analytics;