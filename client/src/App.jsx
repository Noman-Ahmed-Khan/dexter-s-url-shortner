import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import About from "../src/pages/About";
import Layout from "../src/components/Layout";
import Login from "../src/pages/Login";
import Home from "../src/pages/home";
import Register from "../src/pages/register";
import Profile from "../src/pages/profile";
import Dashboard from "../src/pages/Dashboard";
import ProtectedRoute from "../src/components/ProtectedRoute";

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
