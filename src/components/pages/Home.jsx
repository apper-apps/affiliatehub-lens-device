import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ArticleCard from "@/components/molecules/ArticleCard"
import AffiliateButton from "@/components/molecules/AffiliateButton"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { ArticleService } from "@/services/api/articleService"
import { SettingsService } from "@/services/api/settingsService"

const Home = () => {
  const [articles, setArticles] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [articlesData, settingsData] = await Promise.all([
        ArticleService.getAll(),
        SettingsService.get()
      ])
      
      // Filter published articles and sort by publish date
      const publishedArticles = articlesData
        .filter(article => article.status === "published")
        .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      
      setArticles(publishedArticles)
      setSettings(settingsData)
    } catch (err) {
      setError("Failed to load content. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading type="articles" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
              Master Creative Skills with Domestika
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover expert-led online courses in design, photography, marketing, and more. 
              Transform your creative passion into professional expertise.
            </p>
            <AffiliateButton 
              text={settings.signupButtonText || "Join Domestika"}
              link={settings.affiliateLink}
              className="inline-block"
            />
          </motion.div>
        </div>
      </section>
      
      {/* Featured Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">
              Latest Articles & Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated content about creative learning, skill development, 
              and making the most of your Domestika experience.
            </p>
          </motion.div>
          
          {articles.length === 0 ? (
            <Empty
              title="No articles published yet"
              description="Check back soon for expert insights, tutorials, and creative inspiration to enhance your learning journey."
              icon="BookOpen"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.Id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-accent to-info text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Start Your Creative Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Join thousands of creative professionals who have transformed their skills 
              and careers with Domestika's premium courses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <AffiliateButton 
                text={settings.signupButtonText || "Join Domestika"}
                link={settings.affiliateLink}
              />
              <div className="flex items-center space-x-4 text-white/80">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Users" className="w-5 h-5" />
                  <span className="text-sm">8M+ Students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" className="w-5 h-5" />
                  <span className="text-sm">4.8 Rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="PlayCircle" className="w-5 h-5" />
                  <span className="text-sm">1000+ Courses</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home