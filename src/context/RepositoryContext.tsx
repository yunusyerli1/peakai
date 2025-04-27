import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GitHubRepository, GitHubRepositoryDetails } from '../types/github';

export type SortOption = 'stars' | 'forks' | 'updated' | '';

interface RepositoryState {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  currentQuery: string;
  selectedRepository: GitHubRepositoryDetails | null;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

type RepositoryAction =
  | { type: 'SET_REPOSITORIES'; payload: GitHubRepository[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOTAL_COUNT'; payload: number }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_CURRENT_QUERY'; payload: string }
  | { type: 'SET_SELECTED_REPOSITORY'; payload: GitHubRepositoryDetails | null }
  | { type: 'SET_SORT_BY'; payload: SortOption }
  | { type: 'SET_SORT_ORDER'; payload: 'asc' | 'desc' };

const initialState: RepositoryState = {
  repositories: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  currentQuery: '',
  selectedRepository: null,
  sortBy: '',
  sortOrder: 'desc',
};

const RepositoryContext = createContext<{
  state: RepositoryState;
  dispatch: React.Dispatch<RepositoryAction>;
} | undefined>(undefined);

function repositoryReducer(state: RepositoryState, action: RepositoryAction): RepositoryState {
  switch (action.type) {
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_CURRENT_QUERY':
      return { ...state, currentQuery: action.payload };
    case 'SET_SELECTED_REPOSITORY':
      return { ...state, selectedRepository: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload };
    default:
      return state;
  }
}

interface RepositoryProviderProps {
  children: ReactNode;
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
  const [state, dispatch] = useReducer(repositoryReducer, initialState);

  return (
    <RepositoryContext.Provider value={{ state, dispatch }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
} 