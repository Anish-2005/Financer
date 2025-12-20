import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Sparkles } from "lucide-react";

const ChatbotHero = ({ isDark }) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-24 sm:pt-32 pb-12 sm:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 sm:space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm transition-colors ${
            isDark
              ? 'bg-slate-800/50 border border-emerald-500/20'
              : 'bg-white/50 border border-emerald-500/30'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-emerald-400 font-medium">AI Financial Assistant</span>
        </motion.div>

        {/* Main Heading */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
          }`}>
            Smart Financial
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Conversations
            </span>
          </h2>
          <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed transition-colors px-4 sm:px-0 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Get personalized financial advice, analyze your portfolio, and make informed decisions
            with our intelligent AI assistant powered by advanced financial algorithms.
          </p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-4xl mx-auto px-4 sm:px-0"
        >
          {[
            { icon: Brain, title: "AI-Powered", description: "Advanced algorithms" },
            { icon: Zap, title: "Instant Response", description: "Real-time answers" },
            { icon: Sparkles, title: "Personalized", description: "Tailored advice" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`backdrop-blur-sm rounded-xl p-4 sm:p-6 transition-colors ${
                isDark
                  ? 'bg-slate-800/30 border border-slate-700/50'
                  : 'bg-white/30 border border-slate-200/50'
              }`}
            >
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mb-2 sm:mb-3 mx-auto" />
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-1">
                {feature.title}
              </div>
              <div className={`text-xs sm:text-sm transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>{feature.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatbotHero;