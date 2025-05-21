import { useContext, useEffect } from "react"
import { AuthContext } from "../components/AuthProvider"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      alert("Du skal være logget ind for at se brugersiden")
    }
  }, [loading, isAuthenticated])

  if (loading) return null // eller en spinner

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default ProtectedRoute
