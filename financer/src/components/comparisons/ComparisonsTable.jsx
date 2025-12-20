import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye
} from 'lucide-react';

const ComparisonsTable = ({
  isDark,
  paginatedStocks,
  onStockClick
}) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-blue-400 font-semibold text-sm">Market Analysis</span>
        </motion.div>
        <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Stock
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Comparison Table
          </span>
        </h3>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Detailed tabular view for comprehensive stock analysis
        </p>
      </motion.div>

      <div className={`backdrop-blur-sm rounded-2xl overflow-hidden transition-colors ${
        isDark
          ? 'bg-slate-800/40 border border-slate-700/50'
          : 'bg-white/40 border border-slate-200/50'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`transition-colors ${
              isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
            }`}>
              <tr>
                <th className={`px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Symbol</th>
                <th className={`px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Company</th>
                <th className={`px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Price</th>
                <th className={`px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Change</th>
                <th className={`hidden sm:table-cell px-6 py-4 text-right text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Volume</th>
                <th className={`px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.map((stock, index) => (
                <motion.tr
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onStockClick(stock)}
                  className={`cursor-pointer transition-colors hover:${
                    isDark ? 'bg-slate-700/20' : 'bg-slate-50/30'
                  } border-b ${
                    isDark ? 'border-slate-700/30' : 'border-slate-200/30'
                  }`}
                >
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className={`font-semibold text-sm sm:text-base transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{stock.symbol}</span>
                    </div>
                  </td>
                  <td className={`px-3 sm:px-6 py-4 text-xs sm:text-sm transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                      {stock.name && stock.name.length > 20 ? `${stock.name.substring(0, 20)}...` : (stock.name || stock.symbol)}
                  </td>
                  <td className={`px-3 sm:px-6 py-4 text-right font-bold text-sm sm:text-base transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    ₹{stock.price.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-1 sm:px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      stock.change >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : stock.change === 0
                        ? 'bg-slate-500/20 text-slate-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : stock.change === 0 ? (
                        <Activity className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </td>
                  <td className={`hidden sm:table-cell px-6 py-4 text-right text-sm transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {stock.otherDetails.volume ? (stock.otherDetails.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonsTable;