import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Eye,
  X,
  Search,
  Star,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

const StocksPage = () => {
  const { isDark } = useTheme();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/stocks");
        const text = await response.text();
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!text) throw new Error("Empty response from server");

        const result = JSON.parse(text);
        if (result.error) throw new Error(result.error);
        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data structure received from server");
        }

        const formattedStocks = result.data
          .filter(stock => stock?.symbol)
          .map(stock => ({
            symbol: stock.symbol,
            name: stock.meta?.companyName || stock.symbol,
            lastPrice: stock.lastPrice ? `₹${parseFloat(stock.lastPrice).toFixed(2)}` : "N/A",
            pChange: stock.pChange ? `${stock.pChange >= 0 ? "+" : ""}${parseFloat(stock.pChange).toFixed(2)}%` : "N/A",
            chartToday: stock.chartTodayPath,
            otherDetails: {
              open: stock.open,
              high: stock.high,
              low: stock.low,
              volume: stock.volume
            }
          }));

        setStocks(formattedStocks);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Stock Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      {/* Hero Section */}
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

      {/* Loading State */}
      {loading && (
        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block p-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 mb-4"
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
      )}

      {/* Error State */}
      {error && (
        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`backdrop-blur-xl rounded-3xl p-12 text-center transition-colors ${
              isDark
                ? 'bg-red-900/20 border border-red-500/20'
                : 'bg-red-50/50 border border-red-200/50'
            }`}
          >
            <div className="p-4 rounded-full bg-red-500/20 w-fit mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>Unable to Load Market Data</h3>
            <p className={`transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>{error}</p>
          </motion.div>
        </div>
      )}

      {/* Stock Grid */}
      {!loading && !error && (
        <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Market Overview
            </h3>
            <p className={`text-xl max-w-2xl mx-auto transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Track real-time stock performance and market movements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedStock(stock)}
                className={`group relative backdrop-blur-sm rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-600'
                    : 'bg-white/40 border border-slate-200/50 hover:border-slate-300'
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className={`text-xl font-bold transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>{stock.symbol}</h2>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>{stock.name}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                      stock.pChange.startsWith('+')
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : stock.pChange === 'N/A'
                        ? 'bg-slate-500/20 text-slate-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {stock.pChange.startsWith('+') ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : stock.pChange === 'N/A' ? (
                        <Activity className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stock.pChange}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={`text-3xl font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stock.lastPrice}
                    </p>
                    <div className={`h-1 rounded-full mt-2 transition-colors ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          stock.pChange.startsWith('+') ? 'bg-emerald-400' :
                          stock.pChange === 'N/A' ? 'bg-slate-400' : 'bg-red-400'
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
                      <span>View Details</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <div className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Vol: {stock.otherDetails.volume?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full transition-colors ${
              isDark
                ? 'bg-slate-800/90 border border-slate-700/50'
                : 'bg-white/90 border border-slate-200/50'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className={`text-4xl font-bold mb-2 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {selectedStock.symbol}
                </h2>
                <p className={`text-lg transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{selectedStock.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedStock(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-200/50 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                  isDark
                    ? 'bg-slate-700/30 border border-slate-600/50'
                    : 'bg-slate-50/50 border border-slate-200/50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Price Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Current Price</span>
                      <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        {selectedStock.lastPrice}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Daily Change</span>
                      <p className={`text-2xl font-bold ${
                        selectedStock.pChange.startsWith('+') ? 'text-emerald-400' :
                        selectedStock.pChange === 'N/A' ? 'text-slate-400' : 'text-red-400'
                      }`}>
                        {selectedStock.pChange}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                  isDark
                    ? 'bg-slate-700/30 border border-slate-600/50'
                    : 'bg-slate-50/50 border border-slate-200/50'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>Trading Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Open</span>
                      <span className="text-blue-400 font-semibold">
                        ₹{selectedStock.otherDetails.open?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>High</span>
                      <span className="text-emerald-400 font-semibold">
                        ₹{selectedStock.otherDetails.high?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Low</span>
                      <span className="text-red-400 font-semibold">
                        ₹{selectedStock.otherDetails.low?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>Volume</span>
                      <span className="text-purple-400 font-semibold">
                        {selectedStock.otherDetails.volume?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedStock.chartToday && (
                  <div className={`backdrop-blur-sm rounded-2xl p-6 transition-colors ${
                    isDark
                      ? 'bg-slate-700/30 border border-slate-600/50'
                      : 'bg-slate-50/50 border border-slate-200/50'
                  }`}>
                    <h3 className={`text-xl font-bold mb-4 transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>Price Movement</h3>
                    <img
                      src={selectedStock.chartToday}
                      alt="Price Chart"
                      className="w-full h-32 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StocksPage;