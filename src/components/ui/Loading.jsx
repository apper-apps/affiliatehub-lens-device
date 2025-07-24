import React from "react"
import { motion } from "framer-motion"

const Loading = ({ type = "page" }) => {
  if (type === "articles") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-32"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded w-28"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-3">
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-20"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (type === "article") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loading