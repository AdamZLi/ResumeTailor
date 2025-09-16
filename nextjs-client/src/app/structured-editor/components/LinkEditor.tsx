'use client'

import { useState } from 'react'
import { Link } from '../types'

interface LinkEditorProps {
  links: Link[]
  onLinksUpdate: (links: Link[]) => void
  text: string
  onTextUpdate: (text: string) => void
}

export default function LinkEditor({ links, onLinksUpdate, text, onTextUpdate }: LinkEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newLinkText, setNewLinkText] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  const addLink = () => {
    if (newLinkText.trim() && newLinkUrl.trim()) {
      const newLink: Link = {
        id: `link_${Date.now()}`,
        text: newLinkText.trim(),
        url: newLinkUrl.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      onLinksUpdate([...links, newLink])
      setNewLinkText('')
      setNewLinkUrl('')
      setIsEditing(false)
    }
  }

  const removeLink = (linkId: string) => {
    onLinksUpdate(links.filter(link => link.id !== linkId))
  }

  const updateLink = (linkId: string, updatedLink: Partial<Link>) => {
    onLinksUpdate(links.map(link => 
      link.id === linkId 
        ? { ...link, ...updatedLink, updated_at: new Date().toISOString() }
        : link
    ))
  }

  const renderTextWithLinks = () => {
    if (links.length === 0) {
      return <span>{text}</span>
    }

    let result = text
    const linkElements: JSX.Element[] = []
    
    // Sort links by position in text (longest first to avoid partial matches)
    const sortedLinks = [...links].sort((a, b) => b.text.length - a.text.length)
    
    sortedLinks.forEach((link, index) => {
      const linkIndex = result.indexOf(link.text)
      if (linkIndex !== -1) {
        const beforeText = result.substring(0, linkIndex)
        const afterText = result.substring(linkIndex + link.text.length)
        
        linkElements.push(
          <span key={`before-${index}`}>{beforeText}</span>
        )
        linkElements.push(
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {link.text}
          </a>
        )
        
        result = afterText
      }
    })
    
    if (result) {
      linkElements.push(<span key="after">{result}</span>)
    }
    
    return <span>{linkElements}</span>
  }

  return (
    <div className="space-y-2">
      {/* Single text area with link preview */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Text Content
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextUpdate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="Enter your text here..."
          rows={2}
        />
      </div>

      {/* Links management */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Links ({links.length})</h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            {isEditing ? 'Cancel' : 'Add Link'}
          </button>
        </div>

        {/* Add new link form */}
        {isEditing && (
          <div className="p-3 border border-gray-200 rounded bg-white space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
                placeholder="Text to link"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addLink}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Link
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setNewLinkText('')
                  setNewLinkUrl('')
                }}
                className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Existing links */}
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">
                {link.text}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {link.url}
              </div>
            </div>
            <button
              onClick={() => removeLink(link.id)}
              className="ml-2 text-xs text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
