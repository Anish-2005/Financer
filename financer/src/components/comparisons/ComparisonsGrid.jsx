import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye
} from 'lucide-react';

const ComparisonsGrid = ({
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
            Comparison Grid
          </span>
        </h3>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Compare stocks side by side with real-time data and analytics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedStocks.map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => onStockClick(stock)}
            className={`group relative backdrop-blur-sm rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/30 border border-slate-700/50 hover:border-slate-600'
                : 'bg-white/30 border border-slate-200/50 hover:border-slate-300'
            }`}
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{stock.symbol}</h3>
                    <p className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>{stock.name && stock.name.length > 20 ? `${stock.name.substring(0, 20)}...` : (stock.name || stock.symbol)}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  stock.change >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : stock.change === 0
                    ? 'bg-slate-500/20 text-slate-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : stock.change === 0 ? (
                    <Activity className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </div>
              </div>

              <div className="mb-4">
                <p className={`text-2xl font-bold mb-2 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  ₹{stock.price.toLocaleString()}
                </p>
                <div className={`h-2 rounded-full transition-colors ${
                  isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stock.change >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                      stock.change === 0 ? 'bg-gradient-to-r from-slate-400 to-slate-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(stock.change), 100)}%`
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Details</span>
                </div>
                <div className={`text-xs transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Vol: {stock.otherDetails.volume ? (stock.otherDetails.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonsGrid;