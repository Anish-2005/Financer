import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import StockCard from './StockCard';

const StockGrid = ({ stocks, searchTerm, isDark, onStockClick }) => {
  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredStocks.length === 0) {
    return (
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
          <Search className="w-8 h-8 text-white" />
        </div>
        <h3 className={`text-xl font-bold mb-2 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>No stocks found</h3>
        <p className={`transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Try adjusting your search terms
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredStocks.map((stock, index) => (
        <StockCard
          key={stock.symbol}
          stock={stock}
          index={index}
          isDark={isDark}
          onClick={onStockClick}
        />
      ))}
    </div>
  );
};

export default StockGrid;