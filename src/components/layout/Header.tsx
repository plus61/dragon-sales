'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Phase } from "@/types/script"

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
  onExportPDF?: () => void
}

export function Header({ currentPhase, onPracticeMode, onExportPDF }: HeaderProps) {
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
        </div>

        <div className="flex items-center gap-2">
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
              練習モード
            </Button>
          )}
          {onExportPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="border-neon-secondary/30 hover:border-neon-secondary/60 hover:bg-neon-secondary/10"
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              PDF出力
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
