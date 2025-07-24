import React from "react"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Navigation from "@/components/molecules/Navigation"
import { AuthService } from "@/services/api/authService"

const Layout = ({ isAuthenticated, onAuthChange }) => {
  const handleLogout = () => {
    AuthService.logout()
    onAuthChange(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout}
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