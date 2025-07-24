import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ArticleCard = ({ article, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("h-full", className)}
    >
      <Link to={`/article/${article.Id}`}>
        <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
          {article.featuredImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {article.status === "draft" && (
                <div className="absolute top-2 right-2 bg-warning text-white px-2 py-1 rounded-full text-xs font-medium">
                  Draft
                </div>
              )}
            </div>
          )}
          
          <CardContent className="p-6 flex-1">
            <h3 className="text-xl font-display font-semibold text-secondary mb-3 line-clamp-2 hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            {article.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{format(new Date(article.publishDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                <span>5 min read</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 pb-6 pt-0">
            <div className="flex items-center text-accent hover:text-info transition-colors text-sm font-medium">
              <span>Read More</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}

export default ArticleCard