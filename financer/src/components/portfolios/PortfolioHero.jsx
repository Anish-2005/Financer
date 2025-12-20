import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const PortfolioHero = ({ totalBalance, financials, performanceMetrics, topPerformer }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative z-10 pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex px-3 sm:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold text-sm ml-2">Portfolio Management</span>
        </motion.div>

        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
        }`}>
          Investment
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Portfolio
          </span>
        </h1>
        <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed transition-colors px-4 sm:px-0 ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Get a comprehensive view of your investment portfolio with real-time tracking,
          performance analytics, and risk assessment across all your financial assets.
        </p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-4xl mx-auto px-4 sm:px-0"
        >
          {[
            { value: `₹${totalBalance.toLocaleString()}`, label: "Portfolio Value" },
            { value: financials.reduce((acc, item) => {
                const rate = performanceMetrics[item.type]?.rate || 0;
                return acc + (item.balance * (rate/100));
              }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), label: "Est. Annual Yield" },
            { value: topPerformer?.type || 'N/A', label: "Top Performer" },
            { value: financials.length, label: "Assets" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`backdrop-blur-sm rounded-xl p-4 sm:p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/30 border border-slate-700/50'
                  : 'bg-white/30 border border-slate-200/50'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className={`text-xs sm:text-sm mt-1 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioHero;