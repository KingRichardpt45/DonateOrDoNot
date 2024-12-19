import React from 'react';
import styles from './components.module.css'; // Import CSS module as an object

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const buttonClass = [
    styles.button,                   // Base button style
    styles[`button--${variant}`],     // Variant-specific style (e.g., default or ghost)
    size === 'icon' && styles['button--icon'], // Icon-specific style, if applicable
    className                         // Any additional className passed in
  ]
    .filter(Boolean)                  // Filter out undefined or empty strings
    .join(' ');                       // Join classes into a single string

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
