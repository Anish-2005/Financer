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
  Lock,
  Zap,
  Smartphone,
  Target,
  ArrowRight
} from "lucide-react";
import Footer from "../components/Footer";

const HomePage = () => {
  const navigate = useNavigate();
  
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

  const benefits = [
    { icon: Lock, title: "Secure", description: "Bank-level encryption" },
    { icon: Zap, title: "Fast", description: "Real-time updates" },
    { icon: Smartphone, title: "Accessible", description: "Multi-device support" },
    { icon: Target, title: "Accurate", description: "Precise analytics" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-emerald-500/20 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-400 font-medium">AI-Powered Financial Intelligence</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent leading-tight">
              Master Your Financial
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Journey Today
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Unify tracking, analysis, and investment management in one powerful platform. 
              Make smarter financial decisions with AI-driven insights and real-time market data.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-semibold text-lg backdrop-blur-sm hover:bg-slate-800/70 transition-all"
            >
              Watch Demo
            </motion.button>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
          >
            {[
              { value: "₹10M+", label: "Assets Managed" },
              { value: "50k+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete Financial Toolkit
          </h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to take control of your finances in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:border-slate-600"
              onClick={feature.action}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Action Link */}
                <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold text-sm">Why Choose Financer</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Smart Analytics,
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  Smarter Decisions
                </span>
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed">
                Our AI-powered platform analyzes your financial data to deliver actionable insights, 
                helping you make informed decisions and achieve your financial goals faster.
              </p>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
                  >
                    <benefit.icon className="w-8 h-8 text-emerald-400 mb-2" />
                    <div className="text-white font-semibold">{benefit.title}</div>
                    <div className="text-slate-400 text-sm">{benefit.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative h-96 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl border border-slate-700/50 flex items-center justify-center overflow-hidden">
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
                  <div className="text-xs text-slate-400">Growth</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="absolute bottom-10 left-10 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4"
                >
                  <div className="text-blue-400 font-bold">AI</div>
                  <div className="text-xs text-slate-400">Powered</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Transform Your Finances?
            </h3>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of users who are already making smarter financial decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg shadow-2xl hover:shadow-white/20 transition-all"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-transparent border-2 border-white text-white font-semibold text-lg backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
