import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Target, CreditCard } from 'lucide-react';
import TransactionForm from './TransactionForm';
import CSVUpload from './CSVUpload';
import GoalForm from './GoalForm';

const QuickActions: React.FC = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const actions = [
    {
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: Plus,
      color: 'bg-blue-500',
      onClick: () => setShowTransactionForm(true),
    },
    {
      title: 'Import CSV',
      description: 'Upload transaction data from file',
      icon: Upload,
      color: 'bg-green-500',
      onClick: () => setShowUpload(true),
    },
    {
      title: 'Set Goal',
      description: 'Create a new savings goal',
      icon: Target,
      color: 'bg-purple-500',
      onClick: () => setShowGoalForm(true),
    },
    {
      title: 'View Budgets',
      description: 'Check your budget status',
      icon: CreditCard,
      color: 'bg-orange-500',
      onClick: () => {}, // Could navigate to budgets section
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showTransactionForm && (
        <TransactionForm onClose={() => setShowTransactionForm(false)} />
      )}
      {showUpload && (
        <CSVUpload onClose={() => setShowUpload(false)} />
      )}
      {showGoalForm && (
        <GoalForm onClose={() => setShowGoalForm(false)} />
      )}
    </>
  );
};

export default QuickActions;