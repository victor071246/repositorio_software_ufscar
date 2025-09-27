'use client';
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import styles from './agenda/loading.module.css';

export default function HomePage() {
  return (
    <div className={styles.loadingContainer}>
      <FaSpinner className={styles.spinner}></FaSpinner>
    </div>
  );
}
