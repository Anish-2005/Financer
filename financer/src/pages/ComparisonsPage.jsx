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
  Activity,
  X,
  Star,
  Grid3X3,
  List
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
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const skip = (pageNumber - 1) * itemsPerPage;
        const response = await fetch(`http://127.0.0.1:8000/stocks?skip=${skip}&limit=${itemsPerPage}`);
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
            name: stock.name || stock.symbol,
            price: stock.lastPrice ? parseFloat(stock.lastPrice.replace(/,/g, '')) : 0,
            change: stock.pChange ? parseFloat(stock.pChange) : 0,
            rawPrice: stock.lastPrice,
            rawChange: stock.pChange,
            historical: stock.historical || [],
            otherDetails: {
              open: stock.otherDetails?.open,
              high: stock.otherDetails?.high,
              low: stock.otherDetails?.low,
              volume: stock.otherDetails?.volume
            },
          }));

        setStocks(formattedStocks);
        setTotalCount(result.total_count || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Stock Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [pageNumber, itemsPerPage]);

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

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedStocks = sortedStocks; // Already paginated from server

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
              { value: totalCount || stocks.length, label: "Stocks Tracked" },
              { value: stocks.filter(s => s.change > 0).length, label: "Gainers (Page)" },
              { value: stocks.filter(s => s.change < 0).length, label: "Losers (Page)" },
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold text-sm">Filter & Sort</span>
          </motion.div>
          <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Customize Your
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Analysis View
            </span>
          </h3>
          <p className={`text-xl max-w-2xl mx-auto transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Sort and filter stocks to focus on the data that matters most to your investment strategy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
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
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPageNumber(1);
                }}
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

          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>View</label>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  viewMode === "grid"
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-600 text-slate-400 hover:bg-slate-700'
                    : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mx-auto" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("table")}
                className={`flex-1 p-3 rounded-xl border transition-all ${
                  viewMode === "table"
                    ? isDark
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                      : 'bg-emerald-500/20 border-emerald-500 text-emerald-600'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-600 text-slate-400 hover:bg-slate-700'
                    : 'bg-white/50 border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List className="w-4 h-4 mx-auto" />
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
          <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Stock
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Comparison Grid
            </span>
          </h3>
          <p className={`text-xl max-w-2xl mx-auto transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Compare stocks side by side with real-time data and analytics
          </p>
        </motion.div>

        {/* Grid/Table View Toggle */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => setSelectedStock(stock)}
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
                        }`}>{stock.name.length > 20 ? `${stock.name.substring(0, 20)}...` : stock.name}</p>
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
        ) : (
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
                    <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Symbol</th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Company</th>
                    <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Price</th>
                    <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Change</th>
                    <th className={`px-6 py-4 text-right text-sm font-semibold transition-colors ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>Volume</th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold transition-colors ${
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
                      onClick={() => setSelectedStock(stock)}
                      className={`cursor-pointer transition-colors hover:${
                        isDark ? 'bg-slate-700/20' : 'bg-slate-50/30'
                      } border-b ${
                        isDark ? 'border-slate-700/30' : 'border-slate-200/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <BarChart3 className="w-4 h-4 text-white" />
                          </div>
                          <span className={`font-semibold transition-colors ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>{stock.symbol}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm transition-colors ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {stock.name.length > 30 ? `${stock.name.substring(0, 30)}...` : stock.name}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        ₹{stock.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
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
                      <td className={`px-6 py-4 text-right text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {stock.otherDetails.volume ? (stock.otherDetails.volume / 1000000).toFixed(1) + 'M' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {paginatedStocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`backdrop-blur-sm rounded-2xl p-12 text-center transition-colors ${
              isDark
                ? 'bg-slate-800/40 border border-slate-700/50'
                : 'bg-white/40 border border-slate-200/50'
            }`}
          >
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 w-fit mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>No stocks found</h3>
            <p className={`transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Try adjusting your filters or search criteria
            </p>
          </motion.div>
        )}
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
              className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
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

      {/* Detail Modal */}
      {selectedStock && (
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
            {selectedStock && (
                <div key={selectedStock.symbol}>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className={`text-3xl font-bold transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {selectedStock.name}
                        </h2>
                        <p className={`text-lg transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>{selectedStock.symbol} • Detailed Analysis</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedStock(null)}
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
                </div>
              )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ComparisonsPage;