import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/organisms/Layout"
import Home from "@/components/pages/Home"
import ArticleView from "@/components/pages/ArticleView"
import StaticPage from "@/components/pages/StaticPage"
import AdminLogin from "@/components/pages/AdminLogin"
import AdminDashboard from "@/components/pages/AdminDashboard"
import ArticleList from "@/components/organisms/ArticleList"
import ArticleEditor from "@/components/organisms/ArticleEditor"
import PageEditor from "@/components/organisms/PageEditor"
import SettingsPanel from "@/components/organisms/SettingsPanel"
import ProtectedRoute from "@/components/molecules/ProtectedRoute"
import { AuthService } from "@/services/api/authService"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const authStatus = AuthService.isAuthenticated()
      setIsAuthenticated(authStatus)
    }
    
    checkAuth()
    
    // Set up periodic auth check
    const interval = setInterval(checkAuth, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])

  const handleAuthChange = (authStatus) => {
    setIsAuthenticated(authStatus)
  }
  
return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login Route (outside main layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route 
          path="/" 
          element={
            <Layout 
              isAuthenticated={isAuthenticated} 
              onAuthChange={handleAuthChange} 
            />
          }
        >
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="article/:id" element={<ArticleView />} />
          <Route path="about" element={<StaticPage />} />
          <Route path="contact" element={<StaticPage />} />
          <Route path="privacy" element={<StaticPage />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/articles" 
            element={
              <ProtectedRoute>
                <ArticleList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/articles/new" 
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/articles/edit/:id" 
            element={
              <ProtectedRoute>
                <ArticleEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/pages" 
            element={
              <ProtectedRoute>
                <PageEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin/settings" 
            element={
              <ProtectedRoute>
                <SettingsPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App