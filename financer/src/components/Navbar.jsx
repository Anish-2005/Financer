import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { Sun, Moon, LogOut, Home, Bot, Briefcase, Building2, Wallet, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    localStorage.removeItem('firebaseToken');
    navigate('/auth');
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <NavLink to="/home" className="flex items-center space-x-3 group">
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
            <span className={`text-xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent`}>
              Financer
            </span>
          </NavLink>
    
          {/* Navigation Links */}
          <ul className="flex space-x-1 items-center">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={index}>
                  <NavLink 
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
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
    
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                isDark
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/20'
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-300/50'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
