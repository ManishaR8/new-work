import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import VehicleMarker from "./VehicleMarker";
import routeData from "../../public/dummy-route.json";
import "../App.css";

export default function MapView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    if (currentIdx >= routeData.length - 1) {
      setPlaying(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIdx(idx => {
        if (idx < routeData.length - 1) {
          return idx + 1;
        } else {
          setPlaying(false);
          return idx;
        }
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [playing, currentIdx]);

  const handleStart = () => {
    if (currentIdx < routeData.length - 1) setPlaying(true);
  };
  const handlePause = () => setPlaying(false);
  const handleReset = () => {
    setPlaying(false);
    setCurrentIdx(0);
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        className="leaflet-map"
        center={[routeData[0].lat, routeData[0].lng]}
        zoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={routeData.map(p => [p.lat, p.lng])} color="red" />
        <VehicleMarker data={routeData[currentIdx]} />
      </MapContainer>
      <div className="map-controls">
        <button onClick={handleStart} disabled={playing || currentIdx >= routeData.length - 1} className="btn btn-start">Start</button>
        <button onClick={handlePause} disabled={!playing} className="btn btn-pause">Pause</button>
        <button onClick={handleReset} className="btn btn-reset">Reset</button>
      </div>
    </div>
  );
} 