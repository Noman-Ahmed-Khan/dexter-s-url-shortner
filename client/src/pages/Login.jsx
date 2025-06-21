import * as React from 'react';
import "../css/login.css";
import Spinner from '../components/spinner'; // adjust path as needed

export default function Login() {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      alert("Logged in!");
    }, 2000);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="bg-white w-[85%] mb-20 items-center justify-center px-10 py-20 rounded-3xl border-2 border-gray-200">
          <h1 className="text-5xl font-semibold flex items-center gap-4 text-center">Welcome Back 
            <svg width="64" height="64"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path d="M121.5 62.25H68.225l9.523-9.523a1.75 1.75 0 0 0-2.475-2.475L62.765 62.76a1.755 1.755 0 0 0-.221.271c-.025.038-.042.079-.064.118a1.045 1.045 0 0 0-.149.352c-.016.052-.036.1-.047.157a1.756 1.756 0 0 0 0 .685c.011.054.031.1.046.156a1.7 1.7 0 0 0 .053.17 1.732 1.732 0 0 0 .1.182c.022.039.039.081.065.119a1.755 1.755 0 0 0 .221.271l12.504 12.507a1.75 1.75 0 0 0 2.475-2.475l-9.523-9.523H121.5a1.75 1.75 0 0 0 0-3.5z"/>
                <path d="M96 72.25A1.75 1.75 0 0 0 94.25 74v36.9H49.209V17.1H94.25V54a1.75 1.75 0 0 0 3.5 0V15.35A1.75 1.75 0 0 0 96 13.6H49.209V6.5a1.75 1.75 0 0 0-2.461-1.6L6.94 22.593a1.751 1.751 0 0 0-1.039 1.6v79.615a1.751 1.751 0 0 0 1.039 1.6L46.748 123.1a1.75 1.75 0 0 0 2.461-1.6v-7.1H96a1.75 1.75 0 0 0 1.75-1.75V74A1.75 1.75 0 0 0 96 72.25zm-50.291 46.558L9.4 102.67V25.33L45.709 9.192z"/>
                <path d="M13.076 97.083a1.75 1.75 0 0 0 1.75-1.75V66.667a1.75 1.75 0 0 0-3.5 0v28.666a1.75 1.75 0 0 0 1.75 1.75z"/>
            </svg>

          </h1>
          <p className="font-medium text-lg text-gray-500 mt-4">Please enter your details</p>
          <div className="mt-8">
            <div>
              <label className="text-lg font-medium">Email</label>
              <input className="w-full border-2 border-gray-100 round-xl p-4 mt-1 bg-transparent" placeholder="Enter your email" />
            </div>
            <div>
              <label className="text-lg font-medium">Password</label>
              <input type="password" className="w-full border-2 border-gray-100 round-xl p-4 mt-1 bg-transparent" placeholder="Enter your password" />
            </div>

            <div className="mt-8 flex justify-between">
              <div>
                <input type="checkbox" id='remember' />
                <label htmlFor="remember" className="ml-2 font-medium text-base">Remember Me</label>
              </div>
              <button className="font-medium text-violet-500">Forgot Password</button>
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                onClick={handleLogin}
                className="hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 transition-all bg-violet-500 text-white text-lg font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : "Log In"}
              </button>

              <button className="flex items-center gap-2 hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 transition-all justify-center border-gray-200 border-2 py-3 rounded-xl text-lg font-bold">
                <svg className="w-6 h-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.4 1.2 8.6 3.2l6.4-6.4C34.8 2.1 29.8 0 24 0 14.7 0 6.9 5.6 2.7 13.7l7.5 5.8C12.5 13.1 17.7 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-2.8-.4-4.1H24v8h12.6c-.6 3.1-2.4 5.7-5.1 7.5v6.2h8.2c4.8-4.4 6.4-10.9 6.4-17.6z"/>
                  <path fill="#FBBC05" d="M10.2 28.3c-.6-1.9-.9-3.9-.9-6s.3-4.1.9-6L2.7 13.7C1 17.1 0 20.9 0 24.5s1 7.4 2.7 10.8l7.5-5.7z"/>
                  <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.6l-8.2-6.2c-2.2 1.5-5.1 2.5-7.8 2.5-6.3 0-11.6-4.3-13.4-10.1l-7.5 5.8C6.9 42.4 14.7 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Sign Up with Google
              </button>
            </div>

            <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">Don't have an account?</p>
              <button className="font-medium text-violet-500 font-base ml-2">Sign up</button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div>
      </div>
    </div>
  );
}
