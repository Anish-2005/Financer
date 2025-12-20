import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const LandingStats = () => {
  const { isDark } = useTheme();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={`py-20 transition-colors ${
        isDark
          ? 'bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
          : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <div className="text-4xl font-bold text-emerald-400 mb-3">15K+</div>
          <div className={`transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Financer Community Members</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-blue-400 mb-3">₹850Cr+</div>
          <div className={`transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Assets Managed</div>
        </div>
        <div className="p-6">
          <div className="text-4xl font-bold text-purple-400 mb-3">98%</div>
          <div className={`transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>User Satisfaction Rate</div>
        </div>
      </div>
    </motion.section>
  );
};

export default LandingStats;