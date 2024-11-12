import React from 'react';
import styles from './components.module.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, placeholder = 'Enter description...', rows = 4, ...props }) => {
  return (
    <div className={styles.textAreaContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={styles.textArea}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </div>
  );
};
