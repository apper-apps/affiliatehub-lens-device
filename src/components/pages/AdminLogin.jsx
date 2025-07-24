import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { AuthService } from "@/services/api/authService"
import { toast } from "react-toastify"

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if already authenticated
    if (AuthService.isAuthenticated()) {
      navigate("/admin", { replace: true })
    }
  }, [navigate])

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error("Please enter both username and password")
      return
    }

    try {
      setLoading(true)
      const success = await AuthService.login(credentials.username, credentials.password)
      
      if (success) {
        toast.success("Login successful! Welcome to Admin Panel")
        navigate("/admin", { replace: true })
      } else {
        toast.error("Invalid credentials. Please try again.")
      }
    } catch (error) {
      toast.error("Login failed. Please try again.")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white w-16 h-16 flex items-center justify-center">
              <ApperIcon name="Lock" className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl text-secondary">
              Admin Login
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Access the admin panel to manage your content
            </p>
          </CardHeader>
          
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Username"
                type="text"
                value={credentials.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                disabled={loading}
                required
              />
              
              <FormField
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                disabled={loading}
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Secure admin access for authorized users only
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminLogin