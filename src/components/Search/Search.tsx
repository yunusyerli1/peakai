import React, { useState, useEffect } from 'react';
import { useRepository } from '../../context/RepositoryContext';
import './Search.css';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const { state, dispatch } = useRepository();
  const { currentQuery } = state;

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch({ type: 'SET_CURRENT_QUERY', payload: query.trim() });
      dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="search-wrapper">
      <form 
        className="search-container" 
        onSubmit={handleSubmit}
        role="search"
        aria-label="GitHub repository search"
      >
        <div className="search-input-wrapper">
          <label htmlFor="search-input" className="visually-hidden">
            Search GitHub repositories
          </label>
          <input
            id="search-input"
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search GitHub repositories..."
            aria-label="Search GitHub repositories"
            aria-required="true"
            aria-describedby="search-description"
          />
          <span id="search-description" className="visually-hidden">
            Enter a search term to find GitHub repositories
          </span>
        </div>
        <button 
          type="submit" 
          className="search-button"
          aria-label="Submit search"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search; 