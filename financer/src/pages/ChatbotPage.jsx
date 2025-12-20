import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Send,
  MessageCircle,
  Sparkles,
  Brain,
  ArrowRight,
  Zap
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

const ChatbotPage = () => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you with your finances today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\n\*/g, "<br>&#8226; "); // Bullet points
  };

  const fetchBotResponse = async (message) => {
    const token = localStorage.getItem("firebaseToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return formatMessage(data.response);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I'm having trouble connecting to the server. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await fetchBotResponse(userMessage.text);
      const botMessage = { text: botResponse, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: "Sorry, I couldn't process your request. Please try again.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

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
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-colors ${
              isDark
                ? 'bg-slate-800/50 border border-emerald-500/20'
                : 'bg-white/50 border border-emerald-500/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-emerald-400 font-medium">AI Financial Assistant</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className={`text-6xl md:text-7xl font-bold leading-tight transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 bg-clip-text text-transparent'
            }`}>
              Smart Financial
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Conversations
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Get personalized financial advice, analyze your portfolio, and make informed decisions
              with our intelligent AI assistant powered by advanced financial algorithms.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 max-w-4xl mx-auto"
          >
            {[
              { icon: Brain, title: "AI-Powered", description: "Advanced algorithms" },
              { icon: Zap, title: "Instant Response", description: "Real-time answers" },
              { icon: Sparkles, title: "Personalized", description: "Tailored advice" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`backdrop-blur-sm rounded-xl p-6 transition-colors ${
                  isDark
                    ? 'bg-slate-800/30 border border-slate-700/50'
                    : 'bg-white/30 border border-slate-200/50'
                }`}
              >
                <feature.icon className="w-8 h-8 text-emerald-400 mb-3 mx-auto" />
                <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-1">
                  {feature.title}
                </div>
                <div className={`text-sm transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>{feature.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Chat Interface */}
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
            <div className="inline-flex px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-emerald-400 font-semibold text-sm">Interactive Chat</span>
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors ${
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
          <div className={`h-[500px] rounded-2xl p-6 transition-colors ${
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
                  <div className={`max-w-lg px-6 py-4 rounded-2xl backdrop-blur-sm ${
                    msg.sender === "user"
                      ? `bg-gradient-to-r from-emerald-500 to-blue-600 text-white ml-12`
                      : `bg-slate-800/50 border border-slate-700/50 text-slate-200 mr-12`
                  }`}>
                    <div className="flex items-start gap-3">
                      {msg.sender === "bot" && (
                        <Bot className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                      {msg.sender === "user" && (
                        <MessageCircle className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" />
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
                  <div className={`px-6 py-4 rounded-2xl backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 mr-12`}>
                    <div className="flex items-center gap-3">
                      <Bot className="w-5 h-5 text-emerald-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <MessageCircle className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about investments, expenses, or financial planning..."
                className={`w-full pl-12 pr-4 py-4 rounded-xl border transition-all ${
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
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatbotPage;
