'use client';

import './Sidebar.css';
import FilterTag from '../FilterTag/FilterTag';
import React, { useState } from 'react';
import { CheckSquare, SquareX } from 'lucide-react';

// These are hardcoded categories and counts (for demonstration purposes)
// Need to fetch this data from Strapi database!
const rawCategories = [
  { name: 'Parks and Green Space', count: 34 },
  { name: 'Youth Community Organizations', count: 21 },
  { name: 'Neighborhood Associations', count: 18 },
  { name: 'BHA and Senior Housing', count: 15 },
  { name: 'Boston Public Schools', count: 15 },
  { name: 'Food Community Organizations', count: 9 },
  { name: 'Small Business Community Organization', count: 7 },
  { name: 'Healthcare', count: 7 },
  { name: 'BCYF Centers', count: 7 },
  { name: 'Arts, Culture, History Community Organizations', count: 7 },
  { name: 'Housing Community Organizations', count: 6 },
  { name: 'Boston Public Libraries', count: 6 },
  { name: 'Police and Fire', count: 5 },
  { name: 'Bike Community Organizations', count: 4 },
  { name: 'Climate, Environment, Parks Community Organizations', count: 4 },
  { name: 'Justice, Community Organizing, Basic Needs', count: 4 },
  { name: 'Child Care Organizations', count: 3 },
  { name: 'Progressive Organizing', count: 2 },
  { name: 'Senior Community Organizations', count: 2 },
  { name: 'Education Community Organizations', count: 1 },
  { name: 'Pet Care', count: 1 },
];

// Sort alphabetically by name
const categories = rawCategories.sort((a, b) => a.name.localeCompare(b.name));

const Sidebar: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

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
    setSelectedCategories(new Set(categories.map((c) => c.name)));
  };

  const deselectAll = () => {
    setSelectedCategories(new Set());
  };

  return (
    <aside className="sidebar">
      <h2>FILTER</h2>

      <div className="sidebar-actions">
        <button type="button" className="sidebar-btn" onClick={selectAll}>
          <CheckSquare size={16} style={{ marginRight: '4px' }} />
          Select All
        </button>
        <button type="button" className="sidebar-btn" onClick={deselectAll}>
          <SquareX size={16} style={{ marginRight: '4px' }} />
          Deselect All
        </button>
      </div>

      {/* <form>
        {categories.map((category, idx) => (
          <label key={idx} className="sidebar-category">
            <input
              type="checkbox"
              checked={selectedCategories.has(category.name)}
              onChange={() => toggleCategory(category.name)}
            />
            <span>
              {category.name} ({category.count})
            </span>
          </label>
        ))}
      </form> */}

      <div className="filter-tag-list">
        {categories.map((category) => (
          <FilterTag
            key={category.name}
            label={category.name}
            count={category.count}
            selected={selectedCategories.has(category.name)}
            onToggle={() => toggleCategory(category.name)}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
