import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Disease Tracker</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-sm">Home</Link>
            <Link to="/report" className="text-sm">Report</Link>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/admin" className="text-sm">Admin</Link>
          </nav>
        </header>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/report" element={<Report/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin" element={<Admin/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
