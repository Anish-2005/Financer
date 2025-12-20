import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import FDHero from "../components/fd/FDHero";
import FDAddForm from "../components/fd/FDAddForm";
import FDPortfolio from "../components/fd/FDPortfolio";

const FDPage = () => {
  const { isDark } = useTheme();
  const [fds, setFds] = useState(() => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) return [];
    const savedFDs = localStorage.getItem('fds');
    return savedFDs ? JSON.parse(savedFDs) : [];
  });

  const [newFd, setNewFd] = useState({
    bank: "",
    amount: "",
    rate: "",
    tenure: "",
    startDate: ""
  });
  const [sortBy, setSortBy] = useState("date");
  const [selectedBank, setSelectedBank] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      localStorage.setItem('fds', JSON.stringify(fds));
    }
  }, [fds]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        localStorage.removeItem('fds');
        setFds([]);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleAddFD = () => {
    if (!Object.values(newFd).every(Boolean)) return;

    const fdToAdd = {
      ...newFd,
      id: Date.now(),
      amount: parseFloat(newFd.amount),
      rate: parseFloat(newFd.rate),
      tenure: parseInt(newFd.tenure),
      interest: (parseFloat(newFd.amount) * parseFloat(newFd.rate) * parseInt(newFd.tenure)) / 1200
    };

    setFds(prev => [...prev, fdToAdd]);
    setNewFd({ bank: "", amount: "", rate: "", tenure: "", startDate: "" });
  };

  const handleDeleteFD = (id) => {
    setFds(prev => prev.filter(fd => fd.id !== id));
  };

  const sortedFds = [...fds].sort((a, b) => {
    if (sortBy === "amount") return b.amount - a.amount;
    if (sortBy === "rate") return b.rate - a.rate;
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const filteredFds = sortedFds.filter(fd =>
    selectedBank === "All" || fd.bank === selectedBank
  );

  const totalInvestment = filteredFds.reduce((acc, fd) => acc + fd.amount, 0);
  const totalInterest = filteredFds.reduce((acc, fd) => acc + fd.interest, 0);
  const banks = [...new Set(fds.map(fd => fd.bank))].sort();

  const calculateMaturityDate = (startDate, tenure) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + tenure);
    return date.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground />

      <FDHero
        totalInvestment={totalInvestment}
        totalInterest={totalInterest}
        fdCount={filteredFds.length}
        topBank={banks[0]}
      />

      <FDAddForm
        newFd={newFd}
        setNewFd={setNewFd}
        handleAddFD={handleAddFD}
        banks={banks}
      />

      <FDPortfolio
        filteredFds={filteredFds}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        sortBy={sortBy}
        setSortBy={setSortBy}
        banks={banks}
        handleDeleteFD={handleDeleteFD}
        calculateMaturityDate={calculateMaturityDate}
      />

      <Footer />
    </div>
  );
};

export default FDPage;
