import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import RichTextEditor from "@/components/molecules/RichTextEditor"
import ApperIcon from "@/components/ApperIcon"
import { PageService } from "@/services/api/pageService"

const PageEditor = () => {
  const [pages, setPages] = useState({
    about: { title: "", content: "" },
    contact: { title: "", content: "" },
    privacy: { title: "", content: "" }
  })
  const [activeTab, setActiveTab] = useState("about")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadPages()
  }, [])
  
  const loadPages = async () => {
    try {
      setLoading(true)
      const allPages = await PageService.getAll()
      const pageMap = {}
      
      allPages.forEach(page => {
        pageMap[page.slug] = {
          title: page.title,
          content: page.content
        }
      })
      
      setPages(prev => ({
        ...prev,
        ...pageMap
      }))
    } catch (error) {
      toast.error("Failed to load pages")
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field) => (e) => {
    setPages(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: e.target.value
      }
    }))
  }
  
  const handleSave = async () => {
    const currentPage = pages[activeTab]
    
    if (!currentPage.title.trim()) {
      toast.error("Please enter a title")
      return
    }
    
    try {
      setSaving(true)
      await PageService.update(activeTab, {
        title: currentPage.title,
        content: currentPage.content
      })
      toast.success("Page saved successfully!")
    } catch (error) {
      toast.error("Failed to save page")
    } finally {
      setSaving(false)
    }
  }
  
  const tabs = [
    { key: "about", label: "About Us", icon: "Users" },
    { key: "contact", label: "Contact", icon: "Mail" },
    { key: "privacy", label: "Privacy Policy", icon: "Shield" }
  ]
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary">Page Editor</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 space-y-6">
          <FormField
            label="Page Title"
            value={pages[activeTab].title}
            onChange={handleInputChange("title")}
            placeholder={`Enter ${tabs.find(t => t.key === activeTab)?.label} title...`}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Content <span className="text-error">*</span>
            </label>
            <RichTextEditor
              value={pages[activeTab].content}
              onChange={handleInputChange("content")}
              placeholder={`Write your ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()} content here...`}
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              )}
              Save Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageEditor