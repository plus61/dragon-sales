'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { type SessionSummary } from '@/types/session'

interface WelcomeOverlayProps {
  summaries: SessionSummary[]
  onCreateSession: () => void
  onSelectSession: (id: string) => void
  onBrowseMode: () => void
}

export function WelcomeOverlay({
  summaries,
  onCreateSession,
  onSelectSession,
  onBrowseMode,
}: WelcomeOverlayProps) {
  const inProgressSessions = summaries.filter((s) => s.status === 'in_progress')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 backdrop-blur-md bg-black/60 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md rounded-2xl bg-card/95 border border-border/40 gradient-border overflow-hidden"
      >
        <div className="relative z-10 px-8 py-10">
          {/* Branding */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              <span className="neon-text">Dragon</span>
              <span className="text-muted-foreground ml-2">Sales</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              AI研修営業を、科学する。
            </p>
          </div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onCreateSession}
              className="w-full h-12 bg-gradient-to-r from-neon-primary to-neon-secondary hover:from-neon-primary/90 hover:to-neon-secondary/90 text-white font-semibold text-base neon-pulse rounded-xl"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規セッションを開始
            </Button>
          </motion.div>

          {/* In-progress sessions */}
          {inProgressSessions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border/40" />
                <span className="text-xs text-muted-foreground px-2">進行中のセッション</span>
                <div className="h-px flex-1 bg-border/40" />
              </div>
              <div className="space-y-2">
                {inProgressSessions.map((session, index) => (
                  <motion.button
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    onClick={() => onSelectSession(session.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-muted/50 hover:border-neon-primary/30 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground group-hover:text-neon-primary transition-colors">
                        {session.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neon-primary rounded-full transition-all"
                          style={{ width: `${session.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {session.completionRate}%
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Browse mode link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <button
              onClick={onBrowseMode}
              className="text-sm text-muted-foreground hover:text-neon-primary transition-colors inline-flex items-center gap-1"
            >
              スクリプトを閲覧する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
