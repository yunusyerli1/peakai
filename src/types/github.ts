export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: GitHubUser;
  updated_at: string;
}

export interface GitHubRepositoryDetails extends GitHubRepository {
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  license: {
    name: string;
    url: string;
  } | null;
  created_at: string;
  homepage: string | null;
  topics: string[];
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
} 