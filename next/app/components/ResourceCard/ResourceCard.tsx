'use client';

import React from 'react';
import './ResourceCard.css';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { categoryMeta, groupColors } from '../../utils/categoryMeta';

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const p = Math.min(Math.max(percent, 0), 1);

  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;

  const newR = Math.min(255, Math.round(r + (255 - r) * p));
  const newG = Math.min(255, Math.round(g + (255 - g) * p));
  const newB = Math.min(255, Math.round(b + (255 - b) * p));

  return `rgb(${newR}, ${newG}, ${newB})`;
}

interface ResourceCardProps {
  icon?: React.ReactNode;
  category: string;
  title: string;
  email: string | null;
  contact: string | null;
  website: string;
  lat?: number | null;
  lng?: number | null;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ icon, category, title, email, contact, website, lat, lng }) => {
  const mapsLink = lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : null;
  const meta = categoryMeta[category] || { group: 'community' };
  const groupColor = groupColors[meta.group] || '#091F2F';
  const lighterColor = lightenColor(groupColor, 0.7); // 70% lighter

  return (
    <div className="resource-card">
      <div className="slider">
        {/* First card: Initial view with category and title */}
        <div className="slide-out">
          <div className="card-header">
            <div className="category-pill" style={{ background: groupColor, minWidth: 140, maxWidth: 220 }}>
              {icon && <div className="category-icon">{icon}</div>}
              <span className="category-text">{category}</span>
            </div>
          </div>
          <div className="card-content">
            <h2 className="resource-title">{title}</h2>
          </div>
        </div>
        {/* Second card: Contact details on hover */}
        <div className="slide-in" style={{ background: lighterColor }}>
          <div className="contact-header">
            <h3 className="contact-title">{title}</h3>
          </div>
          <div className="contact-info">
            {email && (
              <div className="contact-row">
                <Mail size={16} className="contact-icon" />
                <span className="contact-text">{email}</span>
              </div>
            )}
            {contact && (
              <div className="contact-row">
                <Phone size={16} className="contact-icon" />
                <span className="contact-text">{contact}</span>
              </div>
            )}
            {website && (
              <div className="contact-row">
                <ExternalLink size={16} className="contact-icon" />
                <a href={website} target="_blank" rel="noopener noreferrer" className="contact-link" title={website}>
                  Visit Website
                </a>
              </div>
            )}
            {mapsLink && (
              <div className="contact-row">
                <MapPin size={16} className="contact-icon" />
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  title="Open location in Google Maps"
                >
                  View Directions
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
