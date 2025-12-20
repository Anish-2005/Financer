import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { TrendingUp, Lightbulb, Zap, Sun, Moon } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const handleNavigation = () => navigate('/auth');

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />
      <SEO
        title="AI-Powered Personal Finance Management"
        description="Transform your financial future with AI-powered insights, real-time market data, and intelligent expense tracking. Join thousands who have taken control of their money with Financer."
        keywords="personal finance, AI financial advisor, expense tracking, stock analysis, portfolio management, financial planning, investment calculator, money management"
        type="website"
      />

      {/* Navigation Header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed w-full top-0 z-50 backdrop-blur-xl transition-colors ${
          isDark
            ? 'bg-slate-900/80 border-b border-slate-800'
            : 'bg-white/80 border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className={`p-2 rounded-xl border backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow duration-300 ${
                isDark
                  ? 'border-slate-700/50 bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
                  : 'border-slate-200/50 bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
              }`}>
                <img
                  src="/financer.png"
                  alt="Financer Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Financer
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-lg hover:shadow-slate-300/50'
              }`}
              aria-label="Toggle theme"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </motion.button>

            <motion.button
              onClick={handleNavigation}
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center text-center px-4"
      >
        <div className="max-w-4xl relative z-10 space-y-8 pt-20">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <span className={`inline-block mb-4 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isDark
                  ? 'text-emerald-400 bg-emerald-900/20'
                  : 'text-emerald-600 bg-emerald-100/50'
              }`}>
                Welcome to Financer
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent min-h-[210px] leading-tight`}
            >
              Smart Wealth Management
            </motion.h1>


            <motion.p
              variants={fadeUp}
              className={`text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Powered by <strong className="text-emerald-400">Financer</strong>'s AI-driven platform -
              Optimize investments, maximize returns, and achieve financial freedom with precision.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10">
              <motion.button
                onClick={handleNavigation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all"
              >
                Start with Financer →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Why Choose Financer?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Next-generation features for modern investors
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-sm p-6 rounded-2xl border transition-all hover:scale-105 ${
                  isDark
                    ? 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-400/30'
                    : 'bg-white/30 border-slate-200/50 hover:border-emerald-500/30'
                }`}
              >
                <div className="mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-400/20 to-blue-500/20'
                      : 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20'
                  }`}>
                    {index % 3 === 0 ? (
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    ) : index % 3 === 1 ? (
                      <Lightbulb className="w-6 h-6 text-blue-400" />
                    ) : (
                      <Zap className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-3 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className={`py-20 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
            : 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-emerald-400 mb-3">15K+</div>
            <div className={`transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Financer Community Members</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-400 mb-3">₹850Cr+</div>
            <div className={`transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Assets Managed</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-purple-400 mb-3">98%</div>
            <div className={`transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>User Satisfaction Rate</div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

const features = [
  { title: "AI Portfolios", description: "Financer's machine learning algorithms optimize your investments 24/7" },
  { title: "FD Management", description: "Smart fixed deposit allocation with automatic renewal system" },
  { title: "Stock Analytics", description: "Real-time market insights powered by Financer's analytics engine" },
  { title: "Mutual Funds", description: "Curated selections from Financer's expert team" },
  { title: "Expense Tracking", description: "AI-powered categorization and spending optimization" },
  { title: "Wealth Forecast", description: "Predictive financial modeling exclusive to Financer" },
];

export default LandingPage;
