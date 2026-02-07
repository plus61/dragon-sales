'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { type SessionSummary } from '@/types/session'

interface SessionSelectorProps {
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

export function SessionSelector({
  currentSessionName,
  summaries,
  onCreateSession,
  onSelectSession,
  onClearSession,
  onDeleteSession,
  onOpenHistory,
  isCreateDialogOpen: externalCreateOpen,
  onCreateDialogChange,
  isSelectDialogOpen: externalSelectOpen,
  onSelectDialogChange,
  currentCompletionRate,
}: SessionSelectorProps) {
  const [internalCreateOpen, setInternalCreateOpen] = useState(false)
  const [internalSelectOpen, setInternalSelectOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')

  const isCreateOpen = externalCreateOpen ?? internalCreateOpen
  const isSelectOpen = externalSelectOpen ?? internalSelectOpen

  const setIsCreateOpen = (open: boolean) => {
    if (onCreateDialogChange) {
      onCreateDialogChange(open)
    } else {
      setInternalCreateOpen(open)
    }
  }

  const setIsSelectOpen = (open: boolean) => {
    if (onSelectDialogChange) {
      onSelectDialogChange(open)
    } else {
      setInternalSelectOpen(open)
    }
  }

  // Sync external state changes
  useEffect(() => {
    if (externalCreateOpen !== undefined) {
      setInternalCreateOpen(externalCreateOpen)
    }
  }, [externalCreateOpen])

  useEffect(() => {
    if (externalSelectOpen !== undefined) {
      setInternalSelectOpen(externalSelectOpen)
    }
  }, [externalSelectOpen])

  const handleCreate = () => {
    if (!companyName.trim()) return
    onCreateSession(companyName.trim(), contactPerson.trim() || undefined)
    setCompanyName('')
    setContactPerson('')
    setIsCreateOpen(false)
  }

  const inProgressSessions = summaries.filter((s) => s.status === 'in_progress')

  return (
    <>
      <div className="flex items-center gap-2">
        {currentSessionName ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-neon-primary/10 text-neon-primary border-neon-primary/30 font-medium">
              {currentSessionName}
            </Badge>
            {currentCompletionRate !== undefined && (
              <div className="flex items-center gap-1.5">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neon-primary rounded-full transition-all"
                    style={{ width: `${currentCompletionRate}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {currentCompletionRate}%
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSelectOpen(true)}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              切替
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSession}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (inProgressSessions.length > 0) {
                setIsSelectOpen(true)
              } else {
                setIsCreateOpen(true)
              }
            }}
            className="border-neon-primary/30 hover:border-neon-primary/60 hover:bg-neon-primary/10 text-xs"
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="hidden sm:inline">セッション</span>
          </Button>
        )}
      </div>

      {/* Create Session Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border/40">
          <DialogHeader>
            <DialogTitle>新規セッション作成</DialogTitle>
            <DialogDescription>
              商談先の企業情報を入力してください。チェックポイントの進捗が記録されます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                企業名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例: 株式会社○○"
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                担当者名
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="例: 田中太郎"
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!companyName.trim()}
              className="bg-neon-primary hover:bg-neon-primary/90"
            >
              作成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Session Dialog */}
      <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
        <DialogContent className="bg-card border-border/40 max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>セッション選択</DialogTitle>
            <DialogDescription>
              既存のセッションを選択するか、新規作成してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[40vh] overflow-y-auto py-2">
            {inProgressSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id)
                  setIsSelectOpen(false)
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{session.companyName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-primary rounded-full transition-all"
                      style={{ width: `${session.completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {session.completionRate}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSelectOpen(false)
                onOpenHistory()
              }}
            >
              履歴を見る
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsSelectOpen(false)}>
                閉じる
              </Button>
              <Button
                onClick={() => {
                  setIsSelectOpen(false)
                  setIsCreateOpen(true)
                }}
                className="bg-neon-primary hover:bg-neon-primary/90"
              >
                新規作成
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
