import React, { useState, useEffect } from "react";
import { Loader, Link, Copy, Check, ChevronDown, ChevronUp, History, ExternalLink, Trash2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import URL_checker from "url-checker-extended";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "../utils/func";

export default function GeneratorUI() {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [urlHistory, setUrlHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const navigate = useNavigate();

  // Page loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load URL history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('urlHistory');
    if (savedHistory) {
      setUrlHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save URL history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('urlHistory', JSON.stringify(urlHistory));
  }, [urlHistory]);

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    if (!URL_checker.isUrl(inputValue)) {
      setIsLoading(true);
      setOutput(null);
      setError("Please enter a valid URL"); 
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setOutput(null);

      const csrfToken = await getCsrfToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/url`, {
        method: "POST",
        headers: {   
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken 
        },
        credentials: 'include',
        body: JSON.stringify({ url: inputValue }) 
      });
      
      const data = await response.json();
      
      if (data.status === "error") {
        navigate('/login');
        return;
      }

      const shortUrl = `${import.meta.env.VITE_API_URL}/api/url/${data.short_url_id}`;
      setOutput(shortUrl);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        originalUrl: inputValue,
        shortUrl: shortUrl,
        createdAt: new Date().toLocaleString(),
        clicks: 0
      };
      
      setUrlHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep only last 10 items
      
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      // console.error('Failed to copy: ', err);
    }
  };

  const handleDeleteHistoryItem = (id) => {
    setUrlHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setUrlHistory([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  // Loading screen
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Link className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            URL Shortener
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Making links beautiful...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-500">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-300 to-purple-500 rounded-full opacity-40"
          animate={{
            y: [0, -50, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-500 rounded-full opacity-40"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <motion.div
          className="w-full max-w-lg relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Link className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                URL Shortener
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Transform long URLs into short, shareable links</p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your long URL here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={handleGenerate}
                  disabled={isLoading || !inputValue.trim()}
                  className={`w-full text-lg py-4 rounded-xl shadow-lg transition-all duration-300 font-semibold ${
                    isLoading || !inputValue.trim()
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/25'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Link className="w-5 h-5 mr-2" />
                      Shorten URL
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Output Section */}
              <AnimatePresence>
                {output && (
                  <motion.div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700 mb-1">Your shortened URL:</p>
                        <p className="text-indigo-600 font-mono text-sm break-all">{output}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(output)}
                        className="ml-3 p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
                      >
                        {copiedUrl === output ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-green-600" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Section */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs">!</span>
                      </div>
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* History Section */}
          {urlHistory.length > 0 && (
            <motion.div
              className="mt-6 bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div 
                className="p-6 cursor-pointer hover:bg-white/20 transition-colors duration-200"
                onClick={() => setShowHistory(!showHistory)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="w-5 h-5 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Recent URLs ({urlHistory.length})
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {urlHistory.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                    <motion.div
                      animate={{ rotate: showHistory ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-white/20"
                  >
                    <div className="max-h-80 overflow-y-auto">
                      {urlHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="p-4 border-b border-white/10 last:border-b-0 hover:bg-white/20 transition-colors duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {item.originalUrl}
                              </p>
                              <p className="text-xs text-indigo-600 font-mono mt-1">
                                {item.shortUrl}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.createdAt}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleCopy(item.shortUrl)}
                                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                              >
                                {copiedUrl === item.shortUrl ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-indigo-600" />
                                )}
                              </button>
                              <button
                                onClick={() => window.open(item.shortUrl, '_blank')}
                                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                              >
                                <ExternalLink className="w-4 h-4 text-indigo-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteHistoryItem(item.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
