import React from 'react';
import logo from '../logo.png';

function Header({ isFadingOut }) {
  return (
    <div className={`header ${isFadingOut ? 'fading-out' : ''}`}>
      <img src={logo} className="App-logo" alt="logo" />
      <p>Imagine a story!</p>
    </div>
  );
}

export default Header;
