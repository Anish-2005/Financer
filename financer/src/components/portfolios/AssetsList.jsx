import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Trash2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const AssetsList = ({
  sortedFinancials,
  sortBy,
  setSortBy,
  performanceMetrics,
  calculateAllocation,
  calculateRisk,
  onDeleteInvestment
}) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`backdrop-blur-xl rounded-3xl p-8 transition-colors ${
        isDark
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
          : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="inline-flex px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
            <span className="text-pink-400 font-semibold text-sm">Assets</span>
          </div>
          <h3 className={`text-3xl md:text-4xl font-bold transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Your
            <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              Holdings
            </span>
          </h3>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Sort By</label>
          <div className="relative">
            <BarChart3 className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
            >
              <option value="balance">Balance</option>
              <option value="type">Type</option>
              <option value="date">Date Added</option>
            </select>
          </div>
        </div>
      </div>

      {sortedFinancials.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className={`w-16 h-16 mx-auto mb-4 transition-colors ${
            isDark ? 'text-slate-600' : 'text-slate-400'
          }`} />
          <h4 className={`text-xl font-semibold mb-2 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Start building your portfolio
          </h4>
          <p className={`transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Add investments above to track your financial growth
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {sortedFinancials.map((item, index) => {
            const metrics = performanceMetrics[item.type] || { rate: 0, volatility: 0 };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`backdrop-blur-xl rounded-2xl p-6 transition-all ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-400/50'
                    : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.type.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {item.type}
                      </h4>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Added {new Date(item.added).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteInvestment(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Value</p>
                    <p className={`font-bold text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      ₹{item.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Allocation</p>
                    <p className={`font-bold text-lg transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {calculateAllocation(item.balance)}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Expected Return</p>
                    <p className={`font-bold text-lg text-emerald-400`}>
                      {metrics.rate}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Risk Level</p>
                    <span className={`font-bold text-lg ${
                      metrics.volatility < 5 ? 'text-green-400' :
                      metrics.volatility < 10 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {calculateRisk(item.type)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AssetsList;