import React from 'react';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';

const ExpensesHistory = ({
  isDark,
  filteredExpenses,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleDeleteExpense,
  getCategoryIcon,
  totalExpenses
}) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-12 gap-4 lg:gap-0">
          <div>
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3 sm:mb-4">
              <span className="text-emerald-400 font-semibold text-xs sm:text-sm">Transaction History</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Recent Expenses
            </h3>
            <p className={`text-sm sm:text-base lg:text-lg mt-2 transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track and manage your spending history
            </p>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border transition-all text-sm sm:text-base w-full lg:w-auto ${
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

        <div className="space-y-3 sm:space-y-4">
          {filteredExpenses.map((expense, index) => {
            const IconComponent = getCategoryIcon(expense.category);
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`group relative backdrop-blur-sm rounded-2xl p-4 sm:p-6 cursor-pointer overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/30 border border-slate-700/50 hover:border-slate-600'
                    : 'bg-white/30 border border-slate-200/50 hover:border-slate-300'
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-semibold transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{expense.category}</h3>
                      <p className={`text-xs sm:text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>{expense.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3 sm:gap-4">
                    <div>
                      <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        ₹{expense.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs sm:text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {((expense.amount / totalExpenses) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
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
            className="text-center py-8 sm:py-12"
          >
            <Receipt className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 transition-colors ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>No expenses found</h3>
            <p className={`text-sm sm:text-base transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>Add your first expense to get started</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ExpensesHistory;