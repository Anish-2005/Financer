import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  ArrowRight,
  X
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ComparisonsPage = () => {
  const { isDark } = useTheme();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
            price: stock.lastPrice ? parseFloat(stock.lastPrice) : 0,
            change: stock.pChange ? parseFloat(stock.pChange) : 0,
            rawPrice: stock.lastPrice,
            rawChange: stock.pChange,
            historical: stock.historical || [],
            otherDetails: {
              open: stock.open,
              high: stock.high,
              low: stock.low,
              volume: stock.volume
            },
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

  const getChartData = (historical) => ({
    labels: ['4D', '3D', '2D', '1D', 'Today'],
    datasets: [{
      label: 'Price',
      data: historical,
      borderColor: '#4ADE80',
      tension: 0.4,
      pointRadius: 0,
    }]
  });

  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortBy === "price") {
      return sortOrder === "desc" ? b.price - a.price : a.price - b.price;
    }
    return sortOrder === "desc" ? b.change - a.change : a.change - b.change;
  });

  const totalPages = Math.ceil(sortedStocks.length / itemsPerPage);
  const paginatedStocks = sortedStocks.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

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
            <span className="text-sm text-emerald-400 font-medium">Market Analysis</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className={`text-6xl md:text-7xl font-bold leading-tight transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
            }`}>
              Compare & Analyze
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Stock Performance
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Make informed investment decisions with comprehensive stock analysis, real-time data,
              and advanced comparison tools to identify the best opportunities in the market.
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
              { value: stocks.length, label: "Stocks Tracked" },
              { value: stocks.filter(s => s.pChange && s.pChange.startsWith('+')).length, label: "Gainers" },
              { value: stocks.filter(s => s.pChange && !s.pChange.startsWith('+') && s.pChange !== 'N/A').length, label: "Losers" },
              { value: "Real-time", label: "Updates" }
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

      {/* Controls Section */}
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
          <div className="text-center mb-8">
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-emerald-400 font-semibold text-sm">Filter & Sort</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Customize Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Analysis View
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="price">Price</option>
                  <option value="change">Daily Change</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Order</label>
              <div className="relative">
                <ArrowUpDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Items per Page</label>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Page</label>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber === 1}
                  className={`p-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white disabled:opacity-50'
                      : 'bg-white/50 border-slate-300 text-slate-900 disabled:opacity-50'
                  }`}
                >
                  ‹
                </motion.button>
                <span className={`flex-1 text-center py-3 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {pageNumber} / {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                  disabled={pageNumber === totalPages}
                  className={`p-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white disabled:opacity-50'
                      : 'bg-white/50 border-slate-300 text-slate-900 disabled:opacity-50'
                  }`}
                >
                  ›
                </motion.button>
              </div>
            </div>
          </div>
      </div>

      {/* Stock Grid Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-20">
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
          <div className="text-center mb-8">
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="text-blue-400 font-semibold text-sm">Market Analysis</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Stock
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Comparison Grid
              </span>
            </h3>
            <p className={`text-lg transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Compare stocks side by side with real-time data and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`backdrop-blur-xl rounded-2xl p-6 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-400/50'
                    : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50 hover:border-emerald-500/50'
                }`}
                onClick={() => handleStockClick(stock)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      stock.change >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {stock.symbol}
                      </h4>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {stock.name}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right transition-colors ${
                    stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <div className="font-bold text-lg">
                      ₹{stock.price.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Volume</span>
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {(stock.volume / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>Market Cap</span>
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      ₹{(stock.marketCap / 1000000000).toFixed(1)}B
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>P/E Ratio</span>
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stock.peRatio?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>52W High</span>
                    <span className={`font-medium transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      ₹{stock.high52Week.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {currentStocks.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h4 className={`text-xl font-semibold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                No stocks found
              </h4>
              <p className={`transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block text-4xl"
            >
              ⏳
            </motion.div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 p-4 rounded-xl bg-red-900/30">
            ⚠️ Error: {error}
          </div>
        )}

        {/* Stocks Table */}
        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-left border-b border-gray-700">
                    <th className="pb-4">Stock</th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSortChange("price")}>
                      Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="pb-4 cursor-pointer" onClick={() => handleSortChange("change")}>
                      Change {sortBy === "change" && (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStocks.map((stock) => (
                    <motion.tr 
                      key={stock.symbol}
                      whileHover={{ scale: 1.01 }}
                      className="border-b border-gray-700 hover:bg-gray-800/20"
                    >
                      <td className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500/20 p-3 rounded-lg">
                            {stock.symbol}
                          </div>
                          <div>
                            <p className="text-gray-200 font-medium">{stock.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-200">
                        ₹{stock.rawPrice?.toFixed(2) || 'N/A'}
                      </td>
                      <td className={stock.change >= 0 ? "text-green-400" : "text-red-400"}>
                        {stock.change >= 0 ? '+' : ''}{stock.rawChange?.toFixed(2)}%
                      </td>
                      <td>
                        <motion.button
                          onClick={() => setSelectedStock(selectedStock === stock.symbol ? null : stock.symbol)}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-r from-green-400/20 to-blue-500/20 px-4 py-2 rounded-lg text-green-400 border border-green-400/30"
                        >
                          {selectedStock === stock.symbol ? "Hide" : "Analyze"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="px-4 py-2 rounded-lg bg-gray-700/30 border border-gray-600 text-gray-300 disabled:opacity-50"
              >
                Previous
              </motion.button>
              
              <span className="text-gray-400">
                Showing {(pageNumber - 1) * itemsPerPage + 1} -{' '}
                {Math.min(pageNumber * itemsPerPage, sortedStocks.length)} of{' '}
                {sortedStocks.length} stocks
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setPageNumber(Math.min(totalPages, pageNumber + 1))}
                disabled={pageNumber === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-700/30 border border-gray-600 text-gray-300 disabled:opacity-50"
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Detailed Analysis */}
        {selectedStock && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700 space-y-6"
  >
    {paginatedStocks
      .filter(stock => stock.symbol === selectedStock)
      .map(stock => (
        <div key={stock.symbol} className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-200">{stock.name} Analysis</h3>
            <button 
              onClick={() => setSelectedStock(null)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/20 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Current Price</p>
              <p className="text-2xl text-green-400 mt-1">
                ₹{stock.rawPrice?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-700/20 p-4 rounded-xl">
              <p className="text-gray-400 text-sm">Daily Change</p>
              <p className={`text-2xl ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'} mt-1`}>
                {stock.change >= 0 ? '+' : ''}{stock.rawChange?.toFixed(2)}%
              </p>
            </div>
          </div>

          {stock.chartToday && (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative border-2 border-emerald-400/20 rounded-xl p-4 bg-gradient-to-br from-gray-900/50 to-emerald-900/20"
  >
    {/* Chart Header */}
    <div className="flex items-center justify-between mb-3">
      <span className="text-emerald-400 text-sm font-mono">Live Chart</span>
      <span className="text-gray-400 text-sm">{stock.symbol}</span>
    </div>

    {/* Image Container with Loading State */}
    <div className="relative group">
      <img 
        src={stock.chartToday}
        alt={`${stock.name} historical price chart`}
        className="w-full h-64 object-cover rounded-lg border border-emerald-400/10 bg-gray-800/30"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      
      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-emerald-400 text-2xl"
        >
          ⏳
        </motion.div>
      </div>
    </div>

    {/* Chart Footer */}
    <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
      <span>Intraday Performance</span>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
        <span>Live Data</span>
      </div>
    </div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none">
      <div className="absolute bottom-4 left-4 text-xs text-emerald-400">
        Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  </motion.div>
)}
        </div>
      ))}
  </motion.div>
)}
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
        <div className="container mx-auto text-center text-gray-400">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-4"
          >
            <div className="relative z-20 p-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
              <div className="bg-gray-800 p-1 rounded-full">
                <img 
                  src="/financer.png" 
                  alt="Footer Logo" 
                  className="h-12 w-12 object-contain" 
                />
              </div>
            </div>
          </motion.div>
          <p>“Financial freedom is available to those who learn about it and work for it.”</p>
          <p className="mt-4">&copy; 2025 Financer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ComparisonsPage;