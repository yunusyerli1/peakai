import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepository } from '../../context/RepositoryContext';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useRepository();

  const navigateHome = () => {
    dispatch({ type: 'SET_CURRENT_QUERY', payload: '' });
    dispatch({ type: 'SET_REPOSITORIES', payload: [] });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    dispatch({ type: 'SET_TOTAL_COUNT', payload: 0 });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SELECTED_REPOSITORY', payload: null });
    
    navigate('/');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
        navigateHome();
    }
  };

  return (
    <header className="header" role="banner">
      <nav aria-label="Main navigation">
        <h1>
          <button
            className="logo"
            onClick={navigateHome}
            onKeyDown={handleKeyDown}
            aria-label="Go to home page"
            role="link"
            tabIndex={0}
          >
            PeakAI
          </button>
        </h1>
      </nav>
    </header>
  );
};

export default Header; 