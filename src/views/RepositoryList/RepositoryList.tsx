import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepository } from '../../context/RepositoryContext';
import { GitHubRepository, GitHubSearchResponse } from '../../types/github';
import { Cache } from '../../utils/cache';
import Pagination from '../../components/Pagination/Pagination';
import SortOptions from '../../components/SortOptions/SortOptions';
import './RepositoryList.css';

const RepositoryList: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useRepository();
  const { repositories, isLoading, error, totalCount, currentPage, currentQuery, sortBy, sortOrder } = state;
  const itemsPerPage = 10;
  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  const navigateHome = () => {
    dispatch({ type: 'SET_CURRENT_QUERY', payload: '' });
    dispatch({ type: 'SET_REPOSITORIES', payload: [] });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    dispatch({ type: 'SET_TOTAL_COUNT', payload: 0 });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SELECTED_REPOSITORY', payload: null });
    
    navigate('/');
  };


  const fetchRepositories = useCallback(async (page: number) => {
    if (!currentQuery) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let url = `https://api.github.com/search/repositories?q=${encodeURIComponent(currentQuery)}&per_page=${itemsPerPage}&page=${page}`;
      
      if (sortBy) {
        url += `&sort=${sortBy}&order=${sortOrder}`;
      }

      const cachedData = Cache.get<GitHubSearchResponse>(url);
      if (cachedData) {
        dispatch({ type: 'SET_REPOSITORIES', payload: cachedData.items });
        dispatch({ type: 'SET_TOTAL_COUNT', payload: cachedData.total_count });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data: GitHubSearchResponse = await response.json();
      
      Cache.set(url, data);

      dispatch({ type: 'SET_REPOSITORIES', payload: data.items });
      dispatch({ type: 'SET_TOTAL_COUNT', payload: data.total_count });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred while fetching repositories' });
      console.error('Fetch error:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [currentQuery, sortBy, sortOrder, itemsPerPage, dispatch]);

  useEffect(() => {
    if (currentQuery) {
      fetchRepositories(currentPage);
    }
  }, [currentPage, currentQuery, sortBy, sortOrder, fetchRepositories]);

  const handleRepositoryClick = (repo: GitHubRepository) => {
    navigate(`/repository/${repo.owner.login}/${repo.name}`, { state: { repository: repo } });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  if (isLoading) {
    return (
      <div className="loading-state" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <div>Loading repositories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state" role="alert">
        <div className="error-icon" aria-hidden="true">⚠️</div>
        <div>Error: {error}</div>
        <button onClick={navigateHome} className="home-button">
          Go Home
        </button>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-icon" aria-hidden="true">📁</div>
        <div>No repositories found</div>
        <div className="empty-subtext">Try searching for something else</div>
      </div>
    );
  }

  return (
    <div className="repository-container">
      <div className="results-count" role="status" aria-live="polite">
        Found {totalCount} repositories
      </div>
      <SortOptions />
      <div className="repository-list" role="list">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className="repository-card"
            onClick={() => handleRepositoryClick(repo)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRepositoryClick(repo);
              }
            }}
          >
            <div className="repository-header">
              <img
                src={repo.owner.avatar_url}
                alt={`${repo.owner.login}'s avatar`}
                className="avatar"
                width="40"
                height="40"
              />
              <div className="repository-info">
                <h3>
                  <a
                    href={`https://github.com/${repo.owner.login}/${repo.name}`}
                    className="repository-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`View ${repo.name} on GitHub (opens in new tab)`}
                  >
                    {repo.name}
                  </a>
                </h3>
                <a
                  href={`https://github.com/${repo.owner.login}`}
                  className="owner-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`View ${repo.owner.login}'s profile on GitHub (opens in new tab)`}
                >
                  <span className="owner">{repo.owner.login}</span>
                </a>
              </div>
              <div className="stars" aria-label={`${repo.stargazers_count} stars`}>
                <span className="star-icon" aria-hidden="true">⭐</span>
                {repo.stargazers_count}
              </div>
            </div>
            <p className="description">{repo.description || 'No description available'}</p>
            <div className="repository-stats">
              {repo.language && (
                <div className="language">
                  <span className="language-dot" aria-hidden="true"></span>
                  <span aria-label={`Primary programming language: ${repo.language}`}>
                    {repo.language}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RepositoryList; 