import React from "react"
import { Navigate } from "react-router-dom"
import { AuthService } from "@/services/api/authService"

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  return children
}

export default ProtectedRoute