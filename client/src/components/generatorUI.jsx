import React, { useState, useEffect } from "react";
import { Menu, Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function GeneratorUI() {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOutput(`Generated text based on: "${inputValue}"`);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-indigo-300 via-white to-pink-300 transition-all duration-500">
      {/* Navbar */}
      <nav
        className={`left-0 right-0 fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        } backdrop-blur-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold text-indigo-700 hover:scale-105 transition-transform">
            GenApp
          </div>
          <Menu className="w-6 h-6 text-indigo-700 hover:text-indigo-900 transition-colors" />
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-23">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 shadow-2xl rounded-2xl bg-white space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Text Generator
            </h1>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={isLoading || !inputValue.trim()}
                className={`w-full text-lg p-3 rounded-lg shadow-md transition-colors duration-300 text-white ${
                    isLoading || !inputValue.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-400 to-pink-400 hover:from-indigo-500 hover:to-pink-500'
                }`}
                >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                    </div>
                    ) : (
                        "Generate"
                    )}
            </motion.button>

            </div>
            
            {output && (
              <motion.div
                className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {output}
              </motion.div>
            )}
            
            {!output && inputValue && !isLoading && (
              <p className="text-sm text-gray-500 text-center">
                Click generate to create text based on your input
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}