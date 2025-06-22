import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import Spinner from '../components/spinner';


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation after login
  
  const getCsrfToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/csrf-token`, {
      credentials: 'include'
    });
    const data = await res.json();
    return data.csrfToken;
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    const csrfToken = await getCsrfToken();

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken 
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Login failed");
      }

      // Optional: Extract token or user data if returned
      // const data = await response.json();
      // localStorage.setItem("token", data.token);

      navigate('/'); // Redirect on successful login

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white w-[85%] mb-20 px-10 py-20 rounded-3xl border-2 border-gray-200 shadow-md">
          <h1 className="text-5xl font-semibold flex items-center gap-4 text-center">
            Welcome Back
            <span role="img" aria-label="login icon">
              👋
            </span>
          </h1>
          <p className="font-medium text-lg text-gray-500 mt-4">Please enter your details</p>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="text-lg font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-lg font-medium">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox"
                />
                <span className="text-base font-medium">Remember Me</span>
              </label>
              <button type="button" className="text-violet-500 text-sm hover:underline">Forgot Password?</button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="bg-violet-500 text-white text-lg font-bold py-3 rounded-xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Log In"}
              </button>

              <button
                type="button"
                className="flex items-center gap-2 justify-center border-2 border-gray-200 py-3 rounded-xl text-lg font-bold hover:bg-gray-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

            <div className="mt-6 text-center">
              <p className="text-base font-medium">
                Don't have an account?{" "}
                <button className="text-violet-500 hover:underline" type="button">Sign up</button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex h-full w-1/2 items-center justify-center bg-gray-100 relative">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-white/10 backdrop-blur-lg" />
      </div>
    </div>
  );
};

export default Login;
