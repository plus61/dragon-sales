'use client'

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { cn } from '@/lib/utils'
import { type Phase } from '@/types/script'

export interface ScriptNodeData {
  label: string
  phase: Phase
  duration: string
  isSelected?: boolean
  checkpointTotal?: number
  checkpointCompleted?: number
  summary?: string
  hasResources?: boolean
}

interface ScriptNodeProps {
  data: ScriptNodeData
}

const phaseStyles: Record<Phase, { bg: string; border: string; glow: string }> = {
  opening: {
    bg: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/40',
    glow: 'shadow-emerald-500/30',
  },
  hearing: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/40',
    glow: 'shadow-blue-500/30',
  },
  proposal: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/40',
    glow: 'shadow-purple-500/30',
  },
  closing: {
    bg: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/40',
    glow: 'shadow-amber-500/30',
  },
  followup: {
    bg: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/40',
    glow: 'shadow-pink-500/30',
  },
}

const phaseLabels: Record<Phase, string> = {
  opening: 'OPENING',
  hearing: 'HEARING',
  proposal: 'PROPOSAL',
  closing: 'CLOSING',
  followup: 'FOLLOW-UP',
}

const phaseIcons: Record<Phase, React.ReactNode> = {
  opening: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  ),
  hearing: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  proposal: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  closing: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  followup: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

function getProgressColor(rate: number): string {
  if (rate === 0) return 'bg-muted-foreground/30'
  if (rate <= 50) return 'bg-amber-500'
  if (rate < 100) return 'bg-blue-500'
  return 'bg-emerald-500'
}

function ScriptNodeComponent({ data }: ScriptNodeProps) {
  const styles = phaseStyles[data.phase]
  const hasProgress = data.checkpointTotal != null && data.checkpointTotal > 0
  const progressRate = hasProgress
    ? Math.round(((data.checkpointCompleted ?? 0) / data.checkpointTotal!) * 100)
    : 0

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-neon-primary !border-2 !border-background"
      />

      <div
        className={cn(
          'min-w-[260px] max-w-[300px] p-4 rounded-xl',
          'bg-gradient-to-br',
          styles.bg,
          'border',
          styles.border,
          'backdrop-blur-sm',
          'transition-all duration-300',
          'hover:scale-[1.02]',
          data.isSelected
            ? `shadow-lg ${styles.glow} ring-2 ring-neon-primary/50`
            : 'hover:shadow-lg hover:shadow-neon-primary/20'
        )}
      >
        {/* Phase Label + Duration */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-neon-primary">{phaseIcons[data.phase]}</span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
              {phaseLabels[data.phase]}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {data.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-foreground leading-snug mb-1">
          {data.label}
        </h3>

        {/* Summary */}
        {data.summary && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-2 line-clamp-1">
            {data.summary}
          </p>
        )}

        {/* Progress bar (session active only) */}
        {hasProgress && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    getProgressColor(progressRate)
                  )}
                  style={{ width: `${progressRate}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground w-8 text-right">
                {progressRate}%
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/70">
              {data.checkpointCompleted ?? 0}/{data.checkpointTotal} チェック完了
            </p>
          </div>
        )}

        {/* Resource indicator + Click hint */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {data.hasResources && (
              <span className="text-[10px] text-muted-foreground/60 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                資料
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>詳細</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-neon-primary !border-2 !border-background"
      />
    </>
  )
}

export const ScriptNode = memo(ScriptNodeComponent)
