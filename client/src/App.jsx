import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { CssBaseline, Container, Typography } from '@mui/material';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={
              <Dashboard />
              
              } />
      </Routes>
    </Router>
  );
};

export default App;
