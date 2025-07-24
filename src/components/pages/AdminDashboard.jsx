import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ApperIcon from "@/components/ApperIcon"
import { ArticleService } from "@/services/api/articleService"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    recentArticles: []
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const articles = await ArticleService.getAll()
      
      const totalArticles = articles.length
      const publishedArticles = articles.filter(a => a.status === "published").length
      const draftArticles = articles.filter(a => a.status === "draft").length
      const recentArticles = articles
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      
      setStats({
        totalArticles,
        publishedArticles,
        draftArticles,
        recentArticles
      })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <Loading />
  
  const quickActions = [
    {
      title: "New Article",
      description: "Create a new article",
      icon: "Plus",
      to: "/admin/articles/new",
      color: "from-primary to-primary/80"
    },
    {
      title: "Manage Articles",
      description: "View and edit all articles",
      icon: "FileText",
      to: "/admin/articles",
      color: "from-accent to-accent/80"
    },
    {
      title: "Edit Pages",
      description: "Update static pages",
      icon: "Globe",
      to: "/admin/pages",
      color: "from-info to-info/80"
    },
    {
      title: "Settings",
      description: "Configure affiliate links",
      icon: "Settings",
      to: "/admin/settings",
      color: "from-secondary to-secondary/80"
    }
  ]
  
  const statCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: "FileText",
      color: "text-secondary"
    },
    {
      title: "Published",
      value: stats.publishedArticles,
      icon: "CheckCircle",
      color: "text-success"
    },
    {
      title: "Drafts",
      value: stats.draftArticles,
      icon: "Edit",
      color: "text-warning"
    },
    {
      title: "Completion Rate",
      value: stats.totalArticles > 0 ? Math.round((stats.publishedArticles / stats.totalArticles) * 100) + "%" : "0%",
      icon: "TrendingUp",
      color: "text-accent"
    }
  ]
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your affiliate content and track your progress
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200`}>
                    <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-secondary mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={action.to}>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${action.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${action.color} text-white`}>
                        <ApperIcon name={action.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Recent Articles */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-secondary">
            Recent Articles
          </h2>
          <Link to="/admin/articles">
            <Button variant="outline" size="sm">
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {stats.recentArticles.length === 0 ? (
          <Card className="p-12 text-center">
            <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No articles yet</h3>
            <p className="text-gray-500 mb-4">Start creating engaging content for your audience</p>
            <Link to="/admin/articles/new">
              <Button>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create First Article
              </Button>
            </Link>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {stats.recentArticles.map((article, index) => (
                  <motion.div
                    key={article.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {article.featuredImage && (
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/admin/articles/edit/${article.Id}`}
                            className="text-lg font-semibold text-secondary hover:text-primary transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          {article.excerpt && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              article.status === "published"
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            }`}>
                              {article.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link to={`/article/${article.Id}`}>
                          <Button variant="ghost" size="sm" title="View">
                            <ApperIcon name="Eye" className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/articles/edit/${article.Id}`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard