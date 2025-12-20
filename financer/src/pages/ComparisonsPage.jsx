import React, { useState, useEffect } from "react";
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
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import ComparisonsHero from "../components/comparisons/ComparisonsHero";
import ComparisonsControls from "../components/comparisons/ComparisonsControls";
import ComparisonsGrid from "../components/comparisons/ComparisonsGrid";
import ComparisonsTable from "../components/comparisons/ComparisonsTable";
import ComparisonsModal from "../components/comparisons/ComparisonsModal";
import ComparisonsLoading from "../components/comparisons/ComparisonsLoading";
import ComparisonsError from "../components/comparisons/ComparisonsError";
import ComparisonsEmpty from "../components/comparisons/ComparisonsEmpty";

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
          .map(stock => {
            // Ensure all required properties are properly typed
            const price = stock.lastPrice ? parseFloat(stock.lastPrice.replace(/,/g, '')) : 0;
            const change = stock.pChange ? parseFloat(stock.pChange) : 0;

            return {
              symbol: String(stock.symbol),
              name: String(stock.name || stock.symbol),
              price: isNaN(price) ? 0 : price,
              change: isNaN(change) ? 0 : change,
              rawPrice: String(stock.lastPrice || ''),
              rawChange: String(stock.pChange || ''),
              historical: Array.isArray(stock.historical) ? stock.historical : [],
              otherDetails: {
                open: stock.otherDetails?.open || null,
                high: stock.otherDetails?.high || null,
                low: stock.otherDetails?.low || null,
                volume: stock.otherDetails?.volume || null
              },
            };
          });

        setStocks(formattedStocks);
        setTotalCount(result.total_count || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Stock Fetch Error:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [pageNumber, itemsPerPage]);

  const getChartData = (historical) => {
    // Ensure historical is an array and contains valid numbers
    const validData = Array.isArray(historical)
      ? historical.filter(item => typeof item === 'number' && !isNaN(item))
      : [];

    return {
      labels: ['4D', '3D', '2D', '1D', 'Today'],
      datasets: [{
        label: 'Price',
        data: validData.length > 0 ? validData : [0, 0, 0, 0, 0], // Fallback data
        borderColor: '#4ADE80',
        tension: 0.4,
        pointRadius: 0,
      }]
    };
  };

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

      <ComparisonsHero
        isDark={isDark}
        totalCount={totalCount}
        stocks={stocks}
      />

      <ComparisonsControls
        isDark={isDark}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalPages={totalPages}
        viewMode={viewMode}
        setViewMode={setViewMode}
        handleSortChange={handleSortChange}
      />

      {/* Stock Display Section */}
      {viewMode === "grid" ? (
        <ComparisonsGrid
          isDark={isDark}
          paginatedStocks={paginatedStocks}
          onStockClick={setSelectedStock}
        />
      ) : (
        <ComparisonsTable
          isDark={isDark}
          paginatedStocks={paginatedStocks}
          onStockClick={setSelectedStock}
        />
      )}

      {/* Empty State */}
      {paginatedStocks.length === 0 && !loading && !error && (
        <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-20">
          <ComparisonsEmpty isDark={isDark} />
        </div>
      )}

      {/* Loading State */}
      {loading && <ComparisonsLoading isDark={isDark} />}

      {/* Error State */}
      {error && <ComparisonsError isDark={isDark} error={error} />}

      {/* Detail Modal */}
      <ComparisonsModal
        isDark={isDark}
        selectedStock={selectedStock}
        onClose={() => setSelectedStock(null)}
        getChartData={getChartData}
      />

      <Footer />
    </div>
  );
};

export default ComparisonsPage;

