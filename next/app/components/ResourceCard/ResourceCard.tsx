'use client';

import React from 'react';
import './ResourceCard.css';
import { MapPin, Mail, Phone, Shapes } from 'lucide-react';

interface ResourceCardProps {
  icon?: React.ReactNode;
  category: string;
  title: string;
  location: string;
  email: string;
  contact: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  icon = <Shapes size={20} />,
  category,
  title,
  location,
  email,
  contact,
}) => {
  return (
    <div className="resource-card">
      <div className="slider">
        <div className="slide-out">
          <div className="card-header">
            <div className="icon-wrapper">{icon}</div>
            <div className="category-tag">{category}</div>
          </div>
          <h3 className="resource-title">{title}</h3>
          <div className="resource-info info-default">
            <div className="info-row">
              <MapPin size={14} className="info-icon" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="slide-in">
          <div className="resource-info info-hover">
            <div className="info-row">
              <Mail size={14} className="info-icon" />
              <span>{email}</span>
            </div>
            <div className="info-row">
              <Phone size={14} className="info-icon" />
              <span>{contact}</span>
            </div>
          </div>
        </div>
      </div>
      <button className="view-button">View</button>
    </div>
  );
};

export default ResourceCard;
