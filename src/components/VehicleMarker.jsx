import { useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import L from "leaflet";
import { Popup } from "react-leaflet";

const icon = L.icon({
  iconSize: [45, 45],
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png"
});

export default function VehicleMarker({ data }) {
  const { lat, lng, speed, timestamp } = data || {};
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (lat && lng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(res => setAddress(res.display_name || "Unknown location"))
        .catch(() => setAddress("Address lookup failed"));
    }
  }, [lat, lng]);

  if (!lat || !lng) return null;

  return (
    <LeafletTrackingMarker
      icon={icon}
      position={[lat, lng]}
      duration={1000}
      keepAtCenter={false}
    >
      <Popup>
        <b>Bus</b><br />
        Lat: {lat.toFixed(6)}<br />
        Lng: {lng.toFixed(6)}<br />
        <b>Speed:</b> {speed ? speed.toFixed(2) : "-"} m/s<br />
        <b>Time:</b> {timestamp || "-"}<br />
        <b>Address:</b> {address}
      </Popup>
    </LeafletTrackingMarker>
  );
} 