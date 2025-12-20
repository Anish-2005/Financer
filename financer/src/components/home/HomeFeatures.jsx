import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Bot,
  Briefcase,
  Building2,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const HomeFeatures = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const features = [
    {
      title: "Expense Tracking",
      icon: Wallet,
      description: "Monitor your spending patterns with detailed analytics and insights",
      action: () => navigate("/expenses"),
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10"
    },
    {
      title: "Stock Analysis",
      icon: TrendingUp,
      description: "Compare and analyze stocks with real-time market data",
      action: () => navigate("/comparisons"),
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10"
    },
    {
      title: "AI Advisor",
      icon: Bot,
      description: "Get personalized financial recommendations powered by AI",
      action: () => navigate("/chatbot"),
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-500/10 to-pink-600/10"
    },
    {
      title: "Portfolio Management",
      icon: Briefcase,
      description: "Track and optimize your investment portfolio performance",
      action: () => navigate("/portfolios"),
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/10 to-red-600/10"
    },
    {
      title: "Fixed Deposits",
      icon: Building2,
      description: "Calculate and compare FD returns across different banks",
      action: () => navigate("/fd"),
      gradient: "from-indigo-500 to-violet-600",
      bgGradient: "from-indigo-500/10 to-violet-600/10"
    },
    {
      title: "Stock Market",
      icon: BarChart3,
      description: "Real-time stock quotes and market trends analysis",
      action: () => navigate("/stocks"),
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-500/10 to-emerald-600/10"
    }
  ];

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
      >
        <h3 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Complete Financial Toolkit
        </h3>
        <p className={`text-lg sm:text-xl max-w-2xl mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Everything you need to take control of your finances in one place
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group relative backdrop-blur-sm rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-600'
                : 'bg-white/40 border border-slate-200/50 hover:border-slate-300'
            }`}
            onClick={feature.action}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6 shadow-lg`}>
                <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className={`text-xl sm:text-2xl font-bold mb-3 transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {feature.description}
              </p>

              {/* Action Link */}
              <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                <span>Explore</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeatures;