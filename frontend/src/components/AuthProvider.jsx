import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      // Du kan også kalde backend for at validere token
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
