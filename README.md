# PeakAI GitHub Repository Explorer

A React application for exploring GitHub repositories with a focus on accessibility and user experience.

## Features

- Search GitHub repositories
- View repository details
- Pagination support
- Sorting options
- Responsive design
- Accessibility features
- TypeScript support
- Error handling
- Loading states

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yunusyerli1/peakai.git
cd peakai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

To start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Running Tests

To run the test suite:
```bash
npm test
# or
yarn test
```

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Header/        # Header component with navigation
│   ├── Search/        # Search input component
│   ├── SortOptions/   # Repository sorting options
│   └── Pagination/    # Pagination controls
├── context/           # React Context for state management
├── types/             # TypeScript type definitions
├── views/             # Page components
│   ├── Layout/        # Main layout component
│   ├── RepositoryList/# Repository list view
│   └── RepositoryDetails/ # Repository details view
└── utils/             # Utility functions and API calls
```

## Architectural Decisions

### Component Structure
- **Atomic Design**: Components are organized following atomic design principles
- **Separation of Concerns**: Clear separation between presentational and container components
- **Reusability**: Components are designed to be reusable and composable

### State Management
- **React Context**: Used for global state management (repository data, search queries, pagination)
- **Local State**: Component-specific state managed with React hooks
- **Type Safety**: Full TypeScript support for better type checking and developer experience

### Styling Approach
- **CSS Modules**: Used for component-specific styles
- **Responsive Design**: Mobile-first approach with media queries
- **Accessibility**: Semantic HTML and ARIA attributes for better accessibility
