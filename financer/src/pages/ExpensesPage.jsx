import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Home,
  Zap,
  Car,
  Film,
  Heart,
  UtensilsCrossed,
  GraduationCap,
  ShoppingBag,
  Plane,
  PiggyBank
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import ExpensesHero from "../components/expenses/ExpensesHero";
import ExpensesAnalytics from "../components/expenses/ExpensesAnalytics";
import ExpensesHistory from "../components/expenses/ExpensesHistory";

const predefinedCategories = {
  'Groceries': 'ShoppingCart',
  'Rent': 'Home',
  'Utilities': 'Zap',
  'Transportation': 'Car',
  'Entertainment': 'Film',
  'Healthcare': 'Heart',
  'Dining': 'UtensilsCrossed',
  'Education': 'GraduationCap',
  'Shopping': 'ShoppingBag',
  'Travel': 'Plane',
  'Savings': 'PiggyBank'
};

const ExpensesPage = () => {
  const { isDark } = useTheme();
  const [expenses, setExpenses] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("2025-03");

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('expenses');
        setExpenses([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAddExpense = (expenseData) => {
    const expenseToAdd = {
      ...expenseData,
      id: Date.now(),
      month: expenseData.date.slice(0, 7)
    };

    setExpenses(prev => [...prev, expenseToAdd]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const categories = Object.keys(predefinedCategories);

  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = selectedCategory === "All" || expense.category === selectedCategory;
    const monthMatch = expense.month === selectedMonth;
    return categoryMatch && monthMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageDaily = totalExpenses / 30; // Assuming 30 days in a month
  const monthlyBudget = 50000; // This could be made configurable

  const getCategoryIcon = (category) => {
    const iconName = predefinedCategories[category];
    switch (iconName) {
      case 'ShoppingCart': return ShoppingCart;
      case 'Home': return Home;
      case 'Zap': return Zap;
      case 'Car': return Car;
      case 'Film': return Film;
      case 'Heart': return Heart;
      case 'UtensilsCrossed': return UtensilsCrossed;
      case 'GraduationCap': return GraduationCap;
      case 'ShoppingBag': return ShoppingBag;
      case 'Plane': return Plane;
      case 'PiggyBank': return PiggyBank;
      default: return ShoppingCart;
    }
  };

  const chartData = {
    labels: categories,
    datasets: [{
      data: categories.map(category => {
        return filteredExpenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0);
      }),
      backgroundColor: [
        '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
      ],
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <AnimatedBackground />

      <ExpensesHero
        isDark={isDark}
        categories={categories}
        onAddExpense={handleAddExpense}
        totalExpenses={totalExpenses}
        monthlyBudget={monthlyBudget}
      />

      <ExpensesAnalytics
        isDark={isDark}
        chartData={chartData}
        totalExpenses={totalExpenses}
        averageDaily={averageDaily}
        filteredExpenses={filteredExpenses}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <ExpensesHistory
        isDark={isDark}
        filteredExpenses={filteredExpenses}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleDeleteExpense={handleDeleteExpense}
        getCategoryIcon={getCategoryIcon}
        totalExpenses={totalExpenses}
      />

      <Footer />
    </div>
  );
};

export default ExpensesPage;