import React from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../contexts/BudgetContext';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const InsightsPanel: React.FC = () => {
  const { transactions, budgets } = useBudget();

  const generateInsights = () => {
    const insights = [];
    
    // Spending pattern insights
    const expenses = transactions.filter(t => t.type === 'expense');
    const categorySpending = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending).sort(([,a], [,b]) => b - a)[0];
    if (topCategory) {
      insights.push({
        type: 'trend',
        title: 'Top Spending Category',
        description: `You spend most on ${topCategory[0]} ($${topCategory[1].toLocaleString()})`,
        icon: TrendingUp,
        color: 'text-blue-600',
      });
    }

    // Budget alerts
    const overBudgetCategories = budgets.filter(b => b.spent > b.allocated);
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Budget Exceeded',
        description: `You're over budget in ${overBudgetCategories.length} category(ies)`,
        icon: AlertTriangle,
        color: 'text-red-600',
      });
    }

    // Savings opportunity
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    if (savingsRate > 0 && savingsRate < 20) {
      insights.push({
        type: 'tip',
        title: 'Savings Opportunity',
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing to 20%`,
        icon: Lightbulb,
        color: 'text-yellow-600',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Insights
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center gap-3 mb-2">
              <insight.icon className={`w-5 h-5 ${insight.color}`} />
              <h4 className="font-medium text-gray-900 dark:text-white">
                {insight.title}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insight.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;