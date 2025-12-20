import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const StockSearch = ({ isDark, searchTerm, setSearchTerm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 sm:mb-12"
    >
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl border transition-all text-sm sm:text-base ${
              isDark
                ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400'
                : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-500'
            } focus:ring-2 focus:ring-emerald-400/20`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StockSearch;