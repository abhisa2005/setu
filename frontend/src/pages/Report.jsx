import React, { useState } from "react";
import axios from "axios";

export default function Report(){
  const [disease, setDisease] = useState("dengue");
  const [symptoms, setSymptoms] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [message, setMessage] = useState("");

  const useGeo = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
    }, err => alert("Geo error: "+err.message));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        disease,
        symptoms: symptoms.split(",").map(s=>s.trim()).filter(Boolean),
        severity: "moderate",
        observedAt: new Date(),
        location: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] }
      };
      await axios.post(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/cases`, payload);
      setMessage("Report submitted. It will appear after moderation.");
    } catch (err) {
      setMessage("Error: "+(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Report a case</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
        <label className="block">
          Disease
          <select value={disease} onChange={e=>setDisease(e.target.value)} className="block w-full mt-1">
            <option value="dengue">Dengue</option>
            <option value="malaria">Malaria</option>
          </select>
        </label>
        <label className="block">
          Symptoms (comma-separated)
          <input className="block w-full mt-1 p-2 border" value={symptoms} onChange={e=>setSymptoms(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <input placeholder="latitude" value={lat} onChange={e=>setLat(e.target.value)} className="flex-1 p-2 border" />
          <input placeholder="longitude" value={lon} onChange={e=>setLon(e.target.value)} className="flex-1 p-2 border" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={useGeo} className="px-3 py-1 border rounded">Use my location</button>
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Submit</button>
        </div>
        {message && <div className="mt-2 text-sm">{message}</div>}
      </form>
    </div>
  );
}
