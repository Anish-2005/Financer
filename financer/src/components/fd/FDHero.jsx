import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const FDHero = ({ totalInvestment, totalInterest, fdCount, topBank }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative z-10 pt-28 pb-16">
      <div className="container mx-auto max-w-7xl px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold text-sm ml-2">FD Management</span>
        </motion.div>

        <h1 className={`text-6xl md:text-7xl font-bold leading-tight mb-6 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
        }`}>
          Fixed Deposit
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Tracker
          </span>
        </h1>
        <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Maximize your returns with smart fixed deposit management. Track investments,
          compare rates, and optimize your portfolio for better financial growth.
        </p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
        >
          {[
            { value: `₹${totalInvestment.toLocaleString()}`, label: "Total Investment" },
            { value: `₹${totalInterest.toLocaleString()}`, label: "Est. Interest" },
            { value: fdCount, label: "Active FDs" },
            { value: topBank || '-', label: "Top Bank" }
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
      </div>
    </div>
  );
};

export default FDHero;