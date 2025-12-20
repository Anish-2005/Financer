import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const LandingHero = ({ onNavigate }) => {
  const { isDark } = useTheme();

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
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
              onClick={onNavigate}
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
  );
};

export default LandingHero;