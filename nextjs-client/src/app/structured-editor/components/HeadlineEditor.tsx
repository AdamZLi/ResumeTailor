'use client'

import { useState, useEffect } from 'react'
import { Headline, SocialLink } from '../types'

interface HeadlineEditorProps {
  headline: Headline
  onUpdate: (headline: Headline) => void
}

export default function HeadlineEditor({ headline, onUpdate }: HeadlineEditorProps) {
  const [formData, setFormData] = useState({
    name: headline.name,
    summary: headline.summary || '',
    email: headline.contact.email || '',
    phone: headline.contact.phone || '',
    linkedin: headline.contact.linkedin || ''
  })

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    headline.social_links || [
      { platform: 'linkedin', url: headline.contact.linkedin || '', is_active: !!headline.contact.linkedin },
      { platform: 'medium', url: '', is_active: false },
      { platform: 'github', url: '', is_active: false }
    ]
  )

  useEffect(() => {
    const updatedHeadline: Headline = {
      ...headline,
      name: formData.name,
      title: '', // Always empty since we removed the field
      summary: formData.summary || undefined,
      contact: {
        ...(formData.email && { email: formData.email }),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.linkedin && { linkedin: formData.linkedin })
      },
      social_links: socialLinks
    }
    
    // Only call onUpdate if the headline actually changed
    if (JSON.stringify(headline) !== JSON.stringify(updatedHeadline)) {
      onUpdate(updatedHeadline)
    }
  }, [formData, socialLinks]) // Depend on both formData and socialLinks

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: 'linkedin' | 'medium' | 'github', field: 'url' | 'is_active', value: string | boolean) => {
    setSocialLinks(prev => 
      prev.map(link => 
        link.platform === platform 
          ? { ...link, [field]: value }
          : link
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Summary
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={2}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief professional summary (optional)"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.summary.length}/200 characters
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Email & Phone */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>


        {/* Right Column - Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Links
          </label>
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div key={link.platform} className="flex items-center space-x-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={link.is_active}
                    onChange={(e) => handleSocialLinkChange(link.platform, 'is_active', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700 capitalize">
                    {link.platform}
                  </label>
                </div>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(link.platform, 'url', e.target.value)}
                  disabled={!link.is_active}
                  className={`flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !link.is_active ? 'bg-gray-100 text-gray-400' : ''
                  }`}
                  placeholder={`https://${link.platform}.com/username`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
