import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle, User, Briefcase, Users } from 'lucide-react';
import "../css/login.css";
import Spinner from '../components/spinner';
import { getCsrfToken } from '../utils/func';
import { useAuth } from "../contexts/authcontext";

// Memoized InputField component outside of the main component
const InputField = memo(({ id, label, type, value, onChange, placeholder, icon: Icon, required = true, delay = 0, focusedField, setFocusedField, showPassword, setShowPassword, passwordStrength }) => {
  return (
    <div className={`group relative transform transition-all duration-700`} style={{ transitionDelay: `${delay}ms` }}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1 animate-pulse">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-all duration-300 ${
            focusedField === id ? 'text-violet-600 scale-110' : 'text-slate-400 scale-100'
          }`} />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-0 transform ${
            focusedField === id 
              ? 'border-violet-500 bg-white shadow-lg shadow-violet-500/20 scale-[1.02]' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          } ${id === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField('')}
          required={required}
          autoComplete={id === 'email' ? 'email' : id === 'password' ? 'new-password' : id}
          aria-invalid={id === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
        />
        {id === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-all duration-200 hover:scale-110"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {id === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && (
        <p className="mt-1 text-sm text-red-600 animate-pulse">Please enter a valid email address</p>
      )}
      {id === 'password' && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  passwordStrength >= i 
                    ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-yellow-400' : 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs mt-1 text-gray-500">
            {passwordStrength === 0 ? 'Weak' : 
             passwordStrength <= 2 ? 'Moderate' : 
             passwordStrength === 3 ? 'Strong' : 'Very strong'}
          </p>
        </div>
      )}
    </div>
  );
});

// Memoized SelectField component
const SelectField = memo(({ id, label, value, onChange, options, placeholder, icon: Icon, required = false, delay = 0, focusedField, setFocusedField }) => {
  return (
    <div className={`group relative transform transition-all duration-700`} style={{ transitionDelay: `${delay}ms` }}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1 animate-pulse">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-all duration-300 ${
            focusedField === id ? 'text-violet-600 scale-110' : 'text-slate-400 scale-100'
          }`} />
        </div>
        <select
          id={id}
          name={id}
          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-0 transform appearance-none cursor-pointer ${
            focusedField === id 
              ? 'border-violet-500 bg-white shadow-lg shadow-violet-500/20 scale-[1.02]' 
              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
          }`}
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField('')}
          required={required}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
});

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    job: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    const formTimer = setTimeout(() => {
      setFormVisible(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(formTimer);
    };
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleRegistration = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() || 
        !formData.gender.trim() || !formData.job.trim() || !formData.password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please strengthen your password.");
      return;
    }

    const csrfToken = await getCsrfToken();

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken 
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Registration failed");
      }

      setIsSuccess(true);
      await refetchUser();
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [formData, passwordStrength, refetchUser, navigate]);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Panel - Registration Form */}
        <div className="flex-1 flex items-center justify-center mt-14 mb-14 px-4 sm:px-6 lg:px-8">
          <div className={`w-full max-w-lg space-y-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {/* Header */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl mb-6 shadow-lg transform transition-all duration-700 hover:scale-110 hover:rotate-3 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
              }`}>
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className={`text-3xl font-bold text-slate-900 mb-2 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>
                Create Account
              </h1>
              <p className={`text-slate-600 text-lg transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>
                Join us today and start your journey
              </p>
            </div>

            {/* Registration Form */}
            <div className={`bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-700 hover:shadow-2xl ${
              formVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`} style={{ transitionDelay: '400ms' }}>
              <form onSubmit={handleRegistration} className="space-y-6">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="first_name"
                    label="First Name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    icon={User}
                    required
                    delay={100}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <InputField
                    id="last_name"
                    label="Last Name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    icon={User}
                    required
                    delay={150}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </div>

                <InputField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={Mail}
                  required
                  delay={200}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    id="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={genderOptions}
                    placeholder="Select your gender"
                    icon={Users}
                    required
                    delay={250}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                  <InputField
                    id="job"
                    label="Job Title"
                    type="text"
                    value={formData.job}
                    onChange={handleChange}
                    placeholder="Enter your job title"
                    icon={Briefcase}
                    required
                    delay={300}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                  />
                </div>

                <InputField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  icon={Lock}
                  required
                  delay={350}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  passwordStrength={passwordStrength}
                />

                {/* Remember Me & Terms */}
                <div className={`flex items-center justify-between transform transition-all duration-700 ${
                  formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ transitionDelay: '400ms' }}>
                  <label className="flex items-center group cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-300 transform ${
                        rememberMe 
                          ? 'bg-violet-600 border-violet-600 scale-110' 
                          : 'border-slate-300 group-hover:border-slate-400 group-hover:scale-105'
                      }`}>
                        {rememberMe && (
                          <CheckCircle className="w-5 h-5 text-white absolute -top-0.5 -left-0.5 animate-bounce" />
                        )}
                      </div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button 
                    type="button" 
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-all duration-200 hover:scale-105"
                  >
                    Terms & Conditions
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-bounce">
                    <p className="text-red-600 text-sm font-medium text-center animate-pulse">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {isSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-bounce">
                    <p className="text-green-600 text-sm font-medium text-center animate-pulse">
                      Registration successful! Redirecting...
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className={`transform transition-all duration-700 ${
                  formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ transitionDelay: '450ms' }}>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center items-center px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                    disabled={loading || isSuccess}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Spinner />
                        <span className="ml-2 animate-pulse">Creating account...</span>
                      </div>
                    ) : isSuccess ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Success!</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className={`relative my-6 transform transition-all duration-700 ${
                  formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ transitionDelay: '500ms' }}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <div className={`transform transition-all duration-700 ${
                  formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ transitionDelay: '550ms' }}>
                  <button
                    type="button"
                    className="group relative w-full flex justify-center items-center px-6 py-4 border-2 border-slate-200 text-base font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                  >
                    <img 
                      src="https://www.svgrepo.com/show/475656/google-color.svg" 
                      alt="Google" 
                      className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" 
                    />
                    <span>Sign up with Google</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sign In Link */}
            <div className={`text-center transform transition-all duration-700 ${
              formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: '600ms' }}>
              <p className="text-slate-600">
                Already have an account?{" "}
                <button 
                  className="font-semibold text-violet-600 hover:text-violet-700 transition-all duration-200 hover:scale-105"
                  type="button" 
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Decorative with Enhanced Bouncing Animation */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-pink-600 to-purple-700"></div>
          
          {/* Enhanced Bouncing Ball Animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-60 h-60 bg-gradient-to-tr from-white/30 to-white/10 rounded-full animate-bounce shadow-2xl"></div>
            <div className="absolute top-8 left-8 w-44 h-44 bg-gradient-to-br from-white/20 to-white/5 rounded-full animate-pulse"></div>
            <div className="absolute top-16 left-16 w-28 h-28 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Additional Geometric Shapes */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-white/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-32 w-20 h-20 bg-white/20 rounded-full blur-lg animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-12">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold text-white mb-6">
                Join Our Community
              </h2>
              <p className="text-xl text-violet-100 mb-8">
                Start your journey with us today and unlock endless possibilities in your career.
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center text-violet-100">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Secure Registration</span>
                </div>
                <div className="flex items-center text-violet-100">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Trusted Platform</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
