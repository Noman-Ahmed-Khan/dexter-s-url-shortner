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
import { motion, useAnimation, useInView } from 'framer-motion';

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();
  
  // Animation controls for different sections
  const controls = {
    hero: useAnimation(),
    problem: useAnimation(),
    features: useAnimation(),
    stats: useAnimation(),
    audience: useAnimation(),
    cta: useAnimation()
  };

  // Refs for scroll-triggered animations
  const refs = {
    hero: React.useRef(null),
    problem: React.useRef(null),
    features: React.useRef(null),
    stats: React.useRef(null),
    audience: React.useRef(null),
    cta: React.useRef(null)
  };

  // Check if elements are in view
  const inView = {
    hero: useInView(refs.hero, { once: true, margin: "-100px" }),
    problem: useInView(refs.problem, { once: true, margin: "-100px" }),
    features: useInView(refs.features, { once: true, margin: "-100px" }),
    stats: useInView(refs.stats, { once: true, margin: "-100px" }),
    audience: useInView(refs.audience, { once: true, margin: "-100px" }),
    cta: useInView(refs.cta, { once: true, margin: "-100px" })
  };

  // Animate when elements come into view
  useEffect(() => {
    if (inView.hero) controls.hero.start("visible");
    if (inView.problem) controls.problem.start("visible");
    if (inView.features) controls.features.start("visible");
    if (inView.stats) controls.stats.start("visible");
    if (inView.audience) controls.audience.start("visible");
    if (inView.cta) controls.cta.start("visible");
  }, [inView, controls]);

  // Auto-cycle through features
  useEffect(() => {
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

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 0.3, 
          delay: 0.2 
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 30 }, 
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          damping: 12, 
          stiffness: 80,
          mass: 0.5, 
          duration: 0.8 
        }
      }
    };

    const fadeInVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 1.2, 
          ease: "easeOut" 
        }
      }
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
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
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
        ref={refs.hero}
        initial="hidden"
        animate={controls.hero}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              when: "beforeChildren",
              staggerChildren: 0.4, // Slower stagger
              delayChildren: 0.3 // Added delay
            }
          }
        }}
        className="pt-20 pb-16 px-4"
      >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 mb-6">
                <motion.div 
                  initial={{ scale: 0.8, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                  GenApp
                </h1>
              </div>
              
              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
              >
                Your simple, fast, and reliable solution for shortening long URLs into short, custom, and shareable links.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  onClick={() => navigate('/login')}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Problem Statement */}
        <motion.section 
          ref={refs.problem}
          initial="hidden"
          animate={controls.problem}
          variants={fadeInVariants}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                Why We Created GenApp
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                Sharing long, messy URLs can be a hassle. Whether with friends, on social media, or in your business. That's why we created GenApp, a tool that transforms any web address into a short, clean, and professional link in seconds, making it effortless to share and track with confidence.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={refs.features}
          initial="hidden"
          animate={controls.features}
          variants={containerVariants}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Why Choose 
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> GenApp</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the features that make GenApp the perfect choice for all your URL shortening needs.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
                    activeFeature === index ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`}></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-8 h-full">
                    <motion.div 
                      animate={{ 
                        scale: activeFeature === index ? 1.1 : 1,
                        rotate: activeFeature === index ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg mb-6`}
                    >
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </motion.div>
                    
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={refs.stats}
          initial="hidden"
          animate={controls.stats}
          variants={fadeInVariants}
          className="py-16 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Trusted by Users Worldwide
                </h2>
                <p className="text-purple-100 text-lg">
                  Join thousands of satisfied users who have made GenApp their go-to URL shortener.
                </p>
              </div>
              
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="text-center group"
                  >
                    <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4 group-hover:bg-white/30 transition-all duration-300">
                      {React.cloneElement(stat.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-2xl md:text-3xl font-bold mb-2"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-purple-100 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Target Audience */}
        <motion.section 
          ref={refs.audience}
          initial="hidden"
          animate={controls.audience}
          variants={containerVariants}
          className="py-16 px-4"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
                Perfect For Everyone
              </h2>
              
              <motion.div 
                variants={containerVariants}
                className="grid md:grid-cols-2 gap-8"
              >
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
                >
                  <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Individuals</h3>
                  <p className="text-gray-600">
                    Looking to share smarter and make your personal links more memorable and professional.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100"
                >
                  <div className="inline-flex p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Businesses</h3>
                  <p className="text-gray-600">
                    Looking to improve your online presence and make your marketing materials more effective.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          ref={refs.cta}
          initial="hidden"
          animate={controls.cta}
          variants={containerVariants}
          className="py-20 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Ready to Start Shortening?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Start shortening your URLs today and experience the simplicity and power of GenApp.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                onClick={() => navigate('/login')}
              >
                <Sparkles className="w-5 h-5" />
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 flex items-center gap-2"
              >
                <Star className="w-5 h-5" />
                View Features
              </motion.button>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-500 mt-6 text-sm"
            >
              No credit card required • Start shortening instantly • Join 50,000+ users
            </motion.p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;