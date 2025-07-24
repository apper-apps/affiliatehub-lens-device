import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  icon = "FileText"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-accent" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-secondary mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} size="lg">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty