"use client"
import React, { useState } from 'react';
import styles from './components.module.css';
import { Search } from 'lucide-react';

export const ExpandableSearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expansion state on magnifying glass click
  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <div
    className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}
    >
      <span className={styles.searchIcon} onClick={handleExpand}>
      <Search/>
      </span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        onBlur={() => setIsExpanded(false)} // Collapse when input loses focus
        onFocus={() => setIsExpanded(true)} // Keep expanded on focus
      />
    </div>
  );
};
