'use client'

import { useState } from 'react'
import { StructuredResume } from '../types'

interface LivePreviewProps {
  resume: StructuredResume
}

type PreviewMode = 'formatted' | 'raw'

export default function LivePreview({ resume }: LivePreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('formatted')
  const [zoomLevel, setZoomLevel] = useState(100)
  
  console.log("LivePreview received resume:", resume)

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    if (!startDate) return ''
    
    if (isCurrent || endDate === 'Present' || endDate === 'Current') {
      return `${startDate} - Present`
    } else if (endDate) {
      return `${startDate} - ${endDate}`
    } else {
      return startDate
    }
  }

  const formatContactInfo = (contact: Record<string, string>) => {
    const parts = []
    if (contact.email) parts.push(contact.email)
    if (contact.phone) parts.push(contact.phone)
    if (contact.location) parts.push(contact.location)
    if (contact.linkedin) parts.push(contact.linkedin)
    return parts.join(' | ')
  }

  const formatContactInfoWithLinks = (contact: Record<string, string>, socialLinks: any[] = []) => {
    console.log('formatContactInfoWithLinks called with contact:', contact)
    
    const parts = []
    if (contact.email) parts.push(
      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800 underline">
        {contact.email}
      </a>
    )
    if (contact.phone) parts.push(
      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800 underline">
        {contact.phone}
      </a>
    )
    if (contact.location) parts.push(contact.location)
    // Add social links
    socialLinks.forEach(link => {
      if (link.is_active && link.url) {
        parts.push(
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
            {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
          </a>
        )
      }
    })
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && ' | '}
      </span>
    ))
  }

  const formatTextWithLinks = (text: string) => {
    // Debug logging
    console.log('formatTextWithLinks called with text:', text)
    
    // Known blog post mappings
    const blogMappings: Record<string, string> = {
      'What Makes a Great Product Manager': 'https://medium.com/@adamziyongli/what-makes-a-great-product-manager',
      'Product Requirement Documentation Guidebook': 'https://medium.com/@adamziyongli/product-requirement-documentation-guidebook',
      'What Makes a Great Product Manager, Product Requirement Documentation Guidebook': 'https://medium.com/@adamziyongli/what-makes-a-great-product-manager',
      'GA Snapshot Support': 'https://github.com/adamziyongli/ga-snapshot-support',
      'GA Snapshot Support Link': 'https://github.com/adamziyongli/ga-snapshot-support'
    }

    // Check if the entire text matches a known blog post
    if (blogMappings[text]) {
      console.log('Found exact match for:', text)
      return (
        <a 
          href={blogMappings[text]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {text}
        </a>
      )
    }

    // Handle comma-separated blog titles
    if (text.includes('What Makes a Great Product Manager') && text.includes('Product Requirement Documentation Guidebook')) {
      const parts = text.split(', ')
      return (
        <span>
          <a 
            href="https://medium.com/@adamziyongli/what-makes-a-great-product-manager" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            What Makes a Great Product Manager
          </a>
          , <a 
            href="https://medium.com/@adamziyongli/product-requirement-documentation-guidebook" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Product Requirement Documentation Guidebook
          </a>
        </span>
      )
    }

    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
            <p className="text-xs text-gray-600 mt-1">Real-time preview of your resume</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode('formatted')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  previewMode === 'formatted'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Formatted
              </button>
              <button
                onClick={() => setPreviewMode('raw')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  previewMode === 'raw'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Raw Text
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="px-2 py-1 rounded text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300"
              >
                -
              </button>
              <span className="text-xs text-gray-600 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="px-2 py-1 rounded text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 rounded text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Responsive resume preview */}
      <div className="flex-1 p-4 overflow-hidden w-full">
        {previewMode === 'formatted' ? (
          <div className="h-full flex justify-center items-center w-full max-w-full">
            <div className="bg-white shadow-lg border-2 border-gray-400 overflow-hidden" 
                 style={{ 
                   width: '100%',
                   height: '100%',
                   maxWidth: 'min(8.5in, 100%)',
                   maxHeight: 'min(11in, 100%)',
                   aspectRatio: '8.5/11',
                   padding: '0.5in',
                   boxSizing: 'border-box',
                   position: 'relative',
                   transform: `scale(${zoomLevel / 100})`,
                   transformOrigin: 'center'
                 }}>
              {/* Page Border Indicator */}
              <div className="absolute inset-0 pointer-events-none" 
                   style={{ 
                     border: '1px dashed #ccc',
                     margin: '0.5in',
                     width: 'calc(100% - 1in)',
                     height: 'calc(100% - 1in)',
                     boxSizing: 'border-box'
                   }}>
              </div>
              
              {/* Header Section */}
              <div className="py-1 border-b border-gray-200 relative z-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
                  {resume.headline.name}
                </h1>
                {resume.headline.summary && (
                  <p className="text-xs text-gray-700 mb-0.5 leading-tight">
                    {resume.headline.summary}
                  </p>
                )}
                <div className="text-xs text-gray-600">
                  {formatContactInfoWithLinks(resume.headline.contact, resume.headline.social_links || [])}
                </div>
              </div>

              <div className="py-1 space-y-1 overflow-y-auto relative z-10" style={{ height: 'calc(11in - 60px)' }}>
                {/* Work Experience */}
                {resume.work_experience.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-gray-900 mb-0.5 pb-0 border-b border-gray-300">
                      PROFESSIONAL EXPERIENCE
                    </h3>
                    <div className="space-y-0.5">
                      {resume.work_experience.map((exp) => (
                        <div key={exp.id} className="mb-1">
                          <div className="flex justify-between items-start mb-0">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-900 text-xs">
                                  {exp.title}
                                </h4>
                                <div className="text-xs text-gray-600 text-right">
                                  {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                </div>
                              </div>
                              <div className="flex justify-between items-start">
                                <p className="text-gray-700 text-xs font-medium">
                                  {exp.company}
                                </p>
                                {exp.location && (
                                  <div className="text-xs text-gray-600 text-right">
                                    {exp.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {exp.bullets.filter(bullet => bullet.is_active).length > 0 && (
                            <ul className="list-disc list-inside space-y-0 ml-2">
                              {exp.bullets
                                .filter(bullet => bullet.is_active)
                                .map((bullet) => (
                                  <li key={bullet.id} className="text-gray-700 text-xs leading-none mb-0.5">
                                    {(bullet.links || []).length > 0 ? (
                                      <span>
                                        {bullet.text}
                                        {(bullet.links || []).map((link, linkIndex) => (
                                          <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline ml-1"
                                          >
                                            {link.text}
                                          </a>
                                        ))}
                                      </span>
                                    ) : (
                                      formatTextWithLinks(bullet.text)
                                    )}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Entrepreneurship */}
                {resume.entrepreneurship.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-gray-900 mb-0.5 pb-0 border-b border-gray-300">
                      ENTREPRENEURSHIP
                    </h3>
                    <div className="space-y-0.5">
                      {resume.entrepreneurship.map((ent) => (
                        <div key={ent.id}>
                          <div className="flex justify-between items-start mb-0">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-xs">
                                {ent.title}
                              </h4>
                              <p className="text-gray-700 text-xs font-medium">
                                {ent.company}
                                {ent.location && `, ${ent.location}`}
                              </p>
                            </div>
                            <div className="text-xs text-gray-600 text-right">
                              {formatDateRange(ent.start_date, ent.end_date, ent.is_current)}
                            </div>
                          </div>
                          {ent.bullets.filter(bullet => bullet.is_active).length > 0 && (
                            <ul className="list-disc list-inside space-y-0 ml-2">
                              {ent.bullets
                                .filter(bullet => bullet.is_active)
                                .map((bullet) => (
                                  <li key={bullet.id} className="text-gray-700 text-xs leading-none mb-0.5">
                                    {formatTextWithLinks(bullet.text)}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-gray-900 mb-0.5 pb-0 border-b border-gray-300">
                      EDUCATION
                    </h3>
                    <div className="space-y-0.5">
                      {resume.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-0">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-xs">
                                {edu.degree}
                              </h4>
                              <p className="text-gray-700 text-xs font-medium">
                                {edu.institution}
                                {edu.location && `, ${edu.location}`}
                              </p>
                            </div>
                            <div className="text-xs text-gray-600 text-right">
                              {formatDateRange(edu.start_date, edu.end_date)}
                            </div>
                          </div>
                          {edu.gpa && (
                            <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                          )}
                          {edu.extras.length > 0 && (
                            <ul className="list-disc list-inside space-y-0.5 ml-3 mt-1">
                              {edu.extras.map((extra, index) => (
                                <li key={index} className="text-gray-700 text-xs leading-tight">
                                  {formatTextWithLinks(extra)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Additional Information */}
                {resume.additional_info.length > 0 && (
                  <section>
                    <h3 className="text-xs font-semibold text-gray-900 mb-0.5 pb-0 border-b border-gray-300">
                      ADDITIONAL INFORMATION
                    </h3>
                    <div className="space-y-0.5">
                      {resume.additional_info.map((info) => (
                        <div key={info.id}>
                          <h4 className="font-semibold text-gray-900 mb-0.5 text-xs">
                            {info.category}
                          </h4>
                          <div className="flex flex-wrap gap-0">
                            {info.items.map((item, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs"
                              >
                                {(item.links || []).length > 0 ? (
                                  <span>
                                    {item.text}
                                    {(item.links || []).map((link, linkIndex) => (
                                      <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline ml-1"
                                      >
                                        {link.text}
                                      </a>
                                    ))}
                                  </span>
                                ) : (
                                  item.text
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Text Output</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {generateRawText(resume)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateRawText(resume: StructuredResume): string {
  let text = ''
  
  // Header
  text += `${resume.headline.name}\n`
  text += `${resume.headline.title}\n`
  if (resume.headline.summary) {
    text += `${resume.headline.summary}\n`
  }
  
  const contactParts = []
  if (resume.headline.contact.email) contactParts.push(resume.headline.contact.email)
  if (resume.headline.contact.phone) contactParts.push(resume.headline.contact.phone)
  if (resume.headline.contact.location) contactParts.push(resume.headline.contact.location)
  if (resume.headline.contact.linkedin) contactParts.push(resume.headline.contact.linkedin)
  if (contactParts.length > 0) {
    text += `${contactParts.join(' | ')}\n`
  }
  
  text += '\n'
  
  // Work Experience
  if (resume.work_experience.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n'
    text += '=====================\n\n'
    
    resume.work_experience.forEach(exp => {
      text += `${exp.title}\n`
      text += `${exp.company}`
      if (exp.location) text += `, ${exp.location}`
      text += '\n'
      
      if (exp.start_date) {
        const endDate = exp.is_current ? 'Present' : exp.end_date
        text += `${exp.start_date} - ${endDate}\n`
      }
      
      exp.bullets.filter(bullet => bullet.is_active).forEach(bullet => {
        text += `• ${bullet.text}\n`
      })
      text += '\n'
    })
  }
  
  // Entrepreneurship
  if (resume.entrepreneurship.length > 0) {
    text += 'ENTREPRENEURSHIP\n'
    text += '================\n\n'
    
    resume.entrepreneurship.forEach(ent => {
      text += `${ent.title}\n`
      text += `${ent.company}`
      if (ent.location) text += `, ${ent.location}`
      text += '\n'
      
      if (ent.start_date) {
        const endDate = ent.is_current ? 'Present' : ent.end_date
        text += `${ent.start_date} - ${endDate}\n`
      }
      
      ent.bullets.filter(bullet => bullet.is_active).forEach(bullet => {
        text += `• ${bullet.text}\n`
      })
      text += '\n'
    })
  }
  
  // Education
  if (resume.education.length > 0) {
    text += 'EDUCATION\n'
    text += '=========\n\n'
    
    resume.education.forEach(edu => {
      text += `${edu.degree}\n`
      text += `${edu.institution}`
      if (edu.location) text += `, ${edu.location}`
      text += '\n'
      
      if (edu.start_date) {
        text += `${edu.start_date} - ${edu.end_date || 'Present'}\n`
      }
      
      if (edu.gpa) {
        text += `GPA: ${edu.gpa}\n`
      }
      
      edu.extras.forEach(extra => {
        text += `• ${extra}\n`
      })
      text += '\n'
    })
  }
  
  // Additional Information
  if (resume.additional_info.length > 0) {
    text += 'ADDITIONAL INFORMATION\n'
    text += '=====================\n\n'
    
    resume.additional_info.forEach(info => {
      text += `${info.category}\n`
      text += `${info.items.join(', ')}\n\n`
    })
  }
  
  return text.trim()
}
