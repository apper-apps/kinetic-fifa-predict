import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "@/components/pages/LoginPage";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/pages/Dashboard";
import StatsPage from "@/components/pages/StatsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import Header from "@/components/organisms/Header";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const authStatus = localStorage.getItem('fifa-predict-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    localStorage.setItem('fifa-predict-auth', 'authenticated');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fifa-predict-auth');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onAuthenticate={handleAuthenticate} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;