// import './css/App.css'
// import GeneratorUI from "./components/generatorUI";

// function App() {
//   return <GeneratorUI />;
// }

// export default App;
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import About from "./pages/About";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/home";

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
