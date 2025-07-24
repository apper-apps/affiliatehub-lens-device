import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white",
    secondary: "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-secondary hover:bg-gray-100",
    destructive: "bg-gradient-to-r from-error to-error/90 hover:from-error/90 hover:to-error text-white"
  }
  
  const sizes = {
    default: "h-10 px-6 py-2 text-sm",
    sm: "h-8 px-4 py-1 text-xs",
    lg: "h-12 px-8 py-3 text-base",
    icon: "h-10 w-10 p-0"
  }
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 active:scale-95 shadow-lg hover:shadow-xl",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button