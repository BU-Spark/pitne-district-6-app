import React from 'react';
import './FilterTag.css';

interface FilterTagProps {
  label: string;
  // count: number;
  selected: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  color?: string;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, selected, onToggle, icon, color }) => {
  return (
    <button
      className={`filter-tag ${selected ? 'selected' : ''}`}
      onClick={onToggle}
      type="button"
      style={selected && color ? { backgroundColor: color, color: '#fff', borderColor: color } : undefined}
    >
      <div className="tag-content">
        <span className="tag-icon" style={selected && color ? { color: '#fff' } : undefined}>
          {icon || <DefaultIcon />}
        </span>
        <span className="tag-text">{label}</span>
      </div>
    </button>
  );
};

// Default icon if none provided
const DefaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export default FilterTag;
