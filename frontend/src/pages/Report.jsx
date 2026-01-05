import React, { useState } from "react";
import axios from "axios";
import "./Report.css";

const commonSymptoms = [
  "Abdominal pain",
  "Chest pain",
  "Confusion",
  "Diarrhea",
  "Dizziness",
  "Headache",
  "Leg pain",
  "Skin rash",
];

export default function Report() {
  const [disease, setDisease] = useState("dengue");
  const [symptoms, setSymptoms] = useState([]);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [message, setMessage] = useState("");

  const addSymptom = s => {
    if (!symptoms.includes(s)) setSymptoms([...symptoms, s]);
  };

  const removeSymptom = s => {
    setSymptoms(symptoms.filter(x => x !== s));
  };

  const useGeo = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
    });
  };

  const submit = async e => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/cases`,
        {
          disease,
          symptoms,
          severity: "moderate",
          observedAt: new Date(),
          location: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
        }
      );
      setMessage("Report submitted successfully");
    } catch (err) {
      setMessage("Error submitting report");
    }
  };

  return (
    <div className="report">
      <h2>Add your symptoms</h2>
      <p className="subtitle">
        Please select symptoms and submit the report
      </p>

      <div className="report-card">
        {/* LEFT */}
        <div className="left">
          {/* Selected symptoms */}
          <div className="selected">
            {symptoms.map(s => (
              <span key={s} onClick={() => removeSymptom(s)}>
                {s} ✕
              </span>
            ))}
          </div>

          <p className="label">Common symptoms</p>
          <div className="chips">
            {commonSymptoms.map(s => (
              <button key={s} onClick={() => addSymptom(s)}>
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <label>
              Disease
              <select value={disease} onChange={e => setDisease(e.target.value)}>
                <option value="dengue">Dengue</option>
                <option value="malaria">Malaria</option>
                <option value="covid">Covid</option>
              </select>
            </label>

            <div className="row">
              <input
                placeholder="Latitude"
                value={lat}
                onChange={e => setLat(e.target.value)}
              />
              <input
                placeholder="Longitude"
                value={lon}
                onChange={e => setLon(e.target.value)}
              />
            </div>

            <div className="actions">
              <button type="button" className="outline" onClick={useGeo}>
                Use my location
              </button>
              <button type="submit" className="primary">
                Submit
              </button>
            </div>
          </form>

          {message && <p className="msg">{message}</p>}
        </div>


        <div className="right">
          <img src="/body.png" alt="body model" />
          <p className="rotate">Rotate model</p>
        </div>
      </div>
    </div>
  );
}
