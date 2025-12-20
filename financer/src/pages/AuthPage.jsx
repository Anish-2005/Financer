import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedBackground from '../components/AnimatedBackground';
import Footer from '../components/Footer';
import AuthHero from '../components/auth/AuthHero';
import AuthForm from '../components/auth/AuthForm';
import AuthToggle from '../components/auth/AuthToggle';

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

  const API_URL = 'https://financer-4pzl.onrender.com';

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
          <AuthHero isDark={isDark} isLogin={isLogin} />

          <AuthForm
            isDark={isDark}
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            loading={loading}
            handleSubmit={handleSubmit}
          />

          <AuthToggle
            isDark={isDark}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            setError={setError}
          />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage;

