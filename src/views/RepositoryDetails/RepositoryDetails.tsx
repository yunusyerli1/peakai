import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GitHubRepositoryDetails } from '../../types/github';
import './RepositoryDetails.css';

const RepositoryDetails: React.FC = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [repository, setRepository] = useState<GitHubRepositoryDetails | null>(
    location.state?.repository || null
  );
  const [isLoading, setIsLoading] = useState(!location.state?.repository);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch additional details if we don't have them
    if (!repository?.forks_count) {
      const fetchRepositoryDetails = async () => {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (!response.ok) {
            throw new Error('Failed to fetch repository details');
          }
          const data = await response.json();
          setRepository(data);
        } catch (err) {
          setError('An error occurred while fetching repository details');
          console.error('Error:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRepositoryDetails();
    }
  }, [owner, repo, repository]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading repository details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!repository) {
    return null;
  }

  return (
    <div className="repository-details">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Search
      </button>

      <div className="repository-header">
        <img 
          src={repository.owner.avatar_url} 
          alt={`${repository.owner.login}'s avatar`} 
          className="avatar" 
        />
        <div className="repository-info">
          <h1>
            <a 
              href={repository.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repository-link"
            >
              {repository.full_name}
            </a>
          </h1>
          <p className="owner">
            by{' '}
            <a 
              href={`https://github.com/${repository.owner.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="owner-link"
            >
              {repository.owner.login}
            </a>
          </p>
        </div>
      </div>

      {repository.description && (
        <div className="description-section">
          <h2>Description</h2>
          <p>{repository.description}</p>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{repository.stargazers_count.toLocaleString()}</span>
          <span className="stat-label">Stars</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{repository.forks_count.toLocaleString()}</span>
          <span className="stat-label">Forks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{repository.open_issues_count.toLocaleString()}</span>
          <span className="stat-label">Open Issues</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{repository.watchers_count.toLocaleString()}</span>
          <span className="stat-label">Watchers</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-section">
          <h2>Language</h2>
          {repository.language ? (
            <span className="language">
              <span className="language-dot"></span>
              {repository.language}
            </span>
          ) : (
            <span className="no-language">Not specified</span>
          )}
        </div>

        <div className="detail-section">
          <h2>License</h2>
          {repository.license ? (
            <a 
              href={repository.license.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="license-link"
            >
              {repository.license.name}
            </a>
          ) : (
            <span className="no-license">No license specified</span>
          )}
        </div>

        <div className="detail-section">
          <h2>Created</h2>
          <span>{new Date(repository.created_at).toLocaleDateString()}</span>
        </div>

        <div className="detail-section">
          <h2>Last Updated</h2>
          <span>{new Date(repository.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {repository.homepage && (
        <div className="homepage-section">
          <h2>Homepage</h2>
          <a 
            href={repository.homepage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="homepage-link"
          >
            {repository.homepage}
          </a>
        </div>
      )}

      {repository.topics && repository.topics.length > 0 && (
        <div className="topics-section">
          <h2>Topics</h2>
          <div className="topics-list">
            {repository.topics.map((topic) => (
              <span key={topic} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetails; 