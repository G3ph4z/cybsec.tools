// Navigation.tsx
import React from 'react';

const Navigation: React.FC<{ setActiveOption: (option: string) => void }> = ({ setActiveOption }) => {
  const handleOptionClick = (option: string) => {
    setActiveOption(option);
  };

  return (
    <nav className="navbar">
      <div className="title">
        <h1 className="pixel-font">
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            CybSec tools
            </a>
        </h1>
      </div>
      <ul>
        <li onClick={() => handleOptionClick('Home') }>Home</li>
        <li onClick={() => handleOptionClick('Tools')}>Tools</li>
        <li onClick={() => handleOptionClick('Services')}>Submit</li>
        <li onClick={() => handleOptionClick('Contact')}>Contact</li>
      </ul>
      <div className="search-bar">
        <input type="text" placeholder="Looking for a tool?" />
      </div>
    </nav>
  );
};

export default Navigation;
