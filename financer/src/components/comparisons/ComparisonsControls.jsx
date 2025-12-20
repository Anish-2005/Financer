import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ArrowUpDown,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';

const ComparisonsControls = ({
  isDark,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  itemsPerPage,
  setItemsPerPage,
  pageNumber,
  setPageNumber,
  totalPages,
  viewMode,
  setViewMode,
  handleSortChange
}) => {
  return (
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
        <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Customize Your
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Analysis View
          </span>
        </h3>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Sort and filter stocks to focus on the data that matters most to your investment strategy
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-6xl mx-auto">
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
  );
};

export default ComparisonsControls;