import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import PortfolioHero from "../components/portfolios/PortfolioHero";
import AddInvestmentForm from "../components/portfolios/AddInvestmentForm";
import PortfolioChart from "../components/portfolios/PortfolioChart";
import AssetsList from "../components/portfolios/AssetsList";

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

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      <PortfolioHero
        totalBalance={totalBalance}
        financials={financials}
        performanceMetrics={performanceMetrics}
        topPerformer={topPerformer}
      />

      <AddInvestmentForm
        newInvestment={newInvestment}
        setNewInvestment={setNewInvestment}
        onAddInvestment={handleAddInvestment}
      />

      {/* Portfolio Overview Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <PortfolioChart
            sortedFinancials={sortedFinancials}
            chartData={chartData}
          />

          <AssetsList
            sortedFinancials={sortedFinancials}
            sortBy={sortBy}
            setSortBy={setSortBy}
            performanceMetrics={performanceMetrics}
            calculateAllocation={calculateAllocation}
            calculateRisk={calculateRisk}
            onDeleteInvestment={handleDeleteInvestment}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FinancialsPage;

