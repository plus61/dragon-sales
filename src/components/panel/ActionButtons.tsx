'use client'

import { Button } from '@/components/ui/button'
import { type Action, type ActionStyle } from '@/types/script'
import { cn } from '@/lib/utils'

interface ActionButtonsProps {
  actions: Action[]
  onAction: (nextNodeId: string) => void
}

const styleClasses: Record<ActionStyle, string> = {
  primary:
    'bg-neon-primary hover:bg-neon-primary/90 text-white border-neon-primary shadow-lg shadow-neon-primary/20',
  secondary:
    'bg-muted hover:bg-muted/80 text-foreground border-border/40',
  warning:
    'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/40',
}

export function ActionButtons({ actions, onAction }: ActionButtonsProps) {
  if (actions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <h3 className="text-sm font-semibold text-foreground">次のアクション</h3>
      </div>

      <div className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              'w-full justify-start gap-2 h-auto py-3 px-4',
              'transition-all duration-200',
              styleClasses[action.style]
            )}
            onClick={() => onAction(action.nextNodeId)}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
