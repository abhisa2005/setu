import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Disease Tracker</h1>

          <nav className="app-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/report" className="nav-link">Report</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
