import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "@/components/pages/LoginPage";
import React, { useEffect, useState } from "react";
import Dashboard from "@/components/pages/Dashboard";

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

return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <LoginPage onAuthenticate={handleAuthenticate} />} 
          />
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