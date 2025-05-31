'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Papa from 'papaparse';
import wellknown from 'wellknown';
import L from 'leaflet';
import { getColorForCategory } from '../utils/categoryMeta';

export default function MapPage() {
  interface LocationData {
    id: number;
    name: string;
    lat: number;
    lng: number;
    category?: string;
    phone?: string;
    website?: string;
  }

  const [district6Coords, setDistrict6Coords] = useState<[number, number][]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);

  const iconCache: { [color: string]: L.Icon } = {};

  const getColoredIcon = (color: string): L.Icon => {
    if (iconCache[color]) return iconCache[color];

    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="${color}">
        <circle cx="12" cy="12" r="10" />
      </svg>
    `);

    const icon = L.icon({
      iconUrl: `data:image/svg+xml,${svg}`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });

    iconCache[color] = icon;
    return icon;
  };

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

  useEffect(() => {
    fetch('http://localhost:1337/api/locations?pagination[page]=1&pagination[pageSize]=1000')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          console.log(`Fetched ${data.data.length} locations from Strapi:`, data.data);
          setLocations(data.data as LocationData[]);
        } else {
          console.warn('No location data found in API response.');
        }
      })
      .catch((err) => console.error('Error loading locations:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-container">
        <div className="map-container">
          <MapContainer
            center={[42.3061, -71.1204]}
            zoom={16}
            zoomControl={true}
            className="leaflet-map"
            style={{ height: '100%', width: '100%' }}
            maxBounds={[
              [42.23, -71.2],
              [42.45, -70.97],
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

            {locations
              .filter((location) => location.lat !== null && location.lng !== null)
              .map((location) => {
                const { lat, lng, name, category, phone, website } = location;
                const color = getColorForCategory(category);
                const icon = getColoredIcon(color);

                return (
                  <Marker key={location.id} position={[lat, lng]} icon={icon}>
                    <Popup>
                      <div>
                        <strong>{name}</strong>
                        {category && (
                          <div>
                            <b>Category:</b> {category}
                          </div>
                        )}
                        {phone && <div>📞 {phone}</div>}
                        {website && (
                          <div>
                            🌐{' '}
                            <a href={website} target="_blank" rel="noopener noreferrer">
                              {website}
                            </a>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            <Polygon
              positions={district6Coords}
              pathOptions={{
                color: '#1871bd',
                weight: 2,
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
}
