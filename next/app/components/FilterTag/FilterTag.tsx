// components/FilterTag.tsx
import React from 'react';
import './FilterTag.css';
import { Shapes } from 'lucide-react';

interface FilterTagProps {
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, count, selected, onToggle }) => {
  return (
    <button className={`filter-tag ${selected ? 'selected' : ''}`} onClick={onToggle} type="button">
      <Shapes size={16} className="tag-icon" />
      {label} ({count})
    </button>
  );
};

export default FilterTag;
