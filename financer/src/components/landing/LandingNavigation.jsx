import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const LandingNavigation = ({ onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
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
            onClick={onNavigate}
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
  );
};

export default LandingNavigation;