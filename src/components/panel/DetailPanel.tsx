'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TalkScript } from './TalkScript'
import { QAAccordion } from './QAAccordion'
import { ActionButtons } from './ActionButtons'
import { Checkpoints } from './Checkpoints'
import { Resources } from './Resources'
import { SessionResultDialog } from '@/components/session/SessionResultDialog'
import { type ScriptNode, type Phase } from '@/types/script'
import { type SalesSession, type SessionResult } from '@/types/session'

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

interface DetailPanelProps {
  node: ScriptNode | null
  isOpen: boolean
  onClose: () => void
  onNavigate: (nodeId: string) => void
  sessionId?: string
  getCheckpointStates?: (nodeId: string) => boolean[] | null
  onCheckpointChange?: (nodeId: string, index: number, checked: boolean) => void
  onSetResult?: (result: SessionResult) => void
  currentSession?: SalesSession | null
}

export function DetailPanel({
  node,
  isOpen,
  onClose,
  onNavigate,
  sessionId,
  getCheckpointStates,
  onCheckpointChange,
  onSetResult,
  currentSession,
}: DetailPanelProps) {
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)

  const persistedStates = node && sessionId && getCheckpointStates
    ? getCheckpointStates(node.id)
    : null

  const showResultButton = sessionId
    && currentSession
    && currentSession.status === 'in_progress'
    && node
    && (node.phase === 'closing' || node.phase === 'followup')

  return (
    <>
      <AnimatePresence>
        {isOpen && node && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border/40 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${phaseColors[node.phase]} font-medium`}
                  >
                    {phaseLabels[node.phase]}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {node.duration}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>

              {/* Title */}
              <div className="px-4 py-3 border-b border-border/40">
                <h2 className="text-lg font-bold text-foreground">{node.title}</h2>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 min-h-0 px-4">
                <div className="py-4 space-y-6">
                  {node.resources && node.resources.length > 0 && (
                    <>
                      <Resources resources={node.resources} />
                      <Separator className="bg-border/40" />
                    </>
                  )}

                  <TalkScript script={node.script} />

                  <Separator className="bg-border/40" />

                  <Checkpoints
                    checkpoints={node.checkpoints}
                    sessionId={sessionId}
                    nodeId={node.id}
                    persistedStates={persistedStates}
                    onCheckpointChange={onCheckpointChange}
                  />

                  {node.qa.length > 0 && (
                    <>
                      <Separator className="bg-border/40" />
                      <QAAccordion qaList={node.qa} />
                    </>
                  )}

                  {node.actions.length > 0 && (
                    <>
                      <Separator className="bg-border/40" />
                      <ActionButtons actions={node.actions} onAction={onNavigate} />
                    </>
                  )}

                  {/* Result recording button */}
                  {showResultButton && (
                    <>
                      <Separator className="bg-border/40" />
                      <div className="space-y-2">
                        <Button
                          onClick={() => setIsResultDialogOpen(true)}
                          className="w-full bg-neon-primary hover:bg-neon-primary/90"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          結果を記録する
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Show suggestions if session is completed */}
                  {currentSession?.status === 'completed' && currentSession.suggestions && currentSession.suggestions.length > 0 && (
                    <>
                      <Separator className="bg-border/40" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💡</span>
                          <h3 className="text-sm font-semibold text-foreground">改善ポイント</h3>
                        </div>
                        <ul className="space-y-2">
                          {currentSession.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                              <span className="text-neon-primary mt-0.5 shrink-0">-</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Result Dialog */}
      {onSetResult && (
        <SessionResultDialog
          isOpen={isResultDialogOpen}
          onClose={() => setIsResultDialogOpen(false)}
          onSubmit={(result) => {
            onSetResult(result)
            setIsResultDialogOpen(false)
          }}
          companyName={currentSession?.companyName}
        />
      )}
    </>
  )
}
