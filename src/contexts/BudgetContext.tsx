import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  allocated: number;
  spent: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
}

interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  importTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  updateBudget: (category: string, allocated: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'isCompleted'>) => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  checkBudgetAlerts: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateBuddyPoints } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food & Dining', allocated: 500, spent: 0 },
    { category: 'Transportation', allocated: 200, spent: 0 },
    { category: 'Shopping', allocated: 300, spent: 0 },
    { category: 'Entertainment', allocated: 150, spent: 0 },
    { category: 'Bills & Utilities', allocated: 400, spent: 0 },
    { category: 'Healthcare', allocated: 100, spent: 0 },
  ]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      const storedBudgets = localStorage.getItem(`budgets_${user.id}`);
      const storedGoals = localStorage.getItem(`goals_${user.id}`);

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      }
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    }
  }, [user]);

  // Save data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`budgets_${user.id}`, JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`goals_${user.id}`, JSON.stringify(goals));
    }
  }, [goals, user]);

  // Update budget spent amounts when transactions change
  useEffect(() => {
    const newBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
    setBudgets(newBudgets);
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Award buddy points for tracking expenses
    if (transaction.type === 'expense') {
      updateBuddyPoints(5);
      toast.success('🎉 +5 Buddy Points for tracking an expense!');
    }
  };

  const importTransactions = (newTransactions: Omit<Transaction, 'id'>[]) => {
    const transactionsWithIds = newTransactions.map(t => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setTransactions(prev => [...transactionsWithIds, ...prev]);
    
    // Award buddy points for importing data
    updateBuddyPoints(20);
    toast.success(`🎉 +20 Buddy Points for importing ${newTransactions.length} transactions!`);
  };

  const updateBudget = (category: string, allocated: number) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.category === category ? { ...budget, allocated } : budget
      )
    );
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      isCompleted: false,
    };
    setGoals(prev => [newGoal, ...prev]);
    
    // Award buddy points for setting a goal
    updateBuddyPoints(10);
    toast.success('🎯 +10 Buddy Points for setting a new goal!');
  };

  const updateGoal = (id: string, amount: number) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
          const wasCompleted = goal.isCompleted;
          const isNowCompleted = newAmount >= goal.targetAmount;
          
          // Award bonus points for completing a goal
          if (!wasCompleted && isNowCompleted) {
            updateBuddyPoints(50);
            toast.success('🏆 +50 Buddy Points for completing a goal!');
          } else if (amount > 0) {
            updateBuddyPoints(15);
            toast.success('💰 +15 Buddy Points for saving money!');
          }
          
          return {
            ...goal,
            currentAmount: newAmount,
            isCompleted: isNowCompleted,
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const checkBudgetAlerts = () => {
    budgets.forEach(budget => {
      const percentage = (budget.spent / budget.allocated) * 100;
      
      if (percentage >= 90) {
        toast.error(`🚨 Alert: You've spent ${percentage.toFixed(0)}% of your ${budget.category} budget!`);
      } else if (percentage >= 75) {
        toast.error(`⚠️ Warning: You've spent ${percentage.toFixed(0)}% of your ${budget.category} budget!`);
      }
    });
  };

  return (
    <BudgetContext.Provider value={{
      transactions,
      budgets,
      goals,
      addTransaction,
      importTransactions,
      updateBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      checkBudgetAlerts,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};