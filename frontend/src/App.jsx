//import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Market from './pages/Market'; 
import './assets/scss/main.scss'
function App() {
  //const [count, setCount] = useState(0)

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to="/market">Market</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/market" element={<Market />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

export default App
