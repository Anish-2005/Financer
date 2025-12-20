import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Wallet,
  Plus,
  TrendingDown,
  Calendar,
  PieChart,
  Target,
  DollarSign,
  Receipt,
  BarChart3,
  ArrowRight,
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

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const [newExpense, setNewExpense] = useState({ 
    category: "", 
    amount: "", 
    date: "" 
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

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return;
    
    const expenseToAdd = { 
      ...newExpense,
      id: Date.now(), 
      amount: parseFloat(newExpense.amount),
      month: newExpense.date.slice(0, 7)
    };
    
    setExpenses(prev => [...prev, expenseToAdd]);
    setNewExpense({ category: "", amount: "", date: "" });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const filteredExpenses = expenses.filter(expense => 
    (selectedCategory === "All" || expense.category === selectedCategory) &&
    expense.date.startsWith(selectedMonth)
  );

  const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  const averageDaily = totalExpenses / new Date(selectedMonth).getDate();
  const categories = [
    ...new Set([
      ...Object.keys(predefinedCategories),
      ...expenses.map(expense => expense.category)
    ])
  ].sort();

  // Organized chart data with non-zero values
  const chartData = {
    labels: categories
      .map(cat => ({
        category: cat,
        amount: filteredExpenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0)
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .map(item => item.category),
    
    datasets: [{
      data: categories
        .map(cat => filteredExpenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0))
        .filter(amount => amount > 0)
        .sort((a, b) => b - a),
      backgroundColor: [
        '#4ADE80', '#60A5FA', '#C084FC', '#F472B6', '#F59E0B',
        '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'
      ],
    }]
  };

  const getCategoryIcon = (category) => {
    const iconName = predefinedCategories[category] || 'Receipt';
    const icons = {
      ShoppingCart, Home, Zap, Car, Film, Heart, UtensilsCrossed,
      GraduationCap, ShoppingBag, Plane, PiggyBank, Receipt
    };
    return icons[iconName] || Receipt;
  };
  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-colors ${
              isDark
                ? 'bg-slate-800/50 border border-emerald-500/20'
                : 'bg-white/50 border border-emerald-500/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-400 font-medium">Smart Expense Tracking</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className={`text-6xl md:text-7xl font-bold leading-tight transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
            }`}>
              Track Every
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Rupee Wisely
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Monitor your spending patterns, categorize expenses, and gain insights into your financial habits
              with our intelligent expense tracking system.
            </p>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
          >
            {[
              { value: `₹${totalExpenses.toLocaleString()}`, label: "This Month" },
              { value: `₹${averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, label: "Daily Avg" },
              { value: categories.length, label: "Categories" },
              { value: filteredExpenses.length, label: "Transactions" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`backdrop-blur-sm rounded-xl p-6 transition-colors ${
                  isDark
                    ? 'bg-slate-800/30 border border-slate-700/50'
                    : 'bg-white/30 border border-slate-200/50'
                }`}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Add Expense Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`backdrop-blur-xl rounded-3xl p-12 transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
              : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
          }`}
        >
          <div className="text-center mb-12">
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-emerald-400 font-semibold text-sm">Add New Expense</span>
            </div>
            <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Record Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Spending
              </span>
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Category</label>
                <div className="relative">
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className={`w-full p-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-400/20 appearance-none`}
                  >
                    <option value="" className={isDark ? 'bg-slate-800' : 'bg-white'}>Select Category</option>
                    {categories.map(cat => {
                      const IconComponent = getCategoryIcon(cat);
                      return (
                        <option
                          key={cat}
                          value={cat}
                          className={isDark ? 'bg-slate-800' : 'bg-white'}
                        >
                          {cat}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Amount</label>
                <div className="relative">
                  <DollarSign className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-400/20`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Date</label>
                <div className="relative">
                  <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-400/20`}
                  />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleAddExpense}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-3"
            >
              <Plus className="w-6 h-6" />
              Add Expense
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Spending Analytics
          </h3>
          <p className={`text-xl max-w-2xl mx-auto transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Visualize your spending patterns and gain insights into your financial habits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`backdrop-blur-sm rounded-2xl p-8 transition-colors ${
              isDark
                ? 'bg-slate-800/40 border border-slate-700/50'
                : 'bg-white/40 border border-slate-200/50'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Spending Breakdown</h3>
                  <p className={`text-sm transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Category distribution</p>
                </div>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="2025-03">March 2025</option>
                <option value="2025-02">February 2025</option>
              </select>
            </div>
            <div className="h-80">
              <Pie
                data={{
                  ...chartData,
                  datasets: [{
                    ...chartData.datasets[0],
                    backgroundColor: [
                      '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
                      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                    ],
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: isDark ? '#E2E8F0' : '#374151',
                        font: { size: 14 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `₹${ctx.raw.toLocaleString()} (${((ctx.raw/totalExpenses)*100).toFixed(1)}%)`
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>

          {/* Insights Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`backdrop-blur-sm rounded-2xl p-8 transition-colors ${
              isDark
                ? 'bg-slate-800/40 border border-slate-700/50'
                : 'bg-white/40 border border-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Financial Insights</h3>
                <p className={`text-sm transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Key spending metrics</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-4 rounded-xl transition-colors ${
                isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>Monthly Total</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">
                    ₹{totalExpenses.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl transition-colors ${
                isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>Daily Average</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">
                    ₹{averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-xl transition-colors ${
                isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-purple-400" />
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>Transactions</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-400">
                    {filteredExpenses.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`backdrop-blur-xl rounded-3xl p-12 transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
              : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <span className="text-emerald-400 font-semibold text-sm">Transaction History</span>
              </div>
              <h3 className={`text-4xl md:text-5xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Recent Expenses
              </h3>
              <p className={`text-lg mt-2 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Track and manage your spending history
              </p>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-6 py-3 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredExpenses.map((expense, index) => {
              const IconComponent = getCategoryIcon(expense.category);
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`group relative backdrop-blur-sm rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-800/30 border border-slate-700/50 hover:border-slate-600'
                      : 'bg-white/30 border border-slate-200/50 hover:border-slate-300'
                  }`}
                >
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>{expense.category}</h3>
                        <p className={`text-sm transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>{expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                          ₹{expense.amount.toLocaleString()}
                        </p>
                        <p className={`text-sm transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {((expense.amount / totalExpenses) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredExpenses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Receipt className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>No expenses found</h3>
              <p className={`transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>Add your first expense to get started</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ExpensesPage;