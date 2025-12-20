import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const API_URL = 'http://localhost:8000';

  const handleAuth = async (endpoint) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      if (endpoint === 'login') {
        localStorage.setItem('firebaseToken', data.token);
        navigate('/home');
      } else {
        setIsLogin(true);
        setError('Account created successfully! Please login.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth(isLogin ? 'login' : 'signup');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      {/* Auth Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 shadow-2xl transition-colors ${
            isDark
              ? 'bg-slate-800/40 border border-slate-700/50'
              : 'bg-white/40 border border-slate-200/50'
          }`}
        >
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
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;