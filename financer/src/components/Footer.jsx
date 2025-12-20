import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src="/financer.png" 
              alt="Financer Logo" 
              className="h-10 w-10 object-contain" 
            />
          </motion.div>

          {/* Quote */}
          <p className="text-slate-400 italic text-center max-w-2xl">
            "Financial freedom is available to those who learn about it and work for it."
          </p>

          {/* Divider */}
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          {/* Copyright */}
          <p className="text-slate-500 text-sm">
            © 2025 Financer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
