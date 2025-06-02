'use client';

import './Sidebar.css';
import Image from 'next/image';
import FilterTag from '../FilterTag/FilterTag';
import React from 'react';
import { categoryMeta, groupColors, groupNames } from '../../utils/categoryMeta';

interface SidebarProps {
  selectedCategories: Set<string>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const hardcodedCategories = Object.keys(categoryMeta).map((name) => ({
  name,
}));

const Sidebar: React.FC<SidebarProps> = ({ selectedCategories, setSelectedCategories }) => {
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
      <div className="sidebar-header">
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
