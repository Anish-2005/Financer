import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HomeCTA = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default HomeCTA;