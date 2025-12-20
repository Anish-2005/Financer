import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  PieChart,
  TrendingUp,
  Plus,
  Trash2,
  BarChart3,
  DollarSign,
  Target,
  Shield
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinancialsPage = () => {
  const { isDark } = useTheme();
  const [financials, setFinancials] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedData = localStorage.getItem('financials');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [newInvestment, setNewInvestment] = useState({
    type: "Fixed Deposits",
    balance: "",
    color: "#4ADE80"
  });

  const [sortBy, setSortBy] = useState("balance");
  const [performanceMetrics] = useState({
    'Fixed Deposits': { rate: 7.5, volatility: 0.8 },
    'Stocks': { rate: 12.4, volatility: 15.2 },
    'Mutual Funds': { rate: 9.8, volatility: 5.6 },
    'Bonds': { rate: 6.3, volatility: 2.1 },
    'Real Estate': { rate: 8.9, volatility: 7.4 }
  });

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('financials', JSON.stringify(financials));
    }
  }, [financials]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('financials');
        setFinancials([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const totalBalance = financials.reduce((acc, item) => acc + item.balance, 0);
  const topPerformer = financials.length > 0 
    ? financials.reduce((max, item) => item.balance > max.balance ? item : max)
    : null;

  const calculateAllocation = (balance) => {
    return totalBalance > 0 ? ((balance / totalBalance) * 100).toFixed(1) : 0;
  };

  const calculateRisk = (type) => {
    const metric = performanceMetrics[type] || { volatility: 0 };
    return metric.volatility < 5 ? 'Low' :
           metric.volatility < 10 ? 'Moderate' : 'High';
  };

  const handleAddInvestment = () => {
    if (!newInvestment.type || !newInvestment.balance) return;
    
    const investment = {
      id: Date.now(),
      type: newInvestment.type,
      balance: parseFloat(newInvestment.balance),
      color: newInvestment.color,
      allocation: calculateAllocation(parseFloat(newInvestment.balance)),
      added: new Date().toISOString().split('T')[0]
    };

    setFinancials(prev => [...prev, investment]);
    setNewInvestment({ type: "Fixed Deposits", balance: "", color: "#4ADE80" });
  };

  const handleDeleteInvestment = (id) => {
    setFinancials(prev => prev.filter(item => item.id !== id));
  };

  const sortedFinancials = [...financials].sort((a, b) => {
    if (sortBy === "balance") return b.balance - a.balance;
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return new Date(b.added) - new Date(a.added);
  });

  const chartData = {
    labels: sortedFinancials.map(item => item.type),
    datasets: [{
      data: sortedFinancials.map(item => item.balance),
      backgroundColor: sortedFinancials.map(item => item.color),
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
    }]
  };

  const investmentIcons = {
    'Fixed Deposits': '🏦',
    'Stocks': '📈',
    'Mutual Funds': '📊',
    'Bonds': '📉',
    'Real Estate': '🏠',
    'Crypto': '₿',
    'ETF': '📄'
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
    }`}>
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-xl rounded-3xl p-12 text-center transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
                : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
            }`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold text-sm ml-2">Portfolio Management</span>
            </motion.div>

            <h1 className={`text-6xl md:text-7xl font-bold leading-tight mb-6 transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
            }`}>
              Investment
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Get a comprehensive view of your investment portfolio with real-time tracking,
              performance analytics, and risk assessment across all your financial assets.
            </p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
            >
              {[
                { value: `₹${totalBalance.toLocaleString()}`, label: "Portfolio Value" },
                { value: financials.reduce((acc, item) => {
                    const rate = performanceMetrics[item.type]?.rate || 0;
                    return acc + (item.balance * (rate/100));
                  }, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }), label: "Est. Annual Yield" },
                { value: topPerformer?.type || 'N/A', label: "Top Performer" },
                { value: financials.length, label: "Assets" }
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
      </div>

      {/* Add Investment Section */}
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
            <div className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="text-blue-400 font-semibold text-sm">Add Asset</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Expand Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Asset Type</label>
              <div className="relative">
                <PieChart className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="Fixed Deposits">Fixed Deposits</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="Bonds">Bonds</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Crypto">Crypto</option>
                  <option value="ETF">ETF</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Investment Amount</label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={newInvestment.balance}
                  onChange={(e) => setNewInvestment({ ...newInvestment, balance: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400 placeholder-slate-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500 placeholder-slate-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Color</label>
              <div className="relative">
                <Target className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="color"
                  value={newInvestment.color}
                  onChange={(e) => setNewInvestment({ ...newInvestment, color: e.target.value })}
                  className="w-full h-12 rounded-xl border cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddInvestment}
                disabled={!newInvestment.type || !newInvestment.balance}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  newInvestment.type && newInvestment.balance
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Overview Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`backdrop-blur-xl rounded-3xl p-8 transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
                : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
            }`}
          >
            <div className="text-center mb-8">
              <div className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-purple-400 font-semibold text-sm">Allocation</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Portfolio
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Breakdown
                </span>
              </h3>
            </div>

            {sortedFinancials.length > 0 ? (
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={chartData}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: isDark ? '#e2e8f0' : '#475569',
                          font: { size: 14 }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `₹${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <PieChart className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                    isDark ? 'text-slate-600' : 'text-slate-400'
                  }`} />
                  <h4 className={`text-xl font-semibold mb-2 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    No investments yet
                  </h4>
                  <p className={`transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Add your first investment to see the breakdown
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Assets List Section */}
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
                          onClick={() => handleDeleteInvestment(item.id)}
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FinancialsPage;

