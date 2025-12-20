import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeBenefits from "../components/home/HomeBenefits";
import HomeCTA from "../components/home/HomeCTA";

const HomePage = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <SEO
        title="Dashboard - Personal Finance Management"
        description="Access your personalized financial dashboard with real-time portfolio tracking, expense analytics, and AI-powered insights. Manage your wealth effectively with Financer."
        keywords="financial dashboard, portfolio tracking, expense analytics, financial insights, wealth management, investment tracking, personal finance dashboard"
        type="website"
      />

      <AnimatedBackground />

      <HomeHero />
      <HomeFeatures />
      <HomeBenefits />
      <HomeCTA />

      <Footer />
    </div>
  );
};

export default HomePage;
