import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const AffiliateButton = ({ text = "Join Domestika", link = "#", className = "" }) => {
  const handleClick = () => {
    if (link && link !== "#") {
      window.open(link, "_blank", "noopener,noreferrer")
    }
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Button
        onClick={handleClick}
        className="bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-gentle"
        size="lg"
      >
        <ApperIcon name="ExternalLink" className="w-5 h-5 mr-2" />
        {text}
      </Button>
    </motion.div>
  )
}

export default AffiliateButton