import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { format } from "date-fns"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { ArticleService } from "@/services/api/articleService"
import { cn } from "@/utils/cn"

const ArticleList = () => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  useEffect(() => {
    loadArticles()
  }, [])
  
  const loadArticles = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await ArticleService.getAll()
      // Sort by creation date, newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setArticles(sortedData)
    } catch (err) {
      setError("Failed to load articles. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await ArticleService.delete(id)
        setArticles(prev => prev.filter(article => article.Id !== id))
        toast.success("Article deleted successfully")
      } catch (error) {
        toast.error("Failed to delete article")
      }
    }
  }
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || article.status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadArticles} />
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary">Articles</h1>
        <Button onClick={() => navigate("/admin/articles/new")}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
      
      {filteredArticles.length === 0 ? (
        <Empty
          title="No articles found"
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your search or filter criteria." 
            : "Start creating engaging content for your affiliate marketing success!"
          }
          actionLabel="Create First Article"
          onAction={() => navigate("/admin/articles/new")}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        article.status === "published"
                          ? "bg-success/20 text-success"
                          : "bg-warning/20 text-warning"
                      )}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(article.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/article/${article.Id}`)}
                          title="View"
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/articles/edit/${article.Id}`)}
                          title="Edit"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.Id)}
                          className="text-error hover:text-error hover:bg-error/10"
                          title="Delete"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArticleList