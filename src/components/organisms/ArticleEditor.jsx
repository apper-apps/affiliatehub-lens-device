import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import RichTextEditor from "@/components/molecules/RichTextEditor"
import ApperIcon from "@/components/ApperIcon"
import { ArticleService } from "@/services/api/articleService"

const ArticleEditor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  
  const [article, setArticle] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    if (isEdit) {
      loadArticle()
    }
  }, [id])
  
  const loadArticle = async () => {
    try {
      setLoading(true)
      const data = await ArticleService.getById(parseInt(id))
      setArticle({
        ...data,
        seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords.join(", ") : data.seoKeywords || ""
      })
    } catch (error) {
      toast.error("Failed to load article")
      navigate("/admin/articles")
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field) => (e) => {
    setArticle(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }
  
  const generateExcerpt = () => {
    if (article.content) {
      const plainText = article.content.replace(/[#*\[\]()]/g, "").trim()
      const excerpt = plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "")
      setArticle(prev => ({ ...prev, excerpt }))
      toast.success("Excerpt generated!")
    }
  }
  
  const handleSave = async (status = "draft") => {
    if (!article.title.trim()) {
      toast.error("Please enter a title")
      return
    }
    
    try {
      setSaving(true)
      const articleData = {
        ...article,
        status,
        seoKeywords: article.seoKeywords ? article.seoKeywords.split(",").map(k => k.trim()) : [],
        publishDate: status === "published" ? new Date().toISOString() : article.publishDate
      }
      
      if (isEdit) {
        await ArticleService.update(parseInt(id), articleData)
        toast.success(`Article ${status === "published" ? "published" : "saved"}!`)
      } else {
        await ArticleService.create(articleData)
        toast.success("Article created!")
        navigate("/admin/articles")
      }
    } catch (error) {
      toast.error("Failed to save article")
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-secondary">
          {isEdit ? "Edit Article" : "Create New Article"}
        </h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/articles")}
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <FormField
            label="Title"
            value={article.title}
            onChange={handleInputChange("title")}
            placeholder="Enter article title..."
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Content <span className="text-error">*</span>
            </label>
            <RichTextEditor
              value={article.content}
              onChange={handleInputChange("content")}
              placeholder="Write your article content here..."
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-secondary">Excerpt</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateExcerpt}
                disabled={!article.content}
              >
                <ApperIcon name="Wand2" className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
            <FormField
              type="textarea"
              value={article.excerpt}
              onChange={handleInputChange("excerpt")}
              placeholder="Brief description of the article..."
              rows={3}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-display font-semibold mb-4">Publish</h3>
            <div className="space-y-3">
              <Button
                onClick={() => handleSave("draft")}
                disabled={saving}
                variant="outline"
                className="w-full"
              >
                {saving ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-display font-semibold mb-4">Featured Image</h3>
            <FormField
              label="Image URL"
              value={article.featuredImage}
              onChange={handleInputChange("featuredImage")}
              placeholder="https://example.com/image.jpg"
            />
            {article.featuredImage && (
              <div className="mt-3">
                <img
                  src={article.featuredImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>
          
          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-display font-semibold mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <FormField
                label="SEO Title"
                value={article.seoTitle}
                onChange={handleInputChange("seoTitle")}
                placeholder="Optimized title for search engines"
              />
              <FormField
                label="SEO Description"
                type="textarea"
                value={article.seoDescription}
                onChange={handleInputChange("seoDescription")}
                placeholder="Meta description for search results"
                rows={3}
              />
              <FormField
                label="Keywords"
                value={article.seoKeywords}
                onChange={handleInputChange("seoKeywords")}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor