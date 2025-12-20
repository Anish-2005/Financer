import React, { useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { Sun, Moon, LogOut, Home, Bot, Briefcase, Building2, Wallet, TrendingUp, BarChart3, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('firebaseToken');
    navigate('/auth');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "AI Advisor", path: "/advisor", icon: Bot },
    { name: "Portfolios", path: "/portfolios", icon: Briefcase },
    { name: "FD", path: "/fd", icon: Building2 },
    { name: "Expenses", path: "/expenses", icon: Wallet },
    { name: "Stocks", path: "/stocks", icon: TrendingUp },
    { name: "Comparisons", path: "/comparisons", icon: BarChart3 }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed w-full top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/50 shadow-lg shadow-black/20'
          : 'bg-white/80 border-slate-200/50 shadow-lg shadow-slate-200/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <NavLink to="/home" className="flex items-center space-x-2 sm:space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className={`p-1.5 sm:p-2 rounded-xl border backdrop-blur-sm group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow duration-300 ${
                isDark
                  ? 'border-slate-700/50 bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
                  : 'border-slate-200/50 bg-gradient-to-r from-emerald-400/10 to-blue-500/10'
              }`}>
                <img
                  src="/financer.png"
                  alt="Financer Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                />
              </div>
            </motion.div>
            <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent`}>
              Financer
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-1 items-center">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-emerald-500/10 text-emerald-600'
                        : isDark
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'animate-pulse' : ''
                    }`} />
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
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

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                isDark
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20'
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-300/50'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:shadow-lg hover:shadow-slate-300/50'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Hamburger Menu */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`lg:hidden border-t ${
                isDark ? 'border-slate-800/50' : 'border-slate-200/50'
              }`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? isDark
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-emerald-500/10 text-emerald-600'
                            : isDark
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"></div>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}

                {/* Mobile Logout Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-2 border-t border-slate-200/20"
                >
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
