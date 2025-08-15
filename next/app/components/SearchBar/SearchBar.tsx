'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchLocations, Location } from '../../utils/strapi.api';
import { FaHourglassHalf } from 'react-icons/fa';
import './SearchBar.css';

interface SearchBarProps {
  onSearchResults: (results: Location[]) => void;
  onSearchStateChange: (isSearching: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults, onSearchStateChange }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [lastSearchQuery, setLastSearchQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (searchQuery: string) => {
    // Clear results if query is empty
    if (searchQuery.trim().length === 0) {
      onSearchResults([]);
      onSearchStateChange(false);
      setIsLoading(false);
      // setLastSearchQuery('');
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

      const results = await searchLocations(searchQuery);
      onSearchResults(results);
      onSearchStateChange(true);
    } catch (error) {
      console.error('❌ Search error:', error);
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
      // setLastSearchQuery('');
      return;
    }

    // Set loading state immediately for visual feedback
    if (newQuery.trim().length >= 2) {
      setIsLoading(true);
    }

    // Debounce the actual search call by 400ms (slightly longer for API calls)
    timeoutRef.current = setTimeout(() => {
      handleSearch(newQuery);
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    onSearchResults([]);
    onSearchStateChange(false);
    setIsLoading(false);
    // setLastSearchQuery('');

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

  // Generate search hint text
  // const getSearchHint = () => {
  //   if (query.length === 0) {
  //     return "Try searching for 'rent', 'food', 'housing', 'kids'...";
  //   }
  //   if (query.length === 1) {
  //     return 'Keep typing for semantic search...';
  //   }
  //   if (isLoading) {
  //     return 'Searching with AI embeddings...';
  //   }
  //   if (lastSearchQuery) {
  //     return `Found semantic matches for "${lastSearchQuery}"`;
  //   }
  //   return '';
  // };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Explore resources..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        {query && (
          <button onClick={handleClear} className="search-clear-btn" aria-label="Clear search">
            ✕
          </button>
        )}
        {isLoading && (
          <div className="search-loading" aria-label="Searching">
            <FaHourglassHalf className="timepiece-icon" />
          </div>
        )}
      </div>

      {/* Search hint/status */}
      {/* <div className="search-hint">{getSearchHint()}</div> */}
    </div>
  );
};

export default SearchBar;
