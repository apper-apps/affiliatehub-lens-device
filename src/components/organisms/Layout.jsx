import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Navigation from "@/components/molecules/Navigation"
import { AuthService } from "@/services/api/authService"

const Layout = ({ isAuthenticated, onAuthChange }) => {
  const [isAdminMode, setIsAdminMode] = useState(false)

  const handleLogout = () => {
    AuthService.logout()
    onAuthChange(false)
  }

  const handleToggleAdmin = () => {
    setIsAdminMode(prev => !prev)
  }
return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isAdmin={isAdminMode}
        onToggleAdmin={handleToggleAdmin}
      />
      <main>
        <Outlet />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: "14px",
          borderRadius: "8px"
        }}
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default Layout