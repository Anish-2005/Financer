import React from "react";
import { motion } from "framer-motion";

const AuthHero = ({ isDark, isLogin }) => {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
      >
        <span className="text-emerald-400 font-semibold text-sm">
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </span>
      </motion.div>
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}>
        {isLogin ? 'Sign In' : 'Create Account'}
      </h1>
      <p className={`text-lg transition-colors ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {isLogin ? 'Access your financial dashboard' : 'Start your investment journey'}
      </p>
    </div>
  );
};

export default AuthHero;