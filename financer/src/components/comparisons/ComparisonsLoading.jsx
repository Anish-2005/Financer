import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const ComparisonsLoading = ({ isDark }) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
        >
          <Activity className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className={`text-xl font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>Loading Market Data...</h3>
        <p className={`text-sm transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>Fetching latest stock information</p>
      </motion.div>
    </div>
  );
};

export default ComparisonsLoading;