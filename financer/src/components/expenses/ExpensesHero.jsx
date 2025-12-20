import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Calendar, Tag } from 'lucide-react';

const ExpensesHero = ({
  isDark,
  categories,
  onAddExpense,
  totalExpenses,
  monthlyBudget
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddExpense({
      amount: parseFloat(amount),
      category,
      date
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <span className="text-emerald-400 font-semibold text-sm">Expense Tracker</span>
        </div>
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Track Your <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Expenses</span>
        </h1>
        <p className={`text-xl max-w-3xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Monitor your spending patterns and stay within your budget with our comprehensive expense tracking tools.
        </p>
      </motion.div>

      {/* Add Expense Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`backdrop-blur-xl rounded-3xl p-8 md:p-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-2xl font-bold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Add New Expense</h3>
            <p className={`text-sm transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Record your spending to keep track of your finances</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Tag className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className={`block text-sm font-medium mb-2 transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
              required
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add Expense
            </motion.button>
          </div>
        </form>

        {/* Budget Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl transition-colors ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Monthly Expenses</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ₹{totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl transition-colors ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Monthly Budget</p>
                <p className="text-2xl font-bold text-blue-400">
                  ₹{monthlyBudget.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Tag className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpensesHero;