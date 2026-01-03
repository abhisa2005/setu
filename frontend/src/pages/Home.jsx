import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import "./home.css";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).href,
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).href,
});


function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points?.length) return;

    const heatPoints = points
      .filter(p => p.location?.coordinates)
      .map(p => [
        p.location.coordinates[1],
        p.location.coordinates[0],
        0.6,
      ]);

    const heat = L.heatLayer(heatPoints, { radius: 30, blur: 20 });
    map.addLayer(heat);

    return () => map.removeLayer(heat);
  }, [map, points]);

  return null;
}

export default function Home() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/cases`
      )
      .then(res => setCases(res.data))
      .catch(err => console.error(err));
  }, []);

  const dengueCount = cases.filter(
    c => c.disease?.toLowerCase() === "dengue"
  ).length;

  const malariaCount = cases.filter(
    c => c.disease?.toLowerCase() === "malaria"
  ).length;

  return (
    <>

      <section className="hero">
        <div className="hero-inner">
          <span className="badge">Health Analytics Platform</span>
          <h1>
            Track & Visualize <br />
            <span>Disease Spread</span>
          </h1>
          <p>
            Real-time disease monitoring with intelligent heatmaps and
            data-driven insights for better public health decisions.
          </p>
        </div>
      </section>


      <section className="stats">
        <div className="stat">
          <h3>Dengue</h3>
          <div className="number">{dengueCount}</div>
          <span>Active cases</span>
        </div>

        <div className="stat">
          <h3>Malaria</h3>
          <div className="number">{malariaCount}</div>
          <span>Active cases</span>
        </div>
      </section>


<section className="precautions-section">
  <div className="precautions-header">
    <h2>Disease Precautions</h2>
    <p>Basic preventive measures to reduce the risk of common diseases</p>
  </div>

  <div className="precautions-grid">
    <div className="precaution-card dengue">
      <h3>Dengue</h3>
      <p>Prevent mosquito breeding and use repellents to avoid bites.</p>
    </div>

    <div className="precaution-card malaria">
      <h3>Malaria</h3>
      <p>Sleep under mosquito nets and eliminate stagnant water.</p>
    </div>

    <div className="precaution-card typhoid">
      <h3>Typhoid</h3>
      <p>Drink clean water and maintain proper food hygiene.</p>
    </div>

    <div className="precaution-card covid">
      <h3>COVID-19</h3>
      <p>Wear masks in crowded areas and practice regular hand hygiene.</p>
    </div>
  </div>
</section>

      <section className="map-section">
        <div className="map-header">
          <h2>Live Disease Spread Map</h2>
          <p>
            Visualize reported cases across regions with heatmap-based intensity
            analysis.
          </p>
        </div>

        <div className="map-wrapper">
          <MapContainer center={[20.5937, 78.9629]} zoom={5}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <HeatLayer points={cases} />

            {cases.map(c => (
              <Marker
                key={c._id}
                position={[
                  c.location.coordinates[1],
                  c.location.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{c.disease}</strong>
                  <br />
                  {new Date(c.reportedAt).toLocaleString()}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </>
  );
}
