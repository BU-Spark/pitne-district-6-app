'use client';

import './Sidebar.css';
import FilterTag from '../FilterTag/FilterTag';
import React, { useState, useEffect } from 'react';
import { CheckSquare, SquareX } from 'lucide-react';

// Fetch categories from Strapi
const fetchCategories = async () => {
  const res = await fetch('http://localhost:1337/resources/categories-with-count');
  console.log(res);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return await res.json();
};

const Sidebar: React.FC = () => {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data: { name: string; count: number }[]) => {
        // Sort alphabetically by name
        setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load categories');
        setLoading(false);
      });
  }, []);

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

      {loading && <div>Loading categories...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

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
