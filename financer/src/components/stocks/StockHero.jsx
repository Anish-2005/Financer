import { motion } from 'framer-motion';

const StockHero = ({ isDark, stocks }) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-colors ${
            isDark
              ? 'bg-slate-800/50 border border-emerald-500/20'
              : 'bg-white/50 border border-emerald-500/30'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-emerald-400 font-medium">Live Market Data</span>
        </motion.div>

        {/* Main Heading */}
        <div className="space-y-6">
          <h2 className={`text-6xl md:text-7xl font-bold leading-tight transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
          }`}>
            Market
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Real-time stock quotes, market trends, and comprehensive analysis to help you make
            informed investment decisions with confidence.
          </p>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
        >
          {[
            { value: stocks.length, label: "Listed Stocks" },
            { value: stocks[0]?.symbol || 'N/A', label: "Most Active" },
            { value: stocks.reduce((sum, stock) => sum + (stock.otherDetails.volume || 0), 0).toLocaleString(), label: "Total Volume" },
            { value: "24/7", label: "Market Hours" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`backdrop-blur-sm rounded-xl p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/30 border border-slate-700/50'
                  : 'bg-white/30 border border-slate-200/50'
              }`}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className={`text-sm mt-1 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StockHero;