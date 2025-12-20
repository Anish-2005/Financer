import React from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  Filter,
  BarChart3,
  Trash2
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const FDPortfolio = ({
  filteredFds,
  selectedBank,
  setSelectedBank,
  sortBy,
  setSortBy,
  banks,
  handleDeleteFD,
  calculateMaturityDate
}) => {
  const { isDark } = useTheme();

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3 sm:mb-4">
              <span className="text-purple-400 font-semibold text-xs sm:text-sm">Your Portfolio</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Fixed Deposit
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="space-y-2 flex-1 sm:flex-none">
              <label className={`text-xs sm:text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Filter Bank</label>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-xl border transition-all text-sm sm:text-base ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="All">All Banks</option>
                  {banks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 flex-1 sm:flex-none">
              <label className={`text-xs sm:text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Sort By</label>
              <div className="relative">
                <BarChart3 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-xl border transition-all text-sm sm:text-base ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="rate">Rate</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredFds.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <PiggyBank className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 transition-colors ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`} />
            <h4 className={`text-lg sm:text-xl font-semibold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              No fixed deposits found
            </h4>
            <p className={`text-sm sm:text-base transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Add your first FD to start tracking your investments
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredFds.map((fd, index) => (
              <motion.div
                key={fd.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`backdrop-blur-xl rounded-2xl p-4 sm:p-6 transition-all ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-400/50'
                    : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                      <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-base sm:text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {fd.bank}
                      </h4>
                      <p className={`text-xs sm:text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Started {new Date(fd.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteFD(fd.id)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <p className={`text-xs sm:text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Principal</p>
                    <p className={`font-bold text-sm sm:text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      ₹{fd.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Interest Rate</p>
                    <p className={`font-bold text-sm sm:text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {fd.rate}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Tenure</p>
                    <p className={`font-bold text-sm sm:text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {fd.tenure} months
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs sm:text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Est. Interest</p>
                    <p className={`font-bold text-sm sm:text-lg text-emerald-400`}>
                      ₹{fd.interest.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs sm:text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Maturity Date</span>
                    <span className={`font-medium text-sm sm:text-base transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {calculateMaturityDate(fd.startDate, fd.tenure)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FDPortfolio;