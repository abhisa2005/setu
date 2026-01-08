import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/Chatbot";
import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Disease Tracker</h1>

        <nav className="app-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/report" className="nav-link">Report</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/login" className="nav-link">Signup</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/login" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <p>© 2026 Disease Tracking System</p>
          <p>
            Created by <strong>Disease Tracker Team</strong> ·{" "}
            <a href="mailto:contact@healthtrack.com">
              contact@healthtrack.com
            </a>
          </p>
        </div>
      </footer>

      {/* Chatbot added without touching UI */}
      <Chatbot />
    </div>
  );
}
