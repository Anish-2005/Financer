import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const AnimatedBackground = () => {
  const { isDark } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large Gradient Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut"
        }}
        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20' 
            : 'bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30'
        }`}
      />
      
      <motion.div 
        animate={{ 
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 15,
          ease: "easeInOut",
          delay: 1
        }}
        className={`absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-l from-emerald-500/20 via-teal-500/20 to-cyan-500/20' 
            : 'bg-gradient-to-l from-emerald-400/30 via-teal-400/30 to-cyan-400/30'
        }`}
      />
      
      <motion.div 
        animate={{ 
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 18,
          ease: "easeInOut",
          delay: 2
        }}
        className={`absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl ${
          isDark 
            ? 'bg-gradient-to-tr from-violet-500/20 via-fuchsia-500/20 to-pink-500/20' 
            : 'bg-gradient-to-tr from-violet-400/30 via-fuchsia-400/30 to-pink-400/30'
        }`}
      />

      {/* Geometric Shapes */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 25,
          ease: "linear"
        }}
        className={`absolute top-1/4 left-1/2 w-64 h-64 ${
          isDark 
            ? 'border-2 border-blue-500/10' 
            : 'border-2 border-blue-400/20'
        } rounded-full`}
      />

      <motion.div
        animate={{ 
          rotate: [360, 0],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 30,
          ease: "easeInOut"
        }}
        className={`absolute bottom-1/3 right-1/4 w-48 h-48 ${
          isDark 
            ? 'border-2 border-purple-500/10' 
            : 'border-2 border-purple-400/20'
        }`}
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
      />

      {/* Floating Dots */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + i * 0.3,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          className={`absolute w-2 h-2 rounded-full ${
            isDark ? 'bg-emerald-400/30' : 'bg-emerald-500/40'
          }`}
          style={{
            left: `${10 + (i * 6)}%`,
            top: `${20 + (i * 4)}%`,
          }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? 'bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]'
        } bg-[size:4rem_4rem]`}
      />

      {/* Radial Gradient Overlay */}
      <div 
        className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]' 
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]'
        }`}
      />
    </div>
  );
};

export default AnimatedBackground;
