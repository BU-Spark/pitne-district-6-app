'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Papa from 'papaparse'; // for CSV parsing
import wellknown from 'wellknown';
import L from 'leaflet';

const redPinIcon = L.icon({
  iconUrl: '/icons/markericon.svg',
  iconSize: [34, 34],
  iconAnchor: [12, 24],
  popupAnchor: [5, -24],
});

const MapPage: React.FC = () => {
  const [district6Coords, setDistrict6Coords] = useState<[number, number][]>([]);
  useEffect(() => {
    fetch('/district6Coords.csv')
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const firstRow = results.data[0] as { WKT: string };
            if (firstRow?.WKT) {
              const parsed = wellknown.parse(firstRow.WKT) as { coordinates: number[][][] } | null;
              if (parsed && parsed.coordinates) {
                const coords = parsed.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number]);
                setDistrict6Coords(coords);
              }
            }
          },
        });
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="map-container">
          <MapContainer
            center={[42.3061, -71.1204]}
            zoom={13}
            zoomControl={true}
            className="leaflet-map"
            style={{ height: '100%', width: '100%' }}
            maxBounds={[
              [42.23, -71.24],
              [42.37, -71.03],
            ]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            />

            {/* TEMPORARY DUMMY POINTS FOR DEMO PURPOSES */}
            <Marker position={[42.313, -71.115]} icon={redPinIcon}>
              <Popup>Dummy Point 1</Popup>
            </Marker>
            <Marker position={[42.299, -71.134]} icon={redPinIcon}>
              <Popup>Dummy Point 2</Popup>
            </Marker>
            <Marker position={[42.321, -71.097]} icon={redPinIcon}>
              <Popup>Dummy Point 3</Popup>
            </Marker>
            {/* END OF TEMPORARY DUMMY POINTS */}

            {/* <ZoomControl position="topright" /> */}

            <Polygon
              positions={district6Coords}
              pathOptions={{
                color: '#1871bd',
                weight: 1,
                fillColor: '#1871bd',
                fillOpacity: 0.2,
              }}
            />
          </MapContainer>
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default MapPage;
