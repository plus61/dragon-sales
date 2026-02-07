'use client'

import dynamic from 'next/dynamic'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Phase } from "@/types/script"
import { SessionSelector } from "@/components/session/SessionSelector"
import { type SessionSummary } from "@/types/session"

// Dynamically import PDFDownloadButton to avoid SSR issues with @react-pdf/renderer
const PDFDownloadButton = dynamic(
  () => import('@/features/pdf/DownloadButton').then(mod => mod.PDFDownloadButton),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-neon-secondary/30"
      >
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        読込中...
      </Button>
    ),
  }
)

const phaseLabels: Record<Phase, string> = {
  opening: "開始",
  hearing: "ヒアリング",
  proposal: "提案",
  closing: "クロージング",
  followup: "フォローアップ",
}

const phaseColors: Record<Phase, string> = {
  opening: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  hearing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  proposal: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  closing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  followup: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

interface HeaderProps {
  currentPhase?: Phase
  onPracticeMode?: () => void
  onOpenSearch?: () => void
  showPDFButton?: boolean
  sessionProps?: {
    currentSessionName?: string
    summaries: SessionSummary[]
    onCreateSession: (companyName: string, contactPerson?: string) => void
    onSelectSession: (sessionId: string) => void
    onClearSession: () => void
    onDeleteSession: (sessionId: string) => void
    onOpenHistory: () => void
    isCreateDialogOpen?: boolean
    onCreateDialogChange?: (open: boolean) => void
    isSelectDialogOpen?: boolean
    onSelectDialogChange?: (open: boolean) => void
    currentCompletionRate?: number
  }
}

export function Header({ currentPhase, onPracticeMode, onOpenSearch, showPDFButton = true, sessionProps }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="neon-text">Dragon</span>
            <span className="text-muted-foreground ml-1">Sales</span>
          </h1>
          {currentPhase && (
            <Badge
              variant="outline"
              className={`${phaseColors[currentPhase]} font-medium`}
            >
              {phaseLabels[currentPhase]}
            </Badge>
          )}
          {sessionProps && (
            <SessionSelector {...sessionProps} />
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          {onOpenSearch && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSearch}
              className="border-border/40 hover:border-border hover:bg-muted/50"
            >
              <svg
                className="mr-2 h-4 w-4"
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
              <span className="hidden sm:inline">検索</span>
              <kbd className="hidden md:inline-flex ml-2 h-5 items-center gap-1 rounded border border-border/40 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
          )}

          {onPracticeMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPracticeMode}
              className="border-neon-primary/30 hover:border-neon-primary/60 hover:bg-neon-primary/10"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="hidden sm:inline">練習モード</span>
            </Button>
          )}
          {showPDFButton && (
            <PDFDownloadButton
              variant="outline"
              size="sm"
              className="border-neon-secondary/30 hover:border-neon-secondary/60 hover:bg-neon-secondary/10"
            />
          )}
        </div>
      </div>
    </header>
  )
}
