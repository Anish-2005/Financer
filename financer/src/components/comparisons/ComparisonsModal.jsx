import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Star,
  X
} from 'lucide-react';

const ComparisonsModal = ({
  isDark,
  selectedStock,
  onClose,
  getChartData
}) => {
  if (!selectedStock || !selectedStock.symbol) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`backdrop-blur-xl rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto transition-colors ${
          isDark
            ? 'bg-slate-800/95 border border-slate-700/50'
            : 'bg-white/95 border border-slate-200/50'
        }`}
      >
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedStock.name || selectedStock.symbol}
              </h2>
              <p className={`text-lg transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{selectedStock.symbol} • Detailed Analysis</p>
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
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <span className={`font-medium transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>Current Price</span>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    ₹{selectedStock.price.toLocaleString()}
                  </p>
                </div>
                <div className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
                  isDark ? 'bg-slate-700/30' : 'bg-slate-50/50'
                }`}>
                  <span className={`font-medium transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>Daily Change</span>
                  <p className={`text-2xl font-bold ${
                    selectedStock.change >= 0 ? 'text-emerald-400' :
                    selectedStock.change === 0 ? 'text-slate-400' : 'text-red-400'
                  }`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
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
                  { label: 'Open', value: `₹${selectedStock.otherDetails.open?.toFixed(2) || 'N/A'}`, color: 'text-blue-400' },
                  { label: 'High', value: `₹${selectedStock.otherDetails.high?.toFixed(2) || 'N/A'}`, color: 'text-emerald-400' },
                  { label: 'Low', value: `₹${selectedStock.otherDetails.low?.toFixed(2) || 'N/A'}`, color: 'text-red-400' },
                  { label: 'Volume', value: selectedStock.otherDetails.volume?.toLocaleString() || 'N/A', color: 'text-purple-400' }
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
            {selectedStock.historical && selectedStock.historical.length > 0 && (
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
                  <Line
                    data={getChartData(selectedStock.historical)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                          titleColor: isDark ? '#e2e8f0' : '#1e293b',
                          bodyColor: isDark ? '#cbd5e1' : '#475569',
                          borderColor: isDark ? '#475569' : '#e2e8f0',
                          borderWidth: 1,
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                        },
                        y: {
                          grid: { color: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(226, 232, 240, 0.5)' },
                          ticks: { color: isDark ? '#94a3b8' : '#64748b' },
                        },
                      },
                    }}
                    height={200}
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
                  selectedStock.change >= 0
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : selectedStock.change === 0
                    ? 'bg-slate-500/10 border border-slate-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Trend</span>
                    <div className="flex items-center gap-2">
                      {selectedStock.change > 0 ? (
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      ) : selectedStock.change === 0 ? (
                        <Activity className="w-5 h-5 text-slate-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-bold ${
                        selectedStock.change > 0 ? 'text-emerald-400' :
                        selectedStock.change === 0 ? 'text-slate-400' : 'text-red-400'
                      }`}>
                        {selectedStock.change > 0 ? 'Bullish' :
                         selectedStock.change === 0 ? 'Neutral' : 'Bearish'}
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

export default ComparisonsModal;