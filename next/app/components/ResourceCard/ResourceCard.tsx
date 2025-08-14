'use client';

import React, { useState } from 'react';
import './ResourceCard.css';
import { MapPin, Mail, Phone, ExternalLink, ChevronDownCircle, X as CloseIcon } from 'lucide-react';
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
  description?: string | null;
  email: string | null;
  contact: string | null;
  website: string | null;
  lat?: number | null;
  lng?: number | null;
}

function resolveCssColor(value: string): string {
  if (value.startsWith('var(')) {
    const varName = value.match(/var\((--[^)]+)\)/)?.[1];
    if (varName) {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    }
  }
  return value;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  icon,
  category,
  title,
  description,
  email,
  contact,
  website,
  lat,
  lng,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(false); // <--- added state for mobile "active" class

  const mapsLink = lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : null;
  const meta = categoryMeta[category] || { group: 'community' };
  const rawColor = groupColors[meta.group] || '#091F2F';
  const groupColor = resolveCssColor(rawColor);
  const lighterColor = lightenColor(groupColor, 0.75);

  return (
    <div
      className="resource-card"
      onClick={() => setIsActive(!isActive)} // <--- toggle on tap
    >
      <div className={`slider ${isActive ? 'active' : ''}`}>
        {/* first card */}
        <div className="slide-out">
          <div className="card-header">
            <div className="category-pill" style={{ background: groupColor }}>
              {icon && <div className="category-icon">{icon}</div>}
              <span className="category-text">{category}</span>
            </div>
          </div>

          <div className="card-content">
            <h2 className="resource-title">{title}</h2>
          </div>
        </div>

        {/* second card */}
        <div
          className="slide-in"
          style={{ background: lighterColor }}
          onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
        >
          <div className="contact-header">
            <div className="contact-title-row">
              <h3 className="contact-title">{title}</h3>
            </div>
          </div>

          <div className="contact-info">
            {/* description as first row */}
            {description && (
              <div
                className="contact-row clickable"
                onClick={() => setShowModal(true)}
                title="Click to view full description"
              >
                <ChevronDownCircle size={16} className="contact-icon" />
                <span className="contact-text">{description}</span>
              </div>
            )}

            {website && (
              <div className="contact-row">
                <ExternalLink size={16} className="contact-icon" />
                <a href={website} target="_blank" rel="noopener noreferrer" className="contact-link">
                  Visit Website
                </a>
              </div>
            )}

            {mapsLink && (
              <div className="contact-row">
                <MapPin size={16} className="contact-icon" />
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="contact-link">
                  View Directions
                </a>
              </div>
            )}
            {email && (
              <div className="contact-row">
                <Mail size={16} className="contact-icon" />
                <a className="contact-text" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            )}

            {contact && (
              <div className="contact-row">
                <Phone size={16} className="contact-icon" />
                <span className="contact-text">{contact}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* project description modal */}
      {showModal && (
        <div className="description-popup-overlay" onClick={() => setShowModal(false)}>
          <div className="description-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3 className="popup-title">{title}</h3>
              <button className="close-button" onClick={() => setShowModal(false)} title="Close">
                <CloseIcon size={20} />
              </button>
            </div>

            <p className="popup-description">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
