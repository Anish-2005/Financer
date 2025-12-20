import { motion } from 'framer-motion';
import { X, BarChart3, TrendingUp, Activity, Star } from 'lucide-react';

const StockModal = ({ stock, isDark, onClose }) => {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`backdrop-blur-xl rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto transition-colors ${
          isDark
            ? 'bg-slate-800/95 border border-slate-700/50'
            : 'bg-white/95 border border-slate-200/50'
        }`}
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {stock.symbol}
              </h2>
              <p className={`text-lg transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{stock.name}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-3 rounded-xl transition-colors ${
              isDark
                ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-200/50 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Price Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/40 border border-slate-700/50'
                  : 'bg-white/40 border border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Price Details</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10">
                  <span className={`font-medium transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>Current Price</span>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    {stock.lastPrice}
                  </p>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
                }`}>
                  <span className={`font-medium transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>Daily Change</span>
                  <p className={`text-2xl font-bold ${
                    stock.pChange.startsWith('+') ? 'text-emerald-400' :
                    stock.pChange === 'N/A' ? 'text-slate-400' : 'text-red-400'
                  }`}>
                    {stock.pChange}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trading Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/40 border border-slate-700/50'
                  : 'bg-white/40 border border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Trading Details</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Open', value: `₹${stock.otherDetails.open?.toFixed(2) || 'N/A'}`, color: 'text-blue-400' },
                  { label: 'High', value: `₹${stock.otherDetails.high?.toFixed(2) || 'N/A'}`, color: 'text-emerald-400' },
                  { label: 'Low', value: `₹${stock.otherDetails.low?.toFixed(2) || 'N/A'}`, color: 'text-red-400' },
                  { label: 'Volume', value: stock.otherDetails.volume?.toLocaleString() || 'N/A', color: 'text-purple-400' }
                ].map((item, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${
                    isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
                  }`}>
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {/* Chart Card */}
            {stock.chartToday && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                  isDark
                    ? 'bg-slate-800/40 border border-slate-700/50'
                    : 'bg-white/40 border border-slate-200/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Price Movement</h3>
                </div>
                <div className={`p-4 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
                }`}>
                  <img
                    src={stock.chartToday}
                    alt="Price Chart"
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
              </motion.div>
            )}

            {/* Performance Indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/40 border border-slate-700/50'
                  : 'bg-white/40 border border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>Performance</h3>
              </div>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl transition-colors ${
                  stock.pChange.startsWith('+')
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : stock.pChange === 'N/A'
                    ? 'bg-slate-500/10 border border-slate-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Trend</span>
                    <div className="flex items-center gap-2">
                      {stock.pChange.startsWith('+') ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : stock.pChange === 'N/A' ? (
                        <Activity className="w-5 h-5 text-slate-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-bold ${
                        stock.pChange.startsWith('+') ? 'text-emerald-400' :
                        stock.pChange === 'N/A' ? 'text-slate-400' : 'text-red-400'
                      }`}>
                        {stock.pChange.startsWith('+') ? 'Bullish' :
                         stock.pChange === 'N/A' ? 'Neutral' : 'Bearish'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StockModal;