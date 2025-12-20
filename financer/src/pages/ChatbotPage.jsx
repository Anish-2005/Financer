import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import ChatbotHero from "../components/chatbot/ChatbotHero";
import ChatbotInterface from "../components/chatbot/ChatbotInterface";

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
      const response = await fetch("https://financer-4pzl.onrender.com/chat", {
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
      <SEO
        title="AI Financial Advisor - Personalized Financial Guidance"
        description="Get personalized financial advice from our AI-powered chatbot. Ask questions about investments, budgeting, savings, and wealth management. Powered by Google Gemini for intelligent financial guidance."
        keywords="AI financial advisor, chatbot, financial guidance, investment advice, budgeting help, wealth management, Google Gemini AI, financial planning assistant"
        type="website"
      />

      <AnimatedBackground />

      <ChatbotHero isDark={isDark} />

      <ChatbotInterface
        isDark={isDark}
        messages={messages}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSend={handleSend}
      />

      <Footer />
    </div>
  );
};

export default ChatbotPage;