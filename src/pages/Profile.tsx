import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Moon, Sun, Coins, Trophy, Target, Calendar } from 'lucide-react';
import { useBudget } from '../contexts/BudgetContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { transactions, goals } = useBudget();

  const totalTransactions = transactions.length;
  const completedGoals = goals.filter(g => g.isCompleted).length;
  const joinDate = 'January 2024'; // Mock data

  const achievements = [
    {
      title: 'First Transaction',
      description: 'Added your first transaction',
      icon: '🎯',
      earned: totalTransactions > 0,
    },
    {
      title: 'Goal Setter',
      description: 'Created your first financial goal',
      icon: '🎪',
      earned: goals.length > 0,
    },
    {
      title: 'Goal Achiever',
      description: 'Completed your first goal',
      icon: '🏆',
      earned: completedGoals > 0,
    },
    {
      title: 'Budget Master',
      description: 'Tracked 10+ transactions',
      icon: '💰',
      earned: totalTransactions >= 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and view your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Member since {joinDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Coins className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.buddyPoints || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Buddy Points</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTransactions}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="text-gray-900 dark:text-white">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.earned
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.earned 
                    ? 'text-green-900 dark:text-green-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div className="mt-2">
                    <Trophy className="w-4 h-4 text-green-600 mx-auto" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;