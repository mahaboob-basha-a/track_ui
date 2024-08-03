// src/Map.js
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import carLogo from './assets/car.png'
import 'leaflet/dist/leaflet.css';

// dummy data
const data = [
  { latitude: 17.385434, longitude: 78.486032, timestamp: '2024-08-03T12:00:00Z' },
  { latitude: 17.384501, longitude: 78.487083, timestamp: '2024-08-03T12:01:00Z' },
  { latitude: 17.384834, longitude: 78.486215, timestamp: '2024-08-03T12:02:00Z' },
  { latitude: 17.386142, longitude: 78.488093, timestamp: '2024-08-03T12:03:00Z' },
  { latitude: 17.385294, longitude: 78.486941, timestamp: '2024-08-03T12:04:00Z' },
  { latitude: 17.386089, longitude: 78.487685, timestamp: '2024-08-03T12:05:00Z' },
  { latitude: 17.384712, longitude: 78.485751, timestamp: '2024-08-03T12:06:00Z' },
  { latitude: 17.386243, longitude: 78.485927, timestamp: '2024-08-03T12:07:00Z' },
  { latitude: 17.385019, longitude: 78.487392, timestamp: '2024-08-03T12:08:00Z' },
  { latitude: 17.385782, longitude: 78.488082, timestamp: '2024-08-03T12:09:00Z' }
];

const interpolatePosition = (start, end, t) => {
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t
  ];
};

const Map = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fraction, setFraction] = useState(0);
  const mapRef = useRef(null);

  const latlngs = data.map(point => [point.latitude, point.longitude]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFraction(prevFraction => {
        if (prevFraction >= 1) {
          setCurrentIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % data.length;
            return nextIndex;
          });
          return 0; // Reset fraction for the next segment
        }
        return prevFraction + 0.05; // Adjust this value to control speed
      });
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  const startPoint = latlngs[currentIndex];
  const endPoint = latlngs[(currentIndex + 1) % data.length];
  const currentPosition = interpolatePosition(startPoint, endPoint, fraction);

  return (
    <MapContainer center={latlngs[0]} zoom={20} style={{ height: "500px", width: "100%" }} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={currentPosition}
        icon={L.icon({
          iconUrl: carLogo,
          iconSize: [32, 32]
        })}
      />
      <Polyline positions={latlngs} color="red" />
    </MapContainer>
  );
};

export default Map;
