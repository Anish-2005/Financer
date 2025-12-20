import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {
  PiggyBank,
  TrendingUp,
  Calendar,
  Plus,
  Trash2,
  Filter,
  BarChart3,
  IndianRupee,
  Percent,
  Clock
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const predefinedBanks = {
  'SBI': '🏦',
  'HDFC': '🏛️',
  'ICICI': '🏢',
  'Axis Bank': '🏤',
  'Kotak Mahindra': '🏨',
  'PNB': '🏣'
};

const FDPage = () => {
  const { isDark } = useTheme();
  const [fds, setFds] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedFDs = localStorage.getItem('fds');
    return savedFDs ? JSON.parse(savedFDs) : [];
  });

  const [newFd, setNewFd] = useState({ 
    bank: "", 
    amount: "", 
    rate: "", 
    tenure: "", 
    startDate: "" 
  });
  const [sortBy, setSortBy] = useState("date");
  const [selectedBank, setSelectedBank] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('fds', JSON.stringify(fds));
    }
  }, [fds]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('fds');
        setFds([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAddFD = () => {
    if (!Object.values(newFd).every(Boolean)) return;
    
    const fdToAdd = { 
      ...newFd,
      id: Date.now(), 
      amount: parseFloat(newFd.amount), 
      rate: parseFloat(newFd.rate), 
      tenure: parseInt(newFd.tenure),
      interest: (parseFloat(newFd.amount) * parseFloat(newFd.rate) * parseInt(newFd.tenure)) / 1200
    };
    
    setFds(prev => [...prev, fdToAdd]);
    setNewFd({ bank: "", amount: "", rate: "", tenure: "", startDate: "" });
  };

  const handleDeleteFD = (id) => {
    setFds(prev => prev.filter(fd => fd.id !== id));
  };

  const sortedFds = [...fds].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "rate") return b.rate - a.rate;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const filteredFds = sortedFds.filter(fd => 
    selectedBank === "All" || fd.bank === selectedBank
  );

  const totalInvestment = filteredFds.reduce((acc, fd) => acc + fd.amount, 0);
  const totalInterest = filteredFds.reduce((acc, fd) => acc + fd.interest, 0);
  const banks = [...new Set([...Object.keys(predefinedBanks), ...fds.map(fd => fd.bank)])].sort();

  const chartData = {
    labels: filteredFds.map(fd => fd.bank),
    datasets: [{
      label: 'FD Amount',
      data: filteredFds.map(fd => fd.amount),
      backgroundColor: '#4ADE80',
      borderColor: '#059669',
      borderWidth: 1
    }]
  };

  const calculateMaturityDate = (startDate, tenure) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + tenure);
    return date.toLocaleDateString();
  };

  const getBankIcon = (bank) => {
    return predefinedBanks[bank] || '🏦';
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
              <span className="text-emerald-400 font-semibold text-sm ml-2">FD Management</span>
            </motion.div>

            <h1 className={`text-6xl md:text-7xl font-bold leading-tight mb-6 transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
            }`}>
              Fixed Deposit
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Tracker
              </span>
            </h1>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Maximize your returns with smart fixed deposit management. Track investments,
              compare rates, and optimize your portfolio for better financial growth.
            </p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
            >
              {[
                { value: `₹${totalInvestment.toLocaleString()}`, label: "Total Investment" },
                { value: `₹${totalInterest.toLocaleString()}`, label: "Est. Interest" },
                { value: filteredFds.length, label: "Active FDs" },
                { value: banks[0] || '-', label: "Top Bank" }
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

      {/* Add FD Section */}
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
              <span className="text-blue-400 font-semibold text-sm">Add Investment</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Create New
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Fixed Deposit
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Bank Name</label>
              <div className="relative">
                <PiggyBank className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <select
                  value={newFd.bank}
                  onChange={(e) => setNewFd({ ...newFd, bank: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium transition-colors ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Investment Amount</label>
              <div className="relative">
                <IndianRupee className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={newFd.amount}
                  onChange={(e) => setNewFd({ ...newFd, amount: e.target.value })}
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
              }`}>Interest Rate (%)</label>
              <div className="relative">
                <Percent className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 6.5"
                  value={newFd.rate}
                  onChange={(e) => setNewFd({ ...newFd, rate: e.target.value })}
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
              }`}>Tenure (Months)</label>
              <div className="relative">
                <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="number"
                  placeholder="e.g., 12"
                  value={newFd.tenure}
                  onChange={(e) => setNewFd({ ...newFd, tenure: e.target.value })}
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
              }`}>Start Date</label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="date"
                  value={newFd.startDate}
                  onChange={(e) => setNewFd({ ...newFd, startDate: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                      : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  } focus:ring-2 focus:ring-emerald-400/20`}
                />
              </div>
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddFD}
                disabled={!Object.values(newFd).every(Boolean)}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  Object.values(newFd).every(Boolean)
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add FD
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FD List Section */}
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <span className="text-purple-400 font-semibold text-sm">Your Portfolio</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-bold transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Fixed Deposit
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Portfolio
                </span>
              </h3>
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="space-y-2">
                <label className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>Filter Bank</label>
                <div className="relative">
                  <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                        : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                    } focus:ring-2 focus:ring-emerald-400/20`}
                  >
                    <option value="All">All Banks</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
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
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="rate">Rate</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredFds.length === 0 ? (
            <div className="text-center py-12">
              <PiggyBank className={`w-16 h-16 mx-auto mb-4 transition-colors ${
                isDark ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h4 className={`text-xl font-semibold mb-2 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                No fixed deposits found
              </h4>
              <p className={`transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Add your first FD to start tracking your investments
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFds.map((fd, index) => (
                <motion.div
                  key={fd.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`backdrop-blur-xl rounded-2xl p-6 transition-all ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-400/50'
                      : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                        <PiggyBank className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          {fd.bank}
                        </h4>
                        <p className={`text-sm transition-colors ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Started {new Date(fd.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteFD(fd.id)}
                      className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Principal</p>
                      <p className={`font-bold text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        ₹{fd.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Interest Rate</p>
                      <p className={`font-bold text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {fd.rate}%
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Tenure</p>
                      <p className={`font-bold text-lg transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {fd.tenure} months
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Est. Interest</p>
                      <p className={`font-bold text-lg text-emerald-400`}>
                        ₹{fd.interest.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm transition-colors ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Maturity Date</span>
                      <span className={`font-medium transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {calculateMaturityDate(fd.startDate, fd.tenure)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
              </div>
              <input
                type="number"
                placeholder="Amount"
                value={newFd.amount}
                onChange={(e) => setNewFd({ ...newFd, amount: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={newFd.rate}
                onChange={(e) => setNewFd({ ...newFd, rate: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Tenure (months)"
                value={newFd.tenure}
                onChange={(e) => setNewFd({ ...newFd, tenure: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <input
                type="date"
                value={newFd.startDate}
                onChange={(e) => setNewFd({ ...newFd, startDate: e.target.value })}
                className="w-full p-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:border-green-400 text-gray-300 placeholder-gray-500"
              />
              <motion.button
                onClick={handleAddFD}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Fixed Deposit
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-200">FD Distribution</h3>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                          bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
              >
                <option value="All">All Banks</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            <div className="h-64">
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { 
                      callbacks: {
                        label: (context) => `₹${context.raw.toLocaleString()}`,
                        footer: (items) => {
                          const fd = filteredFds[items[0].dataIndex];
                          return `Interest: ₹${fd.interest.toLocaleString()}\nRate: ${fd.rate}%`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: { color: '#9CA3AF' },
                      grid: { color: '#374151' }
                    },
                    x: {
                      ticks: { color: '#9CA3AF' }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Your Fixed Deposits</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-300
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                        appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOWNhM2FmIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] 
                        bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem]"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="rate">Sort by Rate</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredFds.map((fd) => (
              <motion.div
                key={fd.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition cursor-pointer relative group"
              >
                <button
                  onClick={() => handleDeleteFD(fd.id)}
                  className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getBankIcon(fd.bank)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-200">{fd.bank}</h3>
                      <p className="text-sm text-gray-400">
                        {calculateMaturityDate(fd.startDate, fd.tenure)} • {fd.tenure} months
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-green-400">
                      ₹{fd.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-400">
                      {fd.rate}% • ₹{fd.interest.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                    style={{ width: `${(fd.tenure / 36) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {/* Footer */}
     <footer className="mt-16 bg-gray-900/50 backdrop-blur-md py-6 border-t border-gray-700/50">
       <div className="container mx-auto text-center text-gray-400">
         {/* Logo with Gradient Border */}
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

export default FDPage;