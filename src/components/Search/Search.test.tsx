import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';
import { RepositoryProvider } from '../../context/RepositoryContext';

const mockDispatch = jest.fn();

jest.mock('../../context/RepositoryContext', () => ({
  ...jest.requireActual('../../context/RepositoryContext'),
  useRepository: () => ({
    state: {
      repositories: [],
      isLoading: false,
      error: null,
      totalCount: 0,
      currentPage: 1,
      currentQuery: '',
      sortBy: null,
      sortOrder: 'desc',
    },
    dispatch: mockDispatch,
  }),
}));

describe('Search Component', () => {
  const renderSearchComponent = () => {
    return render(
      <RepositoryProvider>
        <Search />
      </RepositoryProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and button', () => {
    renderSearchComponent();
    
    // Check if search input is present
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    expect(searchInput).toBeInTheDocument();
    
    // Check if search button is present
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    renderSearchComponent();
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    const testQuery = 'react testing';
    
    fireEvent.change(searchInput, { target: { value: testQuery } });
    
    expect(searchInput).toHaveValue(testQuery);
  });

  it('submits search form with valid input', async () => {
    renderSearchComponent();
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    const testQuery = 'react testing';
    
    fireEvent.change(searchInput, { target: { value: testQuery } });
    
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CURRENT_QUERY',
        payload: testQuery.trim(),
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CURRENT_PAGE',
        payload: 1,
      });
    });
  });

  it('does not submit empty search', async () => {
    renderSearchComponent();
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  it('submits search on Enter key press', async () => {
    renderSearchComponent();
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    const testQuery = 'react testing';
    
    fireEvent.change(searchInput, { target: { value: testQuery } });
    
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CURRENT_QUERY',
        payload: testQuery.trim(),
      });
    });
  });

  it('trims whitespace from search query', async () => {
    renderSearchComponent();
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    const testQuery = '  react testing  ';
    
    fireEvent.change(searchInput, { target: { value: testQuery } });
    
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CURRENT_QUERY',
        payload: testQuery.trim(),
      });
    });
  });

  it('has proper accessibility attributes', () => {
    renderSearchComponent();
    
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('aria-label', 'GitHub repository search');
    
    const searchInput = screen.getByPlaceholderText('Search GitHub repositories...');
    expect(searchInput).toHaveAttribute('aria-required', 'true');
    expect(searchInput).toHaveAttribute('aria-label', 'Search GitHub repositories');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toHaveAttribute('aria-label', 'Submit search');
  });
}); 