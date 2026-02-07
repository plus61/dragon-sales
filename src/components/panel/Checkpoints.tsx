'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface CheckpointsProps {
  checkpoints: string[]
  sessionId?: string
  nodeId?: string
  persistedStates?: boolean[] | null
  onCheckpointChange?: (nodeId: string, index: number, checked: boolean) => void
}

export function Checkpoints({
  checkpoints,
  sessionId,
  nodeId,
  persistedStates,
  onCheckpointChange,
}: CheckpointsProps) {
  // Local state fallback when no session is active
  const [localChecked, setLocalChecked] = useState<boolean[]>(
    new Array(checkpoints.length).fill(false)
  )

  const checked = useMemo(() => {
    if (sessionId && persistedStates && persistedStates.length === checkpoints.length) {
      return persistedStates
    }
    return localChecked
  }, [sessionId, persistedStates, localChecked, checkpoints.length])

  const toggleCheckpoint = (index: number) => {
    const newValue = !checked[index]
    if (sessionId && nodeId && onCheckpointChange) {
      onCheckpointChange(nodeId, index, newValue)
    } else {
      setLocalChecked((prev) => {
        const newChecked = [...prev]
        newChecked[index] = newValue
        return newChecked
      })
    }
  }

  if (checkpoints.length === 0) return null

  const completedCount = checked.filter(Boolean).length
  const progress = (completedCount / checkpoints.length) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-semibold text-foreground">チェックポイント</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{checkpoints.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-primary to-neon-secondary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checkpoints list */}
      <ul className="space-y-2">
        {checkpoints.map((checkpoint, index) => (
          <li key={index}>
            <button
              onClick={() => toggleCheckpoint(index)}
              className={cn(
                'w-full flex items-start gap-3 p-2 rounded-lg transition-all duration-200',
                'hover:bg-muted/50',
                checked[index] && 'bg-success/10'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                  checked[index]
                    ? 'bg-success border-success'
                    : 'border-muted-foreground/40'
                )}
              >
                {checked[index] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  'text-sm text-left transition-colors duration-200',
                  checked[index]
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground/90'
                )}
              >
                {checkpoint}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
