import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/organisms/Layout"
import Home from "@/components/pages/Home"
import ArticleView from "@/components/pages/ArticleView"
import StaticPage from "@/components/pages/StaticPage"
import AdminDashboard from "@/components/pages/AdminDashboard"
import ArticleList from "@/components/organisms/ArticleList"
import ArticleEditor from "@/components/organisms/ArticleEditor"
import PageEditor from "@/components/organisms/PageEditor"
import SettingsPanel from "@/components/organisms/SettingsPanel"

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  
  const toggleAdmin = () => {
    setIsAdmin(prev => !prev)
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Layout isAdmin={isAdmin} onToggleAdmin={toggleAdmin} />}
        >
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="article/:id" element={<ArticleView />} />
          <Route path="about" element={<StaticPage />} />
          <Route path="contact" element={<StaticPage />} />
          <Route path="privacy" element={<StaticPage />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/articles" element={<ArticleList />} />
          <Route path="admin/articles/new" element={<ArticleEditor />} />
          <Route path="admin/articles/edit/:id" element={<ArticleEditor />} />
          <Route path="admin/pages" element={<PageEditor />} />
          <Route path="admin/settings" element={<SettingsPanel />} />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App