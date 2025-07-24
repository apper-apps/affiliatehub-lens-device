import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { SettingsService } from "@/services/api/settingsService"

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    affiliateLink: "",
    signupButtonText: "Join Domestika",
    siteName: "AffiliateHub Pro",
    siteTagline: "Content Management for Affiliate Marketing"
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadSettings()
  }, [])
  
  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await SettingsService.get()
      setSettings(prev => ({ ...prev, ...data }))
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field) => (e) => {
    setSettings(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }
  
  const handleSave = async () => {
    if (!settings.affiliateLink.trim()) {
      toast.error("Please enter your Domestika affiliate link")
      return
    }
    
    if (!settings.signupButtonText.trim()) {
      toast.error("Please enter signup button text")
      return
    }
    
    try {
      setSaving(true)
      await SettingsService.update(settings)
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }
  
  const testAffiliateLink = () => {
    if (settings.affiliateLink) {
      window.open(settings.affiliateLink, "_blank", "noopener,noreferrer")
    } else {
      toast.warning("Please enter an affiliate link first")
    }
  }
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary">Settings</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Affiliate Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display font-semibold text-secondary mb-6">
            Affiliate Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <FormField
                label="Domestika Affiliate Link"
                value={settings.affiliateLink}
                onChange={handleInputChange("affiliateLink")}
                placeholder="https://domestika.org/..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your complete Domestika affiliate link including tracking parameters
              </p>
            </div>
            
            <div>
              <FormField
                label="Signup Button Text"
                value={settings.signupButtonText}
                onChange={handleInputChange("signupButtonText")}
                placeholder="Join Domestika"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Text displayed on the affiliate signup button
              </p>
            </div>
            
            <Button
              variant="outline"
              onClick={testAffiliateLink}
              className="w-full"
            >
              <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
              Test Affiliate Link
            </Button>
          </div>
        </div>
        
        {/* Site Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-display font-semibold text-secondary mb-6">
            Site Configuration
          </h2>
          
          <div className="space-y-6">
            <FormField
              label="Site Name"
              value={settings.siteName}
              onChange={handleInputChange("siteName")}
              placeholder="AffiliateHub Pro"
              required
            />
            
            <FormField
              label="Site Tagline"
              value={settings.siteTagline}
              onChange={handleInputChange("siteTagline")}
              placeholder="Content Management for Affiliate Marketing"
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-secondary mb-3">Preview</h3>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded"></div>
                  <span className="font-display font-bold text-secondary">
                    {settings.siteName}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{settings.siteTagline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Current Status */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="w-5 h-5 text-accent mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary mb-2">Configuration Status</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={settings.affiliateLink ? "CheckCircle" : "AlertCircle"} 
                  className={`w-4 h-4 ${settings.affiliateLink ? "text-success" : "text-warning"}`} 
                />
                <span>Affiliate Link: {settings.affiliateLink ? "Configured" : "Not Set"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={settings.signupButtonText ? "CheckCircle" : "AlertCircle"} 
                  className={`w-4 h-4 ${settings.signupButtonText ? "text-success" : "text-warning"}`} 
                />
                <span>Button Text: {settings.signupButtonText ? "Configured" : "Not Set"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel