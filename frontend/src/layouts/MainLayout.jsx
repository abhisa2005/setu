import { Link, Outlet } from "react-router-dom";
import "../App.css";

export default function MainLayout() {
  return (
    <div>
      {/* NAVBAR */}
      <header className="app-header">
        <h1 className="app-title">SETU</h1>
        <nav className="app-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/report" className="nav-link">Report</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
          <Link to="/login" className="nav-link">Signup</Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}


