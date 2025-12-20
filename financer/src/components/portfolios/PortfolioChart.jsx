import React from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { PieChart } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const PortfolioChart = ({ sortedFinancials, chartData }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 transition-colors ${
        isDark
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
          : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
      }`}
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex px-3 sm:px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <span className="text-purple-400 font-semibold text-sm">Allocation</span>
        </div>
        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Portfolio
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Breakdown
          </span>
        </h3>
      </div>

      {sortedFinancials.length > 0 ? (
        <div className="h-64 sm:h-72 md:h-80 flex items-center justify-center">
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: isDark ? '#e2e8f0' : '#475569',
                    font: { size: 14 }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const value = context.parsed;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return `₹${value.toLocaleString()} (${percentage}%)`;
                    }
                  }
                }
              },
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      ) : (
        <div className="h-64 sm:h-72 md:h-80 flex items-center justify-center">
          <div className="text-center px-4">
            <PieChart className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 transition-colors ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h4 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              No investments yet
            </h4>
            <p className={`text-sm sm:text-base transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Add your first investment to see the breakdown
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioChart;