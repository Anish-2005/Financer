import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { TrendingUp, Lightbulb, Zap } from "lucide-react";

const features = [
  { title: "AI Portfolios", description: "Financer's machine learning algorithms optimize your investments 24/7" },
  { title: "FD Management", description: "Smart fixed deposit allocation with automatic renewal system" },
  { title: "Stock Analytics", description: "Real-time market insights powered by Financer's analytics engine" },
  { title: "Mutual Funds", description: "Curated selections from Financer's expert team" },
  { title: "Expense Tracking", description: "AI-powered categorization and spending optimization" },
  { title: "Wealth Forecast", description: "Predictive financial modeling exclusive to Financer" },
];

const LandingFeatures = () => {
  const { isDark } = useTheme();

  return (
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
  );
};

export default LandingFeatures;