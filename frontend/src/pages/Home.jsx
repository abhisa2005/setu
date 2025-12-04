import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

// tiny helper to fix default icon (Leaflet + Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function HeatLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points?.length) return;
    const heatPoints = points
      .filter(p => p.location && p.location.coordinates)
      .map(p => [p.location.coordinates[1], p.location.coordinates[0], 0.5]);

    // Access heat plugin safely without TypeScript assertions
    const heatFunc = L.heatLayer || L['heatLayer'];
    const heat = heatFunc ? heatFunc(heatPoints, { radius: 25 }) : null;
    if (heat) map.addLayer(heat);
    return () => { if (heat) map.removeLayer(heat); };
  }, [map, points]);
  return null;
}

export default function Home(){
  const [cases, setCases] = useState([]);
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/cases`)
      .then(res => setCases(res.data))
      .catch(err => console.error(err));
  }, []);
  const center = [20.5937, 78.9629];
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reported cases (heatmap)</h2>
      <div style={{ height: '70vh' }} className="rounded overflow-hidden shadow">
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <HeatLayer points={cases} />
          {cases.map(c => (
            <Marker key={c._id} position={[c.location.coordinates[1], c.location.coordinates[0]]}>
              <Popup>
                <b>{c.disease}</b><br/>
                {c.symptoms?.slice(0,3).join(', ')}<br/>
                {new Date(c.reportedAt).toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
