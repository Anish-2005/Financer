import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Activity, Eye } from 'lucide-react';

const StockCard = ({ stock, index, isDark, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => onClick(stock)}
      className={`group relative backdrop-blur-sm rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-slate-800/30 border border-slate-700/50 hover:border-slate-600'
          : 'bg-white/30 border border-slate-200/50 hover:border-slate-300'
      }`}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>{stock.symbol}</h3>
              <p className={`text-sm transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{stock.name.length > 20 ? `${stock.name.substring(0, 20)}...` : stock.name}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            stock.pChange.startsWith('+')
              ? 'bg-emerald-500/20 text-emerald-400'
              : stock.pChange === 'N/A'
              ? 'bg-slate-500/20 text-slate-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {stock.pChange.startsWith('+') ? (
              <TrendingUp className="w-4 h-4" />
            ) : stock.pChange === 'N/A' ? (
              <Activity className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {stock.pChange}
          </div>
        </div>

        <div className="mb-4">
          <p className={`text-2xl font-bold mb-2 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {stock.lastPrice}
          </p>
          <div className={`h-2 rounded-full transition-colors ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stock.pChange.startsWith('+') ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                stock.pChange === 'N/A' ? 'bg-gradient-to-r from-slate-400 to-slate-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{
                width: `${Math.min(
                  Math.abs(stock.pChange === 'N/A' ? 0 : parseFloat(stock.pChange)),
                  100
                )}%`
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
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
  );
};

export default StockCard;