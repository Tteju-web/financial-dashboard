import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./assets/pages/Dashboard.jsx";
import Profile from "./assets/pages/Profile";
import Reports from "./assets/pages/Reports";
import Transactions from "./assets/pages/Transactions";
import Login from "./assets/pages/Login";
import Analytics from "./assets/pages/Analytics";
import { isLoggedIn, logout } from "./auth/authUtils";


function App() {
  const [authenticated, setAuthenticated] = useState(() => isLoggedIn());

  const handleLogin = () => setAuthenticated(true);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </MainLayout>
  );
}

export default App;