import React from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../contexts/BudgetContext';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const BudgetOverview: React.FC = () => {
  const { budgets } = useBudget();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Budget Overview
      </h3>
      
      <div className="space-y-4">
        {budgets.map((budget, index) => {
          const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 75;
          
          return (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {budget.category}
                  </span>
                  {(isOverBudget || isNearLimit) && (
                    <AlertTriangle className={`w-4 h-4 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                  </div>
                  <div className={`text-xs ${
                    isOverBudget ? 'text-red-600' : 
                    isNearLimit ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  className={`h-2 rounded-full ${
                    isOverBudget ? 'bg-red-500' :
                    isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {budgets.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No budget categories set up yet
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;