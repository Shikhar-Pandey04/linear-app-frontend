import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages Import
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Overview from './pages/Overview';     // Dashboard (Stats) ke liye
import MyTasks from './pages/MyTasks';       // My Tasks (Kanban) ke liye
import Schedule from './pages/Schedule';     // Schedule (Coming Soon) ke liye
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';

// Sidebar ko har protected page par dikhane ke liye Layout (Optional but recommended)
// Agar tere pages ke andar pehle se Sidebar hai, toh iski zaroorat nahi padegi.

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="bg-[#0b0e11] min-h-screen selection:bg-indigo-500/30">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- Protected Routes (Login ke baad) --- */}
          
          {/* 1. Dashboard / Overview (Sirf Stats dikhayega) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } 
          />

          {/* 2. My Tasks (Sirf Kanban Board dikhayega) */}
          <Route 
            path="/my-tasks" 
            element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            } 
          />

          {/* 3. Schedule (Coming Soon dikhayega) */}
          <Route 
            path="/schedule" 
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            } 
          />

          {/* 4. Support Page */}
          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } 
          />

          {/* 5. Settings Page */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Wildcard Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;