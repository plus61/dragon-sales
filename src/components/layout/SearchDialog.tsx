'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { type SearchResult } from '@/hooks/useSearch'
import { type Phase } from '@/types/script'

const phaseLabels: Record<Phase, string> = {
  opening: '開始',
  hearing: 'ヒアリング',
  proposal: '提案',
  closing: 'クロージング',
  followup: 'フォローアップ',
}

const phaseColors: Record<Phase, string> = {
  opening: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  hearing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  proposal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  closing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  followup: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

const matchTypeLabels: Record<string, string> = {
  title: 'タイトル',
  script: 'スクリプト',
  qa: 'Q&A',
  checkpoint: 'チェックポイント',
}

interface SearchDialogProps {
  isOpen: boolean
  query: string
  results: SearchResult[]
  onQueryChange: (query: string) => void
  onClose: () => void
  onSelectResult: (nodeId: string) => void
}

export function SearchDialog({
  isOpen,
  query,
  results,
  onQueryChange,
  onClose,
  onSelectResult,
}: SearchDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelectResult = (nodeId: string) => {
    onSelectResult(nodeId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-20 -translate-x-1/2 w-full max-w-xl bg-card border border-border/40 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border/40">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="ノードを検索... (タイトル、スクリプト、Q&A)"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border/40 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.trim() === '' ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  検索キーワードを入力してください
                </div>
              ) : results.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  「{query}」に一致する結果が見つかりません
                </div>
              ) : (
                <div className="p-2">
                  {results.map((result) => (
                    <button
                      key={result.node.id}
                      onClick={() => handleSelectResult(result.node.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`${phaseColors[result.node.phase]} text-xs`}
                        >
                          {phaseLabels[result.node.phase]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {matchTypeLabels[result.matchType]}
                        </span>
                      </div>
                      <div className="font-medium text-foreground group-hover:text-neon-primary transition-colors">
                        {result.node.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {result.matchText}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border/40 bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{results.length} 件の結果</span>
                <span className="hidden md:inline">
                  <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
                  {' '}移動
                  <kbd className="ml-2 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd>
                  {' '}選択
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
