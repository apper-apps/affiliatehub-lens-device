import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error = "", 
  className = "",
  rows,
  ...props 
}) => {
  const InputComponent = type === "textarea" ? Textarea : Input
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={props.id}>
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Label>
      <InputComponent
        type={type === "textarea" ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={error ? "border-error focus-visible:ring-error" : ""}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default FormField