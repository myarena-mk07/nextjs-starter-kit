import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.textContainer}>
        <h2 className={styles.largeText}>SHOTBEAUTIFIER</h2>
      </div>
      <p className={styles.copyrightText}>@Copyright reserved by <a 
                href="https://mitvaghani.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Mit Vaghani
              </a></p>
    </footer>
  );
};

export default Footer;