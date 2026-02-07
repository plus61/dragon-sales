'use client'

import { useState, useMemo, useCallback } from 'react'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { type ScriptNode } from '@/types/script'

export interface SearchResult {
  node: ScriptNode
  matchType: 'title' | 'script' | 'qa' | 'checkpoint'
  matchText: string
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return []

    const searchTerm = query.toLowerCase()
    const matches: SearchResult[] = []

    scriptNodes.forEach((node) => {
      // Search in title
      if (node.title.toLowerCase().includes(searchTerm)) {
        matches.push({
          node,
          matchType: 'title',
          matchText: node.title,
        })
        return // Only one match per node
      }

      // Search in main script
      if (node.script.main.toLowerCase().includes(searchTerm)) {
        const startIndex = node.script.main.toLowerCase().indexOf(searchTerm)
        const contextStart = Math.max(0, startIndex - 30)
        const contextEnd = Math.min(node.script.main.length, startIndex + searchTerm.length + 30)
        const matchText = node.script.main.slice(contextStart, contextEnd)

        matches.push({
          node,
          matchType: 'script',
          matchText: (contextStart > 0 ? '...' : '') + matchText + (contextEnd < node.script.main.length ? '...' : ''),
        })
        return
      }

      // Search in Q&A
      for (const qa of node.qa) {
        if (
          qa.question.toLowerCase().includes(searchTerm) ||
          qa.answer.toLowerCase().includes(searchTerm)
        ) {
          matches.push({
            node,
            matchType: 'qa',
            matchText: qa.question,
          })
          return
        }
      }

      // Search in checkpoints
      for (const checkpoint of node.checkpoints) {
        if (checkpoint.toLowerCase().includes(searchTerm)) {
          matches.push({
            node,
            matchType: 'checkpoint',
            matchText: checkpoint,
          })
          return
        }
      }
    })

    return matches
  }, [query])

  const openSearch = useCallback(() => setIsOpen(true), [])
  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setQuery('')
  }, [])
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    query,
    setQuery,
    results,
    isOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  }
}
