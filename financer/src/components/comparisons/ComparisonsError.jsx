import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ComparisonsError = ({ isDark, error }) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`backdrop-blur-xl rounded-3xl p-12 text-center transition-colors ${
          isDark
            ? 'bg-red-900/20 border border-red-500/20'
            : 'bg-red-50/50 border border-red-200/50'
        }`}
      >
        <div className="p-4 rounded-full bg-red-500/20 w-fit mx-auto mb-4">
          <X className="w-8 h-8 text-red-400" />
        </div>
        <h3 className={`text-xl font-semibold mb-2 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>Unable to Load Market Data</h3>
        <p className={`transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>{error}</p>
      </motion.div>
    </div>
  );
};

export default ComparisonsError;