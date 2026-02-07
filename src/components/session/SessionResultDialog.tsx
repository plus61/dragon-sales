'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { type SessionResult } from '@/types/session'
import { cn } from '@/lib/utils'

const outcomeOptions: { value: SessionResult['outcome']; label: string; icon: string; color: string }[] = [
  { value: 'won', label: '受注', icon: '🎉', color: 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20' },
  { value: 'next_meeting', label: '次回商談', icon: '📅', color: 'border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20' },
  { value: 'pending', label: '検討中', icon: '⏳', color: 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20' },
  { value: 'lost', label: '失注', icon: '😔', color: 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20' },
]

interface SessionResultDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (result: SessionResult) => void
  companyName?: string
}

export function SessionResultDialog({
  isOpen,
  onClose,
  onSubmit,
  companyName,
}: SessionResultDialogProps) {
  const [outcome, setOutcome] = useState<SessionResult['outcome'] | null>(null)
  const [revenue, setRevenue] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!outcome) return
    onSubmit({
      outcome,
      revenue: revenue ? Number(revenue) : undefined,
      nextAction: nextAction.trim() || undefined,
      notes: notes.trim() || undefined,
      completedAt: new Date().toISOString(),
    })
    setOutcome(null)
    setRevenue('')
    setNextAction('')
    setNotes('')
  }

  const handleClose = () => {
    setOutcome(null)
    setRevenue('')
    setNextAction('')
    setNotes('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-card border-border/40">
        <DialogHeader>
          <DialogTitle>商談結果の記録</DialogTitle>
          <DialogDescription>
            {companyName ? `${companyName} との` : ''}商談結果を記録してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Outcome Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              結果 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {outcomeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setOutcome(option.value)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border transition-all text-left',
                    outcome === option.value
                      ? `${option.color} ring-2 ring-neon-primary/50`
                      : 'border-border/40 hover:bg-muted/50'
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Revenue (show for won) */}
          {outcome === 'won' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">受注金額（万円）</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="例: 100"
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-primary/50"
              />
            </div>
          )}

          {/* Next Action (show for next_meeting/pending) */}
          {(outcome === 'next_meeting' || outcome === 'pending') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">次のアクション</label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="例: 見積書送付、2週間後にフォローコール"
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-primary/50"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">メモ</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="商談の所感やポイントを記録..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-primary/50 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!outcome}
            className="bg-neon-primary hover:bg-neon-primary/90"
          >
            記録する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
