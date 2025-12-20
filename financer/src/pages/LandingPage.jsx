import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import LandingNavigation from "../components/landing/LandingNavigation";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingStats from "../components/landing/LandingStats";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleNavigation = () => navigate('/auth');

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      <SEO
        title="AI-Powered Personal Finance Management"
        description="Transform your financial future with AI-powered insights, real-time market data, and intelligent expense tracking. Join thousands who have taken control of their money with Financer."
        keywords="personal finance, AI financial advisor, expense tracking, stock analysis, portfolio management, financial planning, investment calculator, money management"
        type="website"
      />

      <LandingNavigation onNavigate={handleNavigation} />
      <LandingHero onNavigate={handleNavigation} />
      <LandingFeatures />
      <LandingStats />

      <Footer />
    </div>
  );
};

export default LandingPage;
