import React from 'react';
import { useRepository } from '../../context/RepositoryContext';
import './SortOptions.css';

const SortOptions: React.FC = () => {
  const { state, dispatch } = useRepository();
  const { sortBy, sortOrder } = state;

  const handleSortChange = (option: 'stars' | 'forks' | 'updated') => {
    if (sortBy === option) {
      dispatch({ type: 'SET_SORT_ORDER', payload: sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      dispatch({ type: 'SET_SORT_BY', payload: option });
      dispatch({ type: 'SET_SORT_ORDER', payload: 'desc' });
    }
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
  };

  return (
    <div className="sort-options">
      <span className="sort-label">Sort by:</span>
      <button
        className={`sort-button ${sortBy === 'stars' ? 'active' : ''}`}
        onClick={() => handleSortChange('stars')}
      >
        Stars {sortBy === 'stars' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        className={`sort-button ${sortBy === 'forks' ? 'active' : ''}`}
        onClick={() => handleSortChange('forks')}
      >
        Forks {sortBy === 'forks' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button
        className={`sort-button ${sortBy === 'updated' ? 'active' : ''}`}
        onClick={() => handleSortChange('updated')}
      >
        Updated {sortBy === 'updated' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
    </div>
  );
};

export default SortOptions; 