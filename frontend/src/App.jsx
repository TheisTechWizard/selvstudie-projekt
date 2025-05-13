//import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Market from './pages/Market'; 
import UserPage from './pages/UserPage';
import './assets/scss/main.scss'
import "../src/assets/scss/components/nav.scss"
function App() {

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/market">Market</Link>
        <Link to="/user">User</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/market" element={<Market />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App
