import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Admin(){
  const [cases, setCases] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/admin/cases`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setCases(r.data)).catch(e => console.error(e));
  }, [token]);

  const approve = async (id) => {
    const tokenLocal = localStorage.getItem("token");
    await axios.put(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/admin/cases/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${tokenLocal}` }
    });
    setCases(prev => prev.filter(c => c._id !== id));
  };

  if (!token) return <div>Please login as admin</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin</h2>
      <div className="grid gap-2">
        {cases.map(c => (
          <div key={c._id} className="bg-white p-3 rounded shadow">
            <div><b>{c.disease}</b> — {c.symptoms?.join(", ")}</div>
            <div className="text-sm">{c.location?.coordinates?.join(", ")}</div>
            <div className="mt-2">
              <button onClick={()=>approve(c._id)} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
