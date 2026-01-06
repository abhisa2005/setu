import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Dashboard() {

  const [myReports, setMyReports] = useState([]);
  const [nearbyCases, setNearbyCases] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.warn("No token found, redirecting to login");
      window.location.href = "/login";
      return;
    }

    fetchMyReports();
    fetchNearbyCases();
  }, [token]);

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/cases/my-reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyReports(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your reports");
    }
  };

  const fetchNearbyCases = async () => {
    try {
      // TEMP coords (Delhi) — later replace with browser geolocation
      const lat = 28.61;
      const lon = 77.20;

      const res = await axios.get(`${API_BASE}/api/cases`, {
        params: { lat, lon, radiusKm: 10 }
      });

      setNearbyCases((res.data || []).filter(c => c.approved));
    } catch (err) {
      console.error(err);
      setError("Failed to load nearby cases");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>My Reports</h2>
      {myReports.length === 0 && <p>No reports yet.</p>}
      {myReports.map(r => (
        <ReportCard key={r._id} report={r} />
      ))}

      <h2>Nearby Approved Cases</h2>
      {nearbyCases.length === 0 && <p>No nearby cases.</p>}
      {nearbyCases.map(c => (
        <ReportCard key={c._id} report={c} />
      ))}
    </div>
  );
}

function ReportCard({ report }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px"
      }}
    >
      <h3>{report.disease}</h3>
      <p><b>Severity:</b> {report.severity}</p>

      {report.symptoms?.length > 0 && (
        <>
          <b>Symptoms:</b>
          <ul>{report.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {report.likelyCauses?.length > 0 && (
        <>
          <b>Likely Causes:</b>
          <ul>{report.likelyCauses.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </>
      )}

      {report.prevention?.length > 0 && (
        <>
          <b>Prevention:</b>
          <ul>{report.prevention.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </>
      )}

      {report.precautions?.length > 0 && (
        <>
          <b>Precautions:</b>
          <ul>{report.precautions.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </>
      )}

      {report.location && report.location.coordinates && (
        <p>
          📍 {report.location.coordinates[1]}, {report.location.coordinates[0]}
        </p>
      )}

      <p style={{ color: report.approved ? "green" : "orange" }}>
        {report.approved ? "Approved" : "Pending"}
      </p>
    </div>
  );
}
