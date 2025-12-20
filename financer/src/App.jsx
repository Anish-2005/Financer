import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import LandingPage from "./pages/LandingPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import PortfoliosPage from "./pages/PortfoliosPage.jsx";
import FDPage from "./pages/FDPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import ComparisonsPage from "./pages/ComparisonsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from './pages/AuthPage.jsx';
import StocksPage from "./pages/StocksPage.jsx";

const App = () => {
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated Background - Excluded from Landing Page and Auth Page */}
      {!['/', '/auth'].includes(location.pathname) && <AnimatedBackground />}
      
      {/* Navigation Bar - Excluded from Landing Page and Auth Page */}
      {!['/', '/auth'].includes(location.pathname) && <Navbar />}

      {/* Page Content */}
      <div className="">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/advisor" element={<ChatbotPage />} />
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/fd" element={<FDPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/comparisons" element={<ComparisonsPage />} />
          <Route path="/stocks" element={<StocksPage />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => (
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
);

export default Root;