import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import {
  StockHero,
  LoadingState,
  ErrorState,
  StockSearch,
  StockGrid,
  StockModal
} from '../components/stocks';

const StocksPage = () => {
  const { isDark } = useTheme();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const LIMIT = 20;

  const fetchStocks = async (currentSkip, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      
      const response = await fetch(`http://127.0.0.1:8000/stocks?skip=${currentSkip}&limit=${LIMIT}`);
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
          lastPrice: stock.lastPrice ? `₹${parseFloat(stock.lastPrice.replace(/,/g, '')).toFixed(2)}` : "N/A",
          pChange: stock.pChange ? `${parseFloat(stock.pChange) >= 0 ? "+" : ""}${parseFloat(stock.pChange).toFixed(2)}%` : "N/A",
          chartToday: stock.chartTodayPath,
          otherDetails: {
            open: stock.otherDetails?.open,
            high: stock.otherDetails?.high,
            low: stock.otherDetails?.low,
            volume: stock.otherDetails?.volume
          }
        }));

      if (isLoadMore) {
        setStocks(prev => [...prev, ...formattedStocks]);
      } else {
        setStocks(formattedStocks);
      }
      
      setHasMore(result.has_more);
      setTotalCount(result.total_count);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Stock Fetch Error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStocks(0);
  }, []);

  useEffect(() => {
    if (skip > 0) {
      fetchStocks(skip, true);
    }
  }, [skip]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 &&
        !loading &&
        !loadingMore &&
        hasMore &&
        !searchTerm // Disable infinite scroll when searching
      ) {
        setSkip(prev => prev + LIMIT);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore, searchTerm]);

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      <StockHero isDark={isDark} stocks={stocks} totalCount={totalCount} />

      {loading && <LoadingState isDark={isDark} />}

      {error && <ErrorState isDark={isDark} error={error} />}

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

          <StockSearch
            isDark={isDark}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <StockGrid
            stocks={stocks}
            searchTerm={searchTerm}
            isDark={isDark}
            onStockClick={setSelectedStock}
          />
          
          {loadingMore && (
            <div className="flex justify-center py-8">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-slate-900'}`}></div>
            </div>
          )}
        </div>
      )}

      <StockModal
        stock={selectedStock}
        isDark={isDark}
        onClose={() => setSelectedStock(null)}
      />

      <Footer />
    </div>
  );
};

export default StocksPage;