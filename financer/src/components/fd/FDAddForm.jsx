import React from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  IndianRupee,
  Percent,
  Clock,
  Calendar,
  Plus
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const FDAddForm = ({ newFd, setNewFd, handleAddFD, banks }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-8 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
          >
            <span className="text-blue-400 font-semibold text-sm">Add Investment</span>
          </motion.div>
          <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Create New{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Fixed Deposit
            </span>
          </h3>
          <p className={`text-lg max-w-2xl mx-auto transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Enter the details below to track your fixed deposit investment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bank Name */}
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Bank Name</label>
            <div className="relative group">
              <PiggyBank className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-500'
              }`} />
              <select
                value={newFd.bank}
                onChange={(e) => setNewFd({ ...newFd, bank: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              >
                <option value="" className={isDark ? 'bg-slate-800' : 'bg-white'}>Select Bank</option>
                {banks.map(bank => (
                  <option key={bank} value={bank} className={isDark ? 'bg-slate-800' : 'bg-white'}>{bank}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Investment Amount</label>
            <div className="relative group">
              <IndianRupee className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-500'
              }`} />
              <input
                type="number"
                placeholder="Enter amount"
                value={newFd.amount}
                onChange={(e) => setNewFd({ ...newFd, amount: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder-slate-500'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Interest Rate (%)</label>
            <div className="relative group">
              <Percent className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-500'
              }`} />
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 6.5"
                value={newFd.rate}
                onChange={(e) => setNewFd({ ...newFd, rate: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder-slate-500'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Tenure */}
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Tenure (Months)</label>
            <div className="relative group">
              <Clock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-500'
              }`} />
              <input
                type="number"
                placeholder="e.g., 12"
                value={newFd.tenure}
                onChange={(e) => setNewFd({ ...newFd, tenure: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 placeholder-slate-500'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Start Date</label>
            <div className="relative group">
              <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-500'
              }`} />
              <input
                type="date"
                value={newFd.startDate}
                onChange={(e) => setNewFd({ ...newFd, startDate: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 [color-scheme:dark]'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddFD}
              disabled={!Object.values(newFd).every(Boolean)}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                Object.values(newFd).every(Boolean)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25'
                  : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
              Add FD
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FDAddForm;