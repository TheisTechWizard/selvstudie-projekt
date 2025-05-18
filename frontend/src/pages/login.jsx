import { useState } from "react"
import { Link } from "react-router-dom"

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const response = await fetch("/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Login response:", data)
      localStorage.setItem("token", data.access)
      localStorage.setItem("username", data.username)
      localStorage.setItem("user", JSON.stringify({ username })) // Gem brugernavn
      setIsAuthenticated(true) // Opdater auth-status
      alert("Login successful")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <Link to="/register">Opret bruger</Link>
    </div>
  )
}

export default Login
