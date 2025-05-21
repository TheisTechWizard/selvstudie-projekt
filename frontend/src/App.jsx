import { useState, useEffect } from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Market from "./pages/Market"
import UserPage from "./pages/UserPage"
import Login from "./pages/login"
import Register from "./pages/register"
import ProtectedRoute from "./components/ProtectedRoute"
import "./assets/scss/main.scss"
import "../src/assets/scss/components/nav.scss"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/market">Market</Link>
        <Link to={`/user/${localStorage.getItem("userId")}`}>User</Link>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Log ud</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrer</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/market" element={<Market />} />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
