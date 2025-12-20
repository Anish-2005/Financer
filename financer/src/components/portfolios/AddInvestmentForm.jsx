import React from "react";
import { motion } from "framer-motion";
import { PieChart, DollarSign, Target, Plus } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const AddInvestmentForm = ({ newInvestment, setNewInvestment, onAddInvestment }) => {
  const { isDark } = useTheme();

  const handleAddInvestment = () => {
    if (!newInvestment.type || !newInvestment.balance) return;

    onAddInvestment();
  };

  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-8 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="text-center mb-8">
          <div className="inline-flex px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="text-blue-400 font-semibold text-sm">Add Asset</span>
          </div>
          <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Expand Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Asset Type</label>
            <div className="relative">
              <PieChart className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <select
                value={newInvestment.type}
                onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500'
                } focus:ring-2 focus:ring-emerald-400/20`}
              >
                <option value="Fixed Deposits">Fixed Deposits</option>
                <option value="Stocks">Stocks</option>
                <option value="Mutual Funds">Mutual Funds</option>
                <option value="Bonds">Bonds</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Crypto">Crypto</option>
                <option value="ETF">ETF</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Investment Amount</label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="number"
                placeholder="Enter amount"
                value={newInvestment.balance}
                onChange={(e) => setNewInvestment({ ...newInvestment, balance: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-800/50 border-slate-600 text-white focus:border-emerald-400 placeholder-slate-400'
                    : 'bg-white/50 border-slate-300 text-slate-900 focus:border-emerald-500 placeholder-slate-500'
                } focus:ring-2 focus:ring-emerald-400/20`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>Color</label>
            <div className="relative">
              <Target className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="color"
                value={newInvestment.color}
                onChange={(e) => setNewInvestment({ ...newInvestment, color: e.target.value })}
                className="w-full h-12 rounded-xl border cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddInvestment}
              disabled={!newInvestment.type || !newInvestment.balance}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                newInvestment.type && newInvestment.balance
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddInvestmentForm;