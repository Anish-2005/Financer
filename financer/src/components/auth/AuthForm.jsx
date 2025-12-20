import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const AuthForm = ({
  isDark,
  isLogin,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  handleSubmit
}) => {
  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-2xl transition-colors ${
            isDark
              ? 'bg-red-900/20 border border-red-500/20 text-red-300'
              : 'bg-red-50/50 border border-red-200/50 text-red-700'
          }`}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={`text-sm font-medium transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Email Address</label>
          <div className="relative group">
            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              isDark ? 'text-slate-400 group-focus-within:text-emerald-400' : 'text-slate-500 group-focus-within:text-emerald-500'
            }`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-slate-500'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-400'
              }`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`text-sm font-medium transition-colors ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>Password</label>
          <div className="relative group">
            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
              isDark ? 'text-slate-400 group-focus-within:text-emerald-400' : 'text-slate-500 group-focus-within:text-emerald-500'
            }`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder-slate-500'
                  : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-400'
              }`}
              required
              minLength="6"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
            loading
              ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-emerald-500/25'
          }`}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              />
              Processing...
            </>
          ) : (
            <>
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </>
          )}
        </motion.button>
      </form>
    </>
  );
};

export default AuthForm;