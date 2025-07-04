import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import Spinner from '../components/spinner';
import { getCsrfToken } from '../utils/func';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  

  const handleRegistration = async () => {
    if (!first_name.trim() || !last_name.trim() || !email.trim() || !gender.trim() || !job.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    const csrfToken = await getCsrfToken();

    try {
      setLoading(true);
      setError('');

//       // const token = localStorage.getItem('token'); // Save it after login
//       // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
//       //   headers: {
//       //     'Authorization': `Bearer ${token}`,
//       //   },
//       // });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken 
        },
        credentials: 'include',
        body: JSON.stringify({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:password,
                gender:gender,
                job:job
            }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || "Registration failed");
      }

//       // Optional: Extract token or user data if returned
//       // const data = await response.json();
//       // localStorage.setItem("token", data.token);
      await refetchUser(); // Refresh user data after login
      navigate('/'); // Redirect on successful registation

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-indigo-300 via-white to-pink-300">
      <div className="w-full flex items-center justify-center lg:w-1/2 m-16">
        <div className="bg-white w-[85%] mb-20 px-10 py-20 rounded-3xl border-2 border-gray-200 shadow-md">
          <h1 className="text-5xl font-semibold flex items-center gap-4 text-center">
             Welcome
             <span role="img" aria-label="registration icon">
               👋
             </span>
           </h1>
           <p className="font-medium text-lg text-gray-500 mt-4">Please enter your details</p>

           <form onSubmit={(e) => { e.preventDefault(); handleRegistration(); }} className="mt-8 space-y-6">
             <div>
               <label htmlFor="fist_name" className="text-lg font-medium">First Name</label>
               <input
                 id="fist_name"
                 name="fist_name"
                 type="fist_name"
                 className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                 placeholder="Enter your First Name"
                 value={first_name}
                 onChange={(e) => setFirst_name(e.target.value)}
                 required
                 autoComplete="fist_name"
               />
            </div>
            <div>
               <label htmlFor="last_name" className="text-lg font-medium">Last Name</label>
               <input
                 id="last_name"
                 name="last_name"
                 type="last_name"
                 className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                 placeholder="Enter your Last Name"
                 value={last_name}
                 onChange={(e) => setLast_name(e.target.value)}
                 required
                 autoComplete="last_name"
               />
            </div>
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
            <div className="mb-4">
              <label htmlFor="gender" className="block text-lg font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full p-4 mt-1 border-2 border-gray-300 rounded-xl shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                autoComplete="gender"
              >
                <option value="" disabled hidden>Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
               <label htmlFor="job" className="text-lg font-medium">Job</label>
               <input
                 id="job"
                 name="job"
                 type="job"
                 className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                 placeholder="Enter your Job"
                 value={job}
                 onChange={(e) => setJob(e.target.value)}
                 required
                 autoComplete="job"
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
                Sign up with Google
              </button>
            </div>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

            <div className="mt-6 text-center">
              <p className="text-base font-medium">
                Allready have an account?{" "}
                <button className="text-violet-500 hover:underline" type="button" onClick={() => navigate('/login')}>Sign in</button>
              </p>
            </div>
          </form>
        </div>
      </div>

       <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100 relative">
         <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
         <div className="absolute bottom-0 w-full h-1/2 bg-white/10 backdrop-blur-lg" />
       </div>
     </div>
  );
};

export default Register;
