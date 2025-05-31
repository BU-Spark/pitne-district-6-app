'use client';

import './Sidebar.css';
import Image from 'next/image';
import FilterTag from '../FilterTag/FilterTag';
import React, { useState } from 'react';
import { CheckSquare, SquareX } from 'lucide-react';
import { categoryMeta, groupColors, groupNames } from '../../utils/categoryMeta';

// const fetchCategories = async () => {
//   const res = await fetch('http://localhost:1337/resources/categories-with-count');
//   if (!res.ok) throw new Error('Failed to fetch categories');
//   return await res.json();
// };

const hardcodedCategories = Object.keys(categoryMeta).map((name) => ({
  name,
  // count: 0, // comment out count for now
}));

const Sidebar: React.FC = () => {
  // const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   fetchCategories()
  //     .then((data: { name: string; count: number }[]) => {
  //       setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setError('Failed to load categories');
  //       setLoading(false);
  //     });
  // }, []);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(hardcodedCategories.map((c) => c.name))
  );

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
      {/* 
      {loading && <div>Loading categories...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>} */}

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
    </aside>
  );
};

export default Sidebar;
