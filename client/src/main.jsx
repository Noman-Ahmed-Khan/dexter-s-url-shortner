import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./css/index.css"; 
import { AuthProvider } from "./contexts/authcontext"

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode> 
);
