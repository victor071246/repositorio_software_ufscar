'use client';

import { useState } from 'react';
import styles from './search_bar.module.css';

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        ></input>
        <button type="submit" className={styles.button}>
          Buscar
        </button>
      </form>
    </>
  );
}
