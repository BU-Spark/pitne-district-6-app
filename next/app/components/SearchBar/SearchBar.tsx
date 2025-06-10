'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchLocations, Location } from '../../utils/strapi.api';
import './SearchBar.css';

interface SearchBarProps {
  onSearchResults: (results: Location[]) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults, onSearchStateChange }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchQuery: string) => {
    // Clear results if query is empty
    if (searchQuery.trim().length === 0) {
      onSearchResults([]);
      onSearchStateChange(false);
      setIsLoading(false);
      return;
    }

    // Only search if query has at least 2 characters
    if (searchQuery.trim().length < 2) {
      onSearchResults([]);
      onSearchStateChange(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Searching for: "${searchQuery}"`);
      const results = await searchLocations(searchQuery);
      onSearchResults(results);
      onSearchStateChange(true);
    } catch (error) {
      console.error('Search error:', error);
      onSearchResults([]);
      onSearchStateChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If query is empty, clear immediately
    if (newQuery.trim().length === 0) {
      onSearchResults([]);
      onSearchStateChange(false);
      setIsLoading(false);
      return;
    }

    // Set loading state immediately for visual feedback
    if (newQuery.trim().length >= 2) {
      setIsLoading(true);
    }

    // Debounce the actual search call by 300ms
    timeoutRef.current = setTimeout(() => {
      handleSearch(newQuery);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
    onSearchStateChange(false);
    setIsLoading(false);

    // Clear any pending search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search locations..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        {query && (
          <button onClick={handleClear} className="search-clear-btn" aria-label="Clear search">
            ✕
          </button>
        )}
        {isLoading && <div className="search-loading">⏳</div>}
      </div>
    </div>
  );
};

export default SearchBar;
