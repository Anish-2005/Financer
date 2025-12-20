import React from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Target, TrendingDown, BarChart3, Receipt } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensesAnalytics = ({
  isDark,
  chartData,
  totalExpenses,
  averageDaily,
  filteredExpenses,
  selectedMonth,
  setSelectedMonth
}) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6">
          <span className="text-emerald-400 font-semibold text-xs sm:text-sm">Analytics Dashboard</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Spending <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Analytics</span>
        </h2>
        <p className={`text-base sm:text-lg md:text-xl max-w-3xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Visualize your spending patterns and gain insights into your financial habits.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 transition-colors ${
            isDark
              ? 'bg-slate-800/40 border border-slate-700/50'
              : 'bg-white/40 border border-slate-200/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Expense Breakdown</h3>
                <p className={`text-xs sm:text-sm transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Category-wise spending distribution</p>
              </div>
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
                isDark
                  ? 'bg-slate-800 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="2025-03">March 2025</option>
              <option value="2025-02">February 2025</option>
            </select>
          </div>
          <div className="h-64 sm:h-80">
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
          className={`backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 transition-colors ${
            isDark
              ? 'bg-slate-800/40 border border-slate-700/50'
              : 'bg-white/40 border border-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>Financial Insights</h3>
              <p className={`text-xs sm:text-sm transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>Key spending metrics</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className={`p-3 sm:p-4 rounded-xl transition-colors ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className={`font-medium transition-colors text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Monthly Total</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-emerald-400">
                  ₹{totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl transition-colors ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className={`font-medium transition-colors text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Daily Average</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-blue-400">
                  ₹{averageDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl transition-colors ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <span className={`font-medium transition-colors text-sm sm:text-base ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Transactions</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-purple-400">
                  {filteredExpenses.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpensesAnalytics;