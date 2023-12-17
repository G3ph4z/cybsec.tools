import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Content from './Content';
import Navigation from './Navigation';
import Footer from './Footer';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  const [activeOption, setActiveOption] = useState('Home');

  return (
    <Router>
      <div className="app">
        <Header />
        <Navigation setActiveOption={setActiveOption} />
        <Content activeOption={activeOption} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
