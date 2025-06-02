'use client';

import React from 'react';
import './ResourceCard.css';
import { MapPin, Mail, Phone, Shapes, ExternalLink } from 'lucide-react';

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

const truncate = (str: string, max = 30) => (str.length > max ? str.slice(0, max) + '...' : str);

const ResourceCard: React.FC<ResourceCardProps> = ({
  icon = <Shapes size={20} />,
  category,
  title,
  email,
  contact,
  website,
  lat,
  lng,
}) => {
  const mapsLink = lat != null && lng != null ? `https://www.google.com/maps?q=${lat},${lng}` : null;

  return (
    <div className="resource-card">
      <div className="slider">
        {/* First card: only category and big title */}
        <div className="slide-out">
          <div className="card-header">
            <div className="icon-wrapper">{icon}</div>
            <div className="category-tag">{category}</div>
          </div>
          <h2 className="resource-title-large">{title}</h2> {/* Bigger title */}
        </div>

        {/* Second card: smaller title + contact info, website, maps */}
        <div className="slide-in">
          <h4 className="resource-title-small">{title}</h4> {/* Smaller title */}
          <div className="resource-info info-hover">
            {email && (
              <div className="info-row">
                <Mail size={14} className="info-icon" />
                <span>{email}</span>
              </div>
            )}
            {contact && (
              <div className="info-row">
                <Phone size={14} className="info-icon" />
                <span>{contact}</span>
              </div>
            )}
            {website && (
              <div className="info-row">
                <ExternalLink size={14} className="info-icon" />
                <a href={website} target="_blank" rel="noopener noreferrer" className="website-link" title={website}>
                  {truncate(website, 40)}
                </a>
              </div>
            )}
            {mapsLink && (
              <div className="info-row">
                <MapPin size={14} className="info-icon" />
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="maps-link"
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
