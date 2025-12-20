import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const ComparisonsEmpty = ({ isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`backdrop-blur-sm rounded-2xl p-12 text-center transition-colors ${
        isDark
          ? 'bg-slate-800/40 border border-slate-700/50'
          : 'bg-white/40 border border-slate-200/50'
      }`}
    >
      <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 w-fit mx-auto mb-4">
        <BarChart3 className="w-8 h-8 text-white" />
      </div>
      <h3 className={`text-xl font-bold mb-2 transition-colors ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>No stocks found</h3>
      <p className={`transition-colors ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        Try adjusting your filters or search criteria
      </p>
    </motion.div>
  );
};

export default ComparisonsEmpty;