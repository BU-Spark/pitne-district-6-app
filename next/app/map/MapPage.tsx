'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import Navbar from '../components/Navbar/Navbar'; // Adjust this import path to where your Navbar is

const MapPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="map-container">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className="leaflet-map"
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[51.505, -0.09]}>
              <Popup>Sample marker popup.</Popup>
            </Marker>
          </MapContainer>
        </div>

        <aside className="sidebar">
          <h2>Filters</h2>
          <label>
            Search:
            <input type="text" placeholder="Search here..." />
          </label>

          <label>
            Category:
            <select>
              <option value="">All</option>
              <option value="parks">Parks</option>
              <option value="museums">Museums</option>
            </select>
          </label>

          <button>Apply Filters</button>
        </aside>
      </div>
    </>
  );
};

export default MapPage;
