import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import AffiliateButton from "@/components/molecules/AffiliateButton"
import { PageService } from "@/services/api/pageService"
import { SettingsService } from "@/services/api/settingsService"

const StaticPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadPage()
  }, [slug])
  
  const loadPage = async () => {
    try {
      setLoading(true)
      setError("")
      const [pageData, settingsData] = await Promise.all([
        PageService.getBySlug(slug),
        SettingsService.get()
      ])
      setPage(pageData)
      setSettings(settingsData)
    } catch (err) {
      setError("Page not found or failed to load.")
    } finally {
      setLoading(false)
    }
  }
  
  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.)/gm, '<p>$1')
      .replace(/(.)$/gm, '$1</p>')
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (!page) return <Error message="Page not found" />
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-8">
            {page.title}
          </h1>
          
          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: formatContent(page.content) }}
          />
          
          {/* Contact Form for Contact Page */}
          {slug === "contact" && (
            <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-lg border border-gray-200 mt-8">
              <h2 className="text-2xl font-display font-semibold text-secondary mb-6">
                Get in Touch
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-md font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
          
          {/* CTA Section for non-contact pages */}
          {slug !== "contact" && (
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-8 text-center border border-accent/20 mt-12">
              <h3 className="text-2xl font-display font-bold text-secondary mb-4">
                Start Your Creative Journey Today
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join millions of creative professionals who have transformed their skills 
                with Domestika's expert-led courses.
              </p>
              <AffiliateButton 
                text={settings.signupButtonText || "Join Domestika"}
                link={settings.affiliateLink}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default StaticPage