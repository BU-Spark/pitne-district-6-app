'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ResourceCard from '../components/ResourceCard/ResourceCard';
import { fetchLocations, Location } from '../utils/strapi.api';
import './ResourcePage.css';
import { categoryMeta } from '../utils/categoryMeta';

export default function ResourcePage() {
  const allCategories = new Set(Object.keys(categoryMeta));
  const [selectedCategories, setSelectedCategories] = useState(allCategories);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items to show per page

  // Apply category filtering to search results or regular locations
  const getFilteredLocations = (locationsToFilter: Location[]) => {
    if (selectedCategories.size === 0) {
      return [];
    }

    // If all categories are selected, return all locations
    if (selectedCategories.size === allCategories.size) {
      return locationsToFilter;
    }

    // Filter by selected categories
    return locationsToFilter.filter((location) => location.category && selectedCategories.has(location.category));
  };

  // Combine search and category filtering
  const displayLocations = isSearching ? getFilteredLocations(searchResults) : getFilteredLocations(locations);

  // Calculate pagination values
  const totalPages = Math.ceil(displayLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = displayLocations
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when categories change or search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, isSearching, searchResults]);

  // Handle search results from Sidebar
  const handleSearchResults = (results: Location[], searching: boolean) => {
    setSearchResults(results);
    setIsSearching(searching);
    setCurrentPage(1); // Reset to first page when search changes
  };

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

  useEffect(() => {
    if (isSearching) {
      return;
    }
  }, [selectedCategories, isSearching]);

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
          <Sidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onSearchResults={handleSearchResults}
          />
        </div>
        <div className="resource-card-container">
          {/* Search and Filter Status Header */}
          {isSearching && (
            <div className="search-status">
              <h2>
                {searchResults.length} results found, {displayLocations.length} match filters ({selectedCategories.size}{' '}
                filter{selectedCategories.size !== 1 ? 's' : ''} selected)
              </h2>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : (
            <>
              <div className="resource-card-stack">
                {(!isSearching && currentLocations.length > 0) || (isSearching && searchResults.length > 0) ? (
                  currentLocations.map((location) => {
                    const cardProps = transformLocation(location);
                    return (
                      <ResourceCard
                        key={location.documentId || location.id}
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
                    <h3>{isSearching ? 'No search results match your filters' : 'No resources found'}</h3>
                    <p>
                      {isSearching
                        ? 'Try a different search term or adjust your category filters.'
                        : 'Try adjusting your category filters or check back later.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {displayLocations.length > itemsPerPage && (
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-number ${pageNum === currentPage ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
