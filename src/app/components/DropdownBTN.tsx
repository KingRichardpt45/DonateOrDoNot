// components/Dropdown.js
import React, { useState } from 'react';
import styles from './components.module.css'; // Import the correct CSS module

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={styles.dropdown}>
      <button className={styles.dropdownbutton} onClick={toggleDropdown}>
        Select Item
      </button>
      {isOpen && (
        <ul className={styles.dropdownlist}>
          <li className={styles.dropdownitem}>Item 1</li>
          <li className={styles.dropdownitem}>Item 2</li>
          <li className={styles.dropdownitem}>Item 3</li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
