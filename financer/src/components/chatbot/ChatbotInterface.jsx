import React from "react";
import { motion } from "framer-motion";
import { Bot, Send, MessageCircle } from "lucide-react";

const ChatbotInterface = ({
  isDark,
  messages,
  input,
  setInput,
  isLoading,
  handleSend
}) => {
  return (
    <div className="relative z-10 container mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50'
            : 'bg-gradient-to-br from-white/50 to-slate-50/50 border border-slate-200/50'
        }`}
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex px-3 sm:px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="text-emerald-400 font-semibold text-sm">Interactive Chat</span>
          </div>
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 transition-colors ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Ask Your Financial
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h3>
        </div>

        {/* Chat Container */}
        <div className={`h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl p-4 sm:p-6 transition-colors ${
          isDark
            ? 'bg-slate-900/50 border border-slate-700/50'
            : 'bg-slate-50/50 border border-slate-200/50'
        }`}>
          <div className="h-full overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] sm:max-w-lg px-4 sm:px-6 py-3 sm:py-4 rounded-2xl backdrop-blur-sm ${
                  msg.sender === "user"
                    ? `bg-gradient-to-r from-emerald-500 to-blue-600 text-white ml-4 sm:ml-12`
                    : `bg-slate-800/50 border border-slate-700/50 text-slate-200 mr-4 sm:mr-12`
                }`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    {msg.sender === "bot" && (
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div
                      className="text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                    {msg.sender === "user" && (
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mt-0.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-2xl backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 mr-4 sm:mr-12`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <MessageCircle className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about investments, expenses, or financial planning..."
              className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-xl border transition-all text-sm sm:text-base ${
                isDark
                  ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-400'
                  : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-emerald-500'
              } focus:ring-2 focus:ring-emerald-400/20`}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
          </div>
          <motion.button
            onClick={handleSend}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            disabled={isLoading}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Send'}</span>
            <span className="sm:hidden">{isLoading ? '...' : 'Send'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotInterface;