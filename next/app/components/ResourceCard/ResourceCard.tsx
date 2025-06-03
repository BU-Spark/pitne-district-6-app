'use client';

import React from 'react';
import './ResourceCard.css';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { categoryMeta, groupColors } from '../../utils/categoryMeta';

function lightenColor(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + Math.round(255 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * percent);
  let b = (num & 0x0000ff) + Math.round(255 * percent);
  r = r > 255 ? 255 : r;
  g = g > 255 ? 255 : g;
  b = b > 255 ? 255 : b;
  return `rgb(${r},${g},${b})`;
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
