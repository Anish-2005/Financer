import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";

// Lazy load all pages for code splitting
const LandingPage = React.lazy(() => import("./pages/LandingPage.jsx"));
const ChatbotPage = React.lazy(() => import("./pages/ChatbotPage.jsx"));
const PortfoliosPage = React.lazy(() => import("./pages/PortfoliosPage.jsx"));
const FDPage = React.lazy(() => import("./pages/FDPage.jsx"));
const ExpensesPage = React.lazy(() => import("./pages/ExpensesPage.jsx"));
const ComparisonsPage = React.lazy(() => import("./pages/ComparisonsPage.jsx"));
const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const AuthPage = React.lazy(() => import('./pages/AuthPage.jsx'));
const StocksPage = React.lazy(() => import("./pages/StocksPage.jsx"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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