'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import { Heart } from 'lucide-react';
import './ResourcePage.css';
import { categoryMeta } from '../utils/categoryMeta';

export default function ResourcePage() {
  const allCategories = new Set(Object.keys(categoryMeta));
  const [selectedCategories, setSelectedCategories] = useState(allCategories);

  const resources = [
    {
      icon: <Heart size={20} />,
      category: 'Healthcare',
      title: 'Boston Health Center',
      email: 'contact@bostonhealth.org',
      contact: '(617) 555-1234',
      website: 'https://bostonhealth.org',
      lat: 42.3601,
      lng: -71.0589,
    },
    {
      icon: <Heart size={20} />,
      category: 'Pet Care',
      title: 'Cambridge Medical Hub',
      email: 'info@cambridgemed.org',
      contact: '(617) 555-6789',
      website: 'https://cambridgemed.org',
      lat: 42.3736,
      lng: -71.1097,
    },
    {
      icon: <Heart size={20} />,
      category: 'Healthcare',
      title: 'Somerville Clinic',
      email: 'contact@somervilleclinic.org',
      contact: '(617) 555-0001',
      website: 'https://somervilleclinic.org',
      lat: 42.3876,
      lng: -71.0995,
    },
    {
      icon: <Heart size={20} />,
      category: 'Healthcare',
      title: 'Medford Health Center',
      email: 'info@medfordhealth.org',
      contact: '(617) 555-7890',
      website: 'https://medfordhealth.org',
      lat: 42.4184,
      lng: -71.1062,
    },
    {
      icon: <Heart size={20} />,
      category: 'Healthcare',
      title: 'Newton Medical Facility',
      email: 'contact@newtonmed.org',
      contact: '(617) 555-2345',
      website: 'https://newtonmed.org',
      lat: 42.337,
      lng: -71.2092,
    },
  ];

  const filteredResources = resources.filter((r) => selectedCategories.has(r.category));

  return (
    <>
      <Navbar />
      <div className="resource-main-container">
        <Sidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        <div className="resource-card-container">
          <div className="resource-card-stack">
            {filteredResources.map((resource, i) => (
              <ResourceCard
                key={i}
                icon={resource.icon}
                category={resource.category}
                title={resource.title}
                email={resource.email}
                contact={resource.contact}
                website={resource.website}
                lat={resource.lat}
                lng={resource.lng}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
