import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Mail,
  Heart,
  ArrowUp,
  ExternalLink
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative z-10 backdrop-blur-xl border-t transition-all duration-300 ${
      isDark
        ? 'bg-slate-900/80 border-slate-800/50'
        : 'bg-white/80 border-slate-200/50'
    } py-16`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`p-3 rounded-2xl border-2 transition-colors ${
                  isDark
                    ? 'border-slate-600 hover:border-slate-500'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <img
                  src="/financer.png"
                  alt="Financer Logo"
                  className="h-8 w-8 object-contain"
                />
              </motion.div>
              <div>
                <h3 className={`text-2xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Financer
                </h3>
                <p className={`text-sm transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Smart Investment Solutions
                </p>
              </div>
            </motion.div>

            <p className={`text-base leading-relaxed max-w-md transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Empowering investors with real-time data, advanced analytics, and intelligent insights
              to make informed financial decisions and achieve financial freedom.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'bg-slate-100/50 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'bg-slate-100/50 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-all ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'bg-slate-100/50 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className={`text-lg font-semibold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', href: '/' },
                { name: 'Stocks', href: '/stocks' },
                { name: 'Portfolios', href: '/portfolios' },
                { name: 'Comparisons', href: '/comparisons' },
                { name: 'FD Calculator', href: '/fd' }
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h4 className={`text-lg font-semibold transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Support
            </h4>
            <div className="space-y-3">
              <motion.a
                href="mailto:support@financer.com"
                whileHover={{ x: 5 }}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                support@financer.com
              </motion.a>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
                Back to Top
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t transition-colors ${
          isDark ? 'border-slate-800/50' : 'border-slate-200/50'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center md:text-left"
            >
              <p className={`italic text-sm transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                "Financial freedom is available to those who learn about it and work for it."
              </p>
            </motion.div>

            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`transition-colors ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}>
                © {currentYear} Financer. Made with
              </span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span className={`transition-colors ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}>
                by Anish
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
