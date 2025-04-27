import React, { useState } from 'react';
import { useRepository } from '../../context/RepositoryContext';
import './Search.css';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const { dispatch } = useRepository();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch({ type: 'SET_CURRENT_QUERY', payload: query.trim() });
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search GitHub repositories..."
        aria-label="Search"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default Search; 