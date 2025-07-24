import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Navigation = ({ isAdmin, onToggleAdmin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const publicNavItems = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/about", label: "About Us", icon: "Users" },
    { to: "/contact", label: "Contact", icon: "Mail" },
    { to: "/privacy", label: "Privacy", icon: "Shield" }
  ]
  
  const adminNavItems = [
    { to: "/admin", label: "Dashboard", icon: "BarChart3" },
    { to: "/admin/articles", label: "Articles", icon: "FileText" },
    { to: "/admin/pages", label: "Pages", icon: "Globe" },
    { to: "/admin/settings", label: "Settings", icon: "Settings" }
  ]
  
  const navItems = isAdmin ? adminNavItems : publicNavItems
  
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-secondary">
              AffiliateHub Pro
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100",
                  location.pathname === item.to
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-secondary"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Admin Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <Button
              variant={isAdmin ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleAdmin}
              className="hidden sm:flex"
            >
              <ApperIcon name={isAdmin ? "Eye" : "Settings"} className="w-4 h-4 mr-2" />
              {isAdmin ? "View Site" : "Admin"}
            </Button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-secondary hover:bg-gray-100"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.to
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-secondary hover:bg-gray-100"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    onToggleAdmin()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-accent hover:text-info hover:bg-gray-100 w-full"
                >
                  <ApperIcon name={isAdmin ? "Eye" : "Settings"} className="w-4 h-4" />
                  <span>{isAdmin ? "View Site" : "Admin Panel"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Navigation