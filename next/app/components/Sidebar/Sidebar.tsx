'use client';

import './Sidebar.css';
import Image from 'next/image';
import FilterTag from '../FilterTag/FilterTag';
import SearchBar from '../SearchBar/SearchBar';
import React from 'react';
import { categoryMeta, groupColors, groupNames } from '../../utils/categoryMeta';
import { Location } from '../../utils/strapi.api';

interface SidebarProps {
  selectedCategories: Set<string>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSearchResults: (results: Location[], isSearching: boolean) => void;
}

const hardcodedCategories = Object.keys(categoryMeta).map((name) => ({
  name,
}));

const Sidebar: React.FC<SidebarProps> = ({ selectedCategories, setSelectedCategories, onSearchResults }) => {
  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedCategories(new Set(hardcodedCategories.map((c) => c.name)));
  };

  const deselectAll = () => {
    setSelectedCategories(new Set());
  };

  const handleSearchResults = (results: Location[]) => {
    onSearchResults(results, results.length > 0);
  };

  const handleSearchStateChange = (searching: boolean) => {
    if (!searching) {
      onSearchResults([], false);
    }
  };

  return (
    <aside className="sidebar">
      {/* Search Section */}
      <div className="sidebar-section">
        <div className="search-header">
          <div className="section-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <h2>SEARCH</h2>
        </div>
        <SearchBar onSearchResults={handleSearchResults} onSearchStateChange={handleSearchStateChange} />
      </div>

      {/* Filter Section */}
      <div className="sidebar-section filter-section">
        <div className="filter-header">
          <div className="section-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
            </svg>
          </div>
          <h2>FILTER</h2>
          <div className="sidebar-links">
            <span className="sidebar-link" onClick={selectAll}>
              Select All
            </span>
            <span className="separator">|</span>
            <span className="sidebar-link" onClick={deselectAll}>
              Deselect All
            </span>
          </div>
        </div>
        <div className="sidebar-scroll-area">
          <div className="filter-tag-list">
            {(() => {
              const renderedGroups = new Set<string>();

              return hardcodedCategories.map((category) => {
                const meta = categoryMeta[category.name];
                const group = meta?.group;
                const bgColor = group ? groupColors[group] : undefined;
                const isSelected = selectedCategories.has(category.name);
                const iconPath = isSelected ? meta.iconPath.replace('/default/', '/selected/') : meta.iconPath;
                const icon = meta ? (
                  <Image src={iconPath} alt={`${category.name} icon`} width={18} height={18} />
                ) : undefined;
                const groupLabel =
                  group && !renderedGroups.has(group) ? (
                    <h3 key={`group-${group}`} className="group-label">
                      {groupNames[group]}
                    </h3>
                  ) : null;

                if (group) renderedGroups.add(group);

                return (
                  <React.Fragment key={category.name}>
                    {groupLabel}
                    <FilterTag
                      label={category.name}
                      selected={selectedCategories.has(category.name)}
                      onToggle={() => toggleCategory(category.name)}
                      icon={icon}
                      color={bgColor}
                    />
                  </React.Fragment>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
