import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Link, 
  Zap, 
  BarChart3, 
  Shield, 
  Users, 
  Globe, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate=useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Link className="w-8 h-8" />,
      title: "Customizable Links",
      description: "Personalize your short URLs to make them more meaningful and branded.",
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick & Easy",
      description: "Paste your long link, choose a custom name (optional), and get your short link instantly.",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Trackable & Reliable",
      description: "Our URLs are designed to be robust and work seamlessly anywhere — emails, chats, websites, or print.",
      gradient: "from-violet-500 to-indigo-600",
      bgGradient: "from-violet-50 to-indigo-50"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "Your data is handled with care, and our platform ensures that all generated links are secure and trustworthy.",
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, label: "Active Users", value: "50K+" },
    { icon: <Link className="w-6 h-6" />, label: "Links Created", value: "2M+" },
    { icon: <Globe className="w-6 h-6" />, label: "Countries", value: "150+" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Uptime", value: "99.9%" }
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 overflow-hidden">
      <motion.div
          className="fixed top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-300 to-purple-500 rounded-full opacity-40"
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
          className="fixed bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-500 rounded-full opacity-40"
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
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                  GenApp
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                Your simple, fast, and reliable solution for shortening long URLs into short, custom, and shareable links.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  onClick={()=>navigate('/login')}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                Why We Created GenApp
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                Sharing long, messy URLs can be a hassle. Whether with friends, on social media, or in your business. That’s why we created GenApp, a tool that transforms any web address into a short, clean, and professional link in seconds, making it effortless to share and track with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Why Choose 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> GenApp</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the features that make GenApp the perfect choice for all your URL shortening needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                    activeFeature === index ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`}></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-8 h-full">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg mb-6 transition-all duration-300 ${
                      activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className={`mt-4 flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      activeFeature === index ? 'text-purple-600' : 'text-gray-400'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                      <span>Available Now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Trusted by Users Worldwide
                </h2>
                <p className="text-purple-100 text-lg">
                  Join thousands of satisfied users who have made GenApp their go-to URL shortener.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 group-hover:bg-white/30 transition-all duration-300">
                      {React.cloneElement(stat.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-purple-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Perfect For Everyone
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                  <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Individuals</h3>
                  <p className="text-gray-600">
                    Looking to share smarter and make your personal links more memorable and professional.
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                  <div className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Businesses</h3>
                  <p className="text-gray-600">
                    Looking to improve your online presence and make your marketing materials more effective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Ready to Start Shortening?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Start shortening your URLs today and experience the simplicity and power of GenApp.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                  onClick={()=>navigate('/login')}
              >
                <Sparkles className="w-5 h-5" />
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center gap-2">
                <Star className="w-5 h-5" />
                View Features
              </button>
            </div>
            
            <p className="text-gray-500 mt-6 text-sm">
              No credit card required • Start shortening instantly • Join 50,000+ users
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;