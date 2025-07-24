import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { format } from "date-fns"
import { motion } from "framer-motion"
import AffiliateButton from "@/components/molecules/AffiliateButton"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { ArticleService } from "@/services/api/articleService"
import { SettingsService } from "@/services/api/settingsService"

const ArticleView = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [settings, setSettings] = useState({})
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    loadArticle()
  }, [id])
  
  const loadArticle = async () => {
    try {
      setLoading(true)
      setError("")
      const [articleData, settingsData, allArticles] = await Promise.all([
        ArticleService.getById(parseInt(id)),
        SettingsService.get(),
        ArticleService.getAll()
      ])
      
      setArticle(articleData)
      setSettings(settingsData)
      
      // Get related articles (excluding current one)
      const related = allArticles
        .filter(art => art.Id !== parseInt(id) && art.status === "published")
        .slice(0, 3)
      setRelatedArticles(related)
      
    } catch (err) {
      setError("Article not found or failed to load.")
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
  
  if (loading) return <Loading type="article" />
  if (error) return <Error message={error} />
  if (!article) return <Error message="Article not found" />
  
  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Hero Section */}
        {article.featuredImage && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-12"
        >
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-accent hover:text-info transition-colors text-sm font-medium"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-1" />
              Back to Articles
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-bold text-secondary mb-6 leading-tight">
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex items-center text-sm text-gray-500 space-x-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>{format(new Date(article.publishDate), "MMMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>
          
          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 text-center border border-primary/20 mb-12">
            <h3 className="text-2xl font-display font-bold text-secondary mb-4">
              Ready to Start Learning?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover expert-led courses and transform your creative skills with Domestika's 
              premium learning platform.
            </p>
            <AffiliateButton 
              text={settings.signupButtonText || "Join Domestika"}
              link={settings.affiliateLink}
            />
          </div>
        </motion.div>
      </article>
      
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-display font-bold text-secondary mb-8 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((relatedArticle, index) => (
              <motion.div
                key={relatedArticle.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/article/${relatedArticle.Id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {relatedArticle.featuredImage && (
                    <img
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-display font-semibold text-secondary mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ArticleView