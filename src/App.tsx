import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RepositoryProvider } from './context/RepositoryContext';
import Layout from './views/Layout/Layout';
import Search from './components/Search/Search';
import RepositoryList from './views/RepositoryList/RepositoryList';
import RepositoryDetails from './views/RepositoryDetails/RepositoryDetails';
import './App.css';

function App() {
  return (
    <RepositoryProvider>
      <Router>
        <Layout>
          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="App" role="main">
                    <Search />
                    <RepositoryList />
                  </div>
                }
              />
              <Route 
                path="/repository/:owner/:repo" 
                element={
                  <div role="main">
                    <RepositoryDetails />
                  </div>
                } 
              />
            </Routes>
          </main>
        </Layout>
      </Router>
    </RepositoryProvider>
  );
}

export default App;
