import React from "react";
import { motion } from "framer-motion";

const AuthToggle = ({ isDark, isLogin, setIsLogin, setError }) => {
  return (
    <div className="mt-8 text-center">
      <p className={`transition-colors ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          {isLogin ? 'Sign up here' : 'Sign in here'}
        </motion.button>
      </p>
    </div>
  );
};

export default AuthToggle;