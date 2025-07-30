import React from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../contexts/BudgetContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { format } from 'date-fns';

const RecentTransactions: React.FC = () => {
  const { transactions } = useBudget();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Recent Transactions
      </h3>
      
      <div className="space-y-4">
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-600'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownLeft className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {transaction.category} • {format(new Date(transaction.date), 'MMM dd')}
                </p>
              </div>
            </div>
            <div className={`font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
      
      {recentTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No transactions yet. Add your first transaction to get started!
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;