import React from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Zap,
  Smartphone,
  Target,
  BarChart3
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const HomeBenefits = () => {
  const { isDark } = useTheme();

  const benefits = [
    { icon: Lock, title: "Secure", description: "Bank-level encryption" },
    { icon: Zap, title: "Fast", description: "Real-time updates" },
    { icon: Smartphone, title: "Accessible", description: "Multi-device support" },
    { icon: Target, title: "Accurate", description: "Precise analytics" }
  ];

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 font-semibold text-sm">Why Choose Financer</span>
            </div>
            <h3 className={`text-4xl md:text-5xl font-bold leading-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Smart Analytics,
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Smarter Decisions
              </span>
            </h3>
            <p className={`text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Our AI-powered platform analyzes your financial data to deliver actionable insights,
              helping you make informed decisions and achieve your financial goals faster.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-xl p-4 transition-colors ${
                    isDark
                      ? 'bg-slate-800/50 border border-slate-700/50'
                      : 'bg-white/50 border border-slate-200/50'
                  }`}
                >
                  <benefit.icon className="w-8 h-8 text-emerald-400 mb-2" />
                  <div className={`font-semibold transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>{benefit.title}</div>
                  <div className={`text-sm transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>{benefit.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className={`relative h-96 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${
              isDark ? 'border border-slate-700/50' : 'border border-slate-300/50'
            }`}>
              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

              {/* Center Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }}
              >
                <BarChart3 className="w-32 h-32 text-emerald-400" />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-10 right-10 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-4"
              >
                <div className="text-emerald-400 font-bold">+25%</div>
                <div className={`text-xs transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Growth</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute bottom-10 left-10 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4"
              >
                <div className="text-blue-400 font-bold">AI</div>
                <div className={`text-xs transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Powered</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeBenefits;