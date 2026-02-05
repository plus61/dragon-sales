'use client'

import { cn } from "@/lib/utils"
import { type Phase } from "@/types/script"

const phases: { id: Phase; label: string }[] = [
  { id: "opening", label: "開始" },
  { id: "hearing", label: "ヒアリング" },
  { id: "proposal", label: "提案" },
  { id: "closing", label: "クロージング" },
  { id: "followup", label: "フォローアップ" },
]

interface ProgressBarProps {
  currentPhase: Phase
  onPhaseClick?: (phase: Phase) => void
}

export function ProgressBar({ currentPhase, onPhaseClick }: ProgressBarProps) {
  const currentIndex = phases.findIndex((p) => p.id === currentPhase)

  return (
    <div className="w-full bg-card/50 border-t border-border/40 py-3 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-neon-primary to-neon-secondary -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(currentIndex / (phases.length - 1)) * 100}%`,
            }}
          />

          {phases.map((phase, index) => {
            const isActive = phase.id === currentPhase
            const isPast = index < currentIndex
            const isFuture = index > currentIndex

            return (
              <button
                key={phase.id}
                onClick={() => onPhaseClick?.(phase.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-1 transition-all duration-300",
                  onPhaseClick && "cursor-pointer hover:scale-105"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isActive &&
                      "bg-neon-primary text-white shadow-lg shadow-neon-primary/50",
                    isPast &&
                      "bg-neon-primary/80 text-white",
                    isFuture &&
                      "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  {isPast ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap transition-colors duration-300",
                    isActive && "text-foreground",
                    isPast && "text-muted-foreground",
                    isFuture && "text-muted-foreground/60"
                  )}
                >
                  {phase.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
