'use client'

import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { type SessionSummary } from '@/types/session'
import { sessionStorage } from '@/lib/storage'

const outcomeLabels: Record<string, { text: string; className: string }> = {
  won: { text: '受注', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  lost: { text: '失注', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  pending: { text: '検討中', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  next_meeting: { text: '次回商談', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
}

interface SessionHistoryProps {
  isOpen: boolean
  onClose: () => void
  summaries: SessionSummary[]
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onRefresh?: () => void
}

export function SessionHistory({
  isOpen,
  onClose,
  summaries,
  onSelectSession,
  onDeleteSession,
  onRefresh,
}: SessionHistoryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const completedSessions = summaries.filter((s) => s.status === 'completed')
  const inProgressSessions = summaries.filter((s) => s.status === 'in_progress')

  const handleExport = () => {
    const json = sessionStorage.exportToJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dragon-sales-sessions-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const json = event.target?.result as string
      const result = sessionStorage.importFromJSON(json)
      if (result.success) {
        onRefresh?.()
        alert(`${result.count}件のセッションをインポートしました`)
      } else {
        alert(`インポート失敗: ${result.error}`)
      }
    }
    reader.readAsText(file)

    // Reset input so the same file can be selected again
    e.target.value = ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border/40 max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>セッション履歴</DialogTitle>
          <DialogDescription>
            過去の商談セッションを確認できます。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh]">
          <div className="space-y-4 pr-4">
            {inProgressSessions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  進行中
                </h3>
                {inProgressSessions.map((session) => (
                  <SessionHistoryItem
                    key={session.id}
                    session={session}
                    onSelect={() => {
                      onSelectSession(session.id)
                      onClose()
                    }}
                    onDelete={() => onDeleteSession(session.id)}
                  />
                ))}
              </div>
            )}

            {completedSessions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  完了済み
                </h3>
                {completedSessions.map((session) => (
                  <SessionHistoryItem
                    key={session.id}
                    session={session}
                    onSelect={() => {
                      onSelectSession(session.id)
                      onClose()
                    }}
                    onDelete={() => onDeleteSession(session.id)}
                  />
                ))}
              </div>
            )}

            {summaries.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  セッション履歴がありません
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Export / Import */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={summaries.length === 0}
            className="text-xs"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            エクスポート
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            インポート
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SessionHistoryItem({
  session,
  onSelect,
  onDelete,
}: {
  session: SessionSummary
  onSelect: () => void
  onDelete: () => void
}) {
  const outcome = session.outcome ? outcomeLabels[session.outcome] : null

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors">
      <button onClick={onSelect} className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{session.companyName}</p>
          {outcome && (
            <Badge variant="outline" className={`${outcome.className} text-[10px] px-1.5 py-0`}>
              {outcome.text}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">
            {new Date(session.createdAt).toLocaleDateString('ja-JP')}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-primary rounded-full"
                style={{ width: `${session.completionRate}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{session.completionRate}%</span>
          </div>
        </div>
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
  )
}
