import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store from './store'; // Importa el store desde store.js
import LandingPage from './components/LengindPage'; // Corrige el nombre del componente
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import CreatePage from './components/CreatePage';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/add" element={<CreatePage />} />
          <Route path="/detail/:source/:id" element={<DetailPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
