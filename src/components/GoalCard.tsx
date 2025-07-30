import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Minus, Trash2, Calendar, Trophy } from 'lucide-react';
import { Goal, useBudget } from '../contexts/BudgetContext';
import { format, differenceInDays } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { updateGoal, deleteGoal } = useBudget();
  const [amount, setAmount] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
  const isOverdue = daysLeft < 0;

  const handleAddFunds = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      updateGoal(goal.id, value);
      setAmount('');
      setShowAddFunds(false);
    }
  };

  const handleSubtractFunds = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      updateGoal(goal.id, -value);
      setAmount('');
      setShowAddFunds(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border transition-all ${
        goal.isCompleted 
          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            goal.isCompleted 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
          }`}>
            {goal.isCompleted ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {goal.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {goal.category}
            </p>
          </div>
        </div>
        
        {!goal.isCompleted && (
          <button
            onClick={() => deleteGoal(goal.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-2 rounded-full ${
              goal.isCompleted ? 'bg-green-500' : 'bg-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${goal.currentAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            ${goal.targetAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className={`${
          isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {isOverdue 
            ? `Overdue by ${Math.abs(daysLeft)} days`
            : `${daysLeft} days left`
          }
        </span>
      </div>

      {!goal.isCompleted && (
        <div className="space-y-3">
          {!showAddFunds ? (
            <button
              onClick={() => setShowAddFunds(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Funds
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddFunds}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
                <button
                  onClick={handleSubtractFunds}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Minus className="w-3 h-3" />
                  Remove
                </button>
                <button
                  onClick={() => {
                    setShowAddFunds(false);
                    setAmount('');
                  }}
                  className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {goal.isCompleted && (
        <div className="text-center py-2">
          <p className="text-green-600 font-medium">🎉 Goal Completed!</p>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;