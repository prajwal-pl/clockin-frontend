"use client";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix default icon issue when using Leaflet with bundlers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export type LatLng = { lat: number; lng: number };

export function LocationPicker({ onPick }: { onPick: (pos: LatLng) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center, zoom }: { center: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    // Ensure map view follows the provided center
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

export default function LeafletClientMap({
  center = { lat: 51.505, lng: -0.09 },
  zoom = 13,
  polygon,
  marker,
  onPick,
  circleRadius,
}: {
  center?: LatLng;
  zoom?: number;
  polygon?: LatLng[];
  marker?: LatLng | null;
  onPick?: (pos: LatLng) => void;
  circleRadius?: number;
}) {
  // Ensure Leaflet CSS is applied once mounted
  useEffect(() => {}, []);

  return (
    <div
      style={{ height: 400, width: "100%" }}
      className="rounded-md overflow-hidden"
    >
      {/* center casted to avoid TS friction with LatLngExpression types across versions */}
      <MapContainer
        center={{ lat: center.lat, lng: center.lng } as L.LatLngExpression}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <Recenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polygon && polygon.length > 0 && (
          <Polygon
            pathOptions={{ color: "#3b82f6", weight: 3, fillOpacity: 0.15 }}
            positions={polygon.map((p) => [p.lat, p.lng] as [number, number])}
          />
        )}
        {circleRadius && circleRadius > 0 && (
          <Circle
            center={[center.lat, center.lng]}
            radius={circleRadius}
            pathOptions={{ color: "#22c55e", weight: 2, fillOpacity: 0.1 }}
          />
        )}
        {marker && <Marker position={[marker.lat, marker.lng]} />}
        {onPick && <LocationPicker onPick={onPick} />}
      </MapContainer>
    </div>
  );
}
