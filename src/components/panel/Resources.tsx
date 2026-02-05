'use client'

import { type Resource, type ResourceType } from '@/types/script'

const resourceIcons: Record<ResourceType, string> = {
  pptx: '📊',
  pdf: '📄',
  video: '🎬',
  image: '🖼️',
  link: '🔗',
}

const resourceLabels: Record<ResourceType, string> = {
  pptx: 'PowerPoint',
  pdf: 'PDF',
  video: '動画',
  image: '画像',
  link: 'リンク',
}

interface ResourcesProps {
  resources: Resource[]
}

export function Resources({ resources }: ResourcesProps) {
  if (resources.length === 0) return null

  const handleOpenResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">📎</span>
        <h3 className="text-sm font-semibold text-foreground">関連資料</h3>
      </div>

      <div className="grid gap-2">
        {resources.map((resource) => (
          <button
            key={resource.id}
            onClick={() => handleOpenResource(resource.url)}
            className="group flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/40 hover:border-primary/50 transition-all text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-xl">
              {resourceIcons[resource.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {resourceLabels[resource.type]}
                </span>
              </div>
              {resource.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {resource.description}
                </p>
              )}
              {resource.timing && (
                <p className="text-xs text-primary/80 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {resource.timing}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
