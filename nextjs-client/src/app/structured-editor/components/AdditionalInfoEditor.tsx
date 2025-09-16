'use client'

import { useState, useCallback } from 'react'
import { AdditionalInfo, AdditionalInfoItem, Link } from '../types'
import LinkEditor from './LinkEditor'

interface AdditionalInfoEditorProps {
  additionalInfo: AdditionalInfo[]
  onUpdate: (additionalInfo: AdditionalInfo[]) => void
}

export default function AdditionalInfoEditor({ additionalInfo, onUpdate }: AdditionalInfoEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  // Migrate old data structure to new structure
  const migrateAdditionalInfo = (info: AdditionalInfo[]): AdditionalInfo[] => {
    return info.map(category => ({
      ...category,
      items: category.items.map((item, index) => {
        // If item is a string (old format), convert to new format
        if (typeof item === 'string') {
          return {
            id: `item_${Date.now()}_${index}`,
            text: item,
            links: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
        // If item is already an object but missing links, add empty links array
        return {
          ...item,
          links: item.links || []
        }
      })
    }))
  }

  const migratedAdditionalInfo = migrateAdditionalInfo(additionalInfo)

  const addCategory = useCallback(() => {
    const newCategory: AdditionalInfo = {
      id: `info_${Date.now()}`,
      category: '',
      items: [],
      order: migratedAdditionalInfo.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    onUpdate([...migratedAdditionalInfo, newCategory])
    setEditingId(newCategory.id)
  }, [migratedAdditionalInfo, onUpdate])

  const updateCategory = useCallback((id: string, updates: Partial<AdditionalInfo>) => {
    const updated = migratedAdditionalInfo.map(info => 
      info.id === id ? { ...info, ...updates, updated_at: new Date().toISOString() } : info
    )
    onUpdate(updated)
  }, [migratedAdditionalInfo, onUpdate])

  const deleteCategory = useCallback((id: string) => {
    const updated = migratedAdditionalInfo.filter(info => info.id !== id)
    onUpdate(updated)
    if (editingId === id) {
      setEditingId(null)
    }
  }, [migratedAdditionalInfo, onUpdate, editingId])

  const addItem = useCallback((categoryId: string) => {
    const category = migratedAdditionalInfo.find(info => info.id === categoryId)
    if (!category) return

    const newItem: AdditionalInfoItem = {
      id: `item_${Date.now()}`,
      text: '',
      links: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    updateCategory(categoryId, {
      items: [...category.items, newItem]
    })
  }, [migratedAdditionalInfo, updateCategory])

  const updateItem = useCallback((categoryId: string, itemId: string, updates: Partial<AdditionalInfoItem>) => {
    const category = migratedAdditionalInfo.find(info => info.id === categoryId)
    if (!category) return

    const updatedItems = category.items.map(item => 
      item.id === itemId 
        ? { ...item, ...updates, updated_at: new Date().toISOString() }
        : item
    )
    updateCategory(categoryId, { items: updatedItems })
  }, [migratedAdditionalInfo, updateCategory])

  const deleteItem = useCallback((categoryId: string, itemId: string) => {
    const category = migratedAdditionalInfo.find(info => info.id === categoryId)
    if (!category) return

    const updatedItems = category.items.filter(item => item.id !== itemId)
    updateCategory(categoryId, { items: updatedItems })
  }, [migratedAdditionalInfo, updateCategory])

  const updateItemLinks = useCallback((categoryId: string, itemId: string, links: Link[]) => {
    updateItem(categoryId, itemId, { links })
  }, [updateItem])

  return (
    <div className="space-y-4">
      {/* Add Category Button */}
      <button
        onClick={addCategory}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Category</span>
        </div>
      </button>

      {/* Category List */}
      {migratedAdditionalInfo.map((info, index) => (
        <div key={info.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              {info.category || 'New Category'} ({info.items.length} items)
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditingId(editingId === info.id ? null : info.id)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {editingId === info.id ? 'Done' : 'Edit'}
              </button>
              <button
                onClick={() => deleteCategory(info.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          {editingId === info.id && (
            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={info.category}
                  onChange={(e) => updateCategory(info.id, { category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Skills, Certifications, Languages, etc."
                />
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Items
                  </label>
                  <button
                    onClick={() => addItem(info.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {info.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700">Item</h5>
                        <button
                          onClick={() => deleteItem(info.id, item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete Item
                        </button>
                      </div>
                      <LinkEditor
                        links={item.links}
                        onLinksUpdate={(links) => updateItemLinks(info.id, item.id, links)}
                        text={item.text}
                        onTextUpdate={(text) => updateItem(info.id, item.id, { text })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Display items when not editing */}
          {editingId !== info.id && info.items.length > 0 && (
            <div className="mt-2">
              <div className="space-y-2">
                {info.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-2 rounded">
                    {item.links.length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-sm text-gray-700">{item.text}</span>
                        <div className="flex flex-wrap gap-1">
                          {item.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-xs"
                            >
                              {link.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
