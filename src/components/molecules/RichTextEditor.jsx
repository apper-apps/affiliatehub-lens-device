import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const [selectedText, setSelectedText] = useState("")
  
  const handleTextSelection = () => {
    const selection = window.getSelection()
    setSelectedText(selection.toString())
  }
  
  const applyFormatting = (format) => {
    const textarea = document.getElementById("editor-textarea")
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let formattedText = ""
    
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "heading":
        formattedText = `## ${selectedText}`
        break
      case "link":
        formattedText = `[${selectedText}](url)`
        break
      case "list":
        formattedText = `- ${selectedText}`
        break
      default:
        formattedText = selectedText
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange({ target: { value: newValue } })
    
    // Restore focus
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + formattedText.length)
    }, 0)
  }
  
  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      const imageMarkdown = `\n\n![Image](${url})\n\n`
      const textarea = document.getElementById("editor-textarea")
      const position = textarea.selectionStart
      const newValue = value.substring(0, position) + imageMarkdown + value.substring(position)
      onChange({ target: { value: newValue } })
    }
  }
  
  const toolbarButtons = [
    { icon: "Bold", action: () => applyFormatting("bold"), tooltip: "Bold" },
    { icon: "Italic", action: () => applyFormatting("italic"), tooltip: "Italic" },
    { icon: "Heading2", action: () => applyFormatting("heading"), tooltip: "Heading" },
    { icon: "Link", action: () => applyFormatting("link"), tooltip: "Link" },
    { icon: "List", action: () => applyFormatting("list"), tooltip: "List" },
    { icon: "Image", action: insertImage, tooltip: "Image" }
  ]
  
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="text-gray-600 hover:text-secondary hover:bg-white"
              title={button.tooltip}
            >
              <ApperIcon name={button.icon} className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
      
      {/* Editor */}
      <textarea
        id="editor-textarea"
        value={value}
        onChange={onChange}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
        placeholder={placeholder}
        className="w-full h-96 p-4 text-sm font-body resize-none focus:outline-none"
      />
      
      {/* Preview hint */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>**bold** *italic* ## heading</span>
          <span>[link](url)</span>
          <span>![image](url)</span>
        </div>
      </div>
    </div>
  )
}

export default RichTextEditor