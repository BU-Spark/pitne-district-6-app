'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import { fetchLocations, fetchLocationsByCategories, Location } from '../utils/strapi.api';
import './ResourcePage.css';
import { categoryMeta } from '../utils/categoryMeta';

export default function ResourcePage() {
  const allCategories = new Set(Object.keys(categoryMeta));
  const [selectedCategories, setSelectedCategories] = useState(allCategories);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const locationsData = await fetchLocations();
        console.log('Initial locations loaded:', locationsData.length);
        console.log(
          'Sample location categories:',
          locationsData.slice(0, 3).map((l) => ({ name: l.name, category: l.category }))
        );
        setLocations(locationsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load locations:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Fetch locations when selected categories change
  useEffect(() => {
    const loadFilteredLocations = async () => {
      if (selectedCategories.size === 0) {
        setLocations([]);
        return;
      }

      try {
        setLoading(true);
        const categoriesArray = Array.from(selectedCategories);

        console.log('Selected categories:', categoriesArray);
        console.log('Number of selected categories:', categoriesArray.length);
        console.log('Total available categories:', allCategories.size);

        // If all categories are selected, fetch all locations
        if (selectedCategories.size === allCategories.size) {
          console.log('Fetching all locations (all categories selected)');
          const locationsData = await fetchLocations();
          setLocations(locationsData);
        } else {
          // Otherwise fetch by specific categories
          console.log('Fetching locations by categories:', categoriesArray);
          const locationsData = await fetchLocationsByCategories(categoriesArray);
          console.log('Filtered locations received:', locationsData.length);
          setLocations(locationsData);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load filtered locations:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Only run filtering if we have some categories selected
    // and it's not the initial load (where all categories are selected by default)
    loadFilteredLocations();
  }, [selectedCategories, allCategories.size]);

  // Transform Strapi location to ResourceCard props
  const transformLocation = (location: Location) => {
    // Get icon path from categoryMeta, fallback to default icon
    const categoryInfo = categoryMeta[location.category || ''];
    const iconPath = categoryInfo?.iconPath || '/icons/default/default.svg';

    return {
      icon: <Image src={iconPath} alt={location.category || 'Default'} width={20} height={20} />,
      category: location.category || 'Others',
      title: location.name,
      email: location.email || null,
      contact: location.phone ? location.phone.toString() : null,
      website: location.website || '',
      lat: location.lat || null,
      lng: location.lng || null,
    };
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="resource-main-container">
          <div className="error-container">
            <h2>Error Loading Resources</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="resource-main-container">
        <div className="resource-sidebar">
          <Sidebar selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
        </div>
        <div className="resource-card-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : (
            <div className="resource-card-stack">
              {locations.length > 0 ? (
                locations
                  .slice() // avoid mutating state
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((location) => {
                    const cardProps = transformLocation(location);
                    return (
                      <ResourceCard
                        key={location.id}
                        icon={cardProps.icon}
                        category={cardProps.category}
                        title={cardProps.title}
                        email={cardProps.email}
                        contact={cardProps.contact}
                        website={cardProps.website}
                        lat={cardProps.lat}
                        lng={cardProps.lng}
                      />
                    );
                  })
              ) : (
                <div className="no-resources-container">
                  <h3>No resources found</h3>
                  <p>Try adjusting your category filters or check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
