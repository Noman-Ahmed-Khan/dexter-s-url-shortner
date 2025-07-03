import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import URL_checker from "url-checker-extended";
import { useNavigate } from "react-router-dom";
import {getCsrfToken} from "../utils/func";
// import url from "url";

 export default function GeneratorUI() {
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scroll,setScrolled] = useState(false);
  const navigate = useNavigate();


  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    if (!URL_checker.isUrl(inputValue)) {
      setIsLoading(true);
      setOutput(null);
      setError("INVALID URL"); 
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setOutput(null);

      // const token = localStorage.getItem('token'); // Save it after login
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/url`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });


      const csrfToken = await getCsrfToken();
      const response = await fetch("http://localhost:3000/api/url", {
        method: "POST",
        headers: {   
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken 
        },
        credentials: 'include',
        body: JSON.stringify({ url: inputValue }) 
      });
      const data = await response.json();
      if(data.status==="error"){
        navigate('/login');
      }
      setOutput(`http://localhost:3000/api/url/${data.short_url_id}`);
      // const my_url=url.parse(inputValue,url);
      // setOutput(`Short URL: ${my_url}`);
      // console.log(my_url);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-indigo-400 via-white to-pink-400 transition-all duration-500">      
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-28">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 shadow-2xl rounded-2xl bg-white space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Paste your long URL here
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
              <h1 className="text-1xl font-bold text-left text-gray-500">
                Short URL:
              </h1>
   
                {output}
              </motion.div>
            )}
            {error && <div style={{ color: 'red' }}>{error}</div>}
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