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
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

      <StockHero isDark={isDark} stocks={stocks} />

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