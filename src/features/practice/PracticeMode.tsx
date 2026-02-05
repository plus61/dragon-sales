'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RoleToggle } from './RoleToggle'
import { QuestionCard } from './QuestionCard'
import { type Role } from '@/hooks/usePracticeMode'
import { type QA } from '@/types/script'

interface PracticeModeProps {
  isOpen: boolean
  onClose: () => void
  currentRole: Role
  currentQuestion: QA | undefined
  showAnswer: boolean
  score: number
  totalAnswered: number
  totalQuestions: number
  onToggleRole: () => void
  onShowAnswer: () => void
  onNextQuestion: (wasCorrect: boolean) => void
  onResetScore: () => void
}

export function PracticeMode({
  isOpen,
  onClose,
  currentRole,
  currentQuestion,
  showAnswer,
  score,
  totalAnswered,
  totalQuestions,
  onToggleRole,
  onShowAnswer,
  onNextQuestion,
  onResetScore,
}: PracticeModeProps) {
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-card border border-border/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold">練習モード</h2>
                <Badge variant="outline" className="bg-neon-primary/20 text-neon-primary border-neon-primary/30">
                  {totalAnswered} / {totalQuestions} 問
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="p-4 bg-muted/30 border-b border-border/40">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">正解率: </span>
                    <span className="font-bold text-foreground">{accuracy}%</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">スコア: </span>
                    <span className="font-bold text-success">{score}</span>
                    <span className="text-muted-foreground"> / {totalAnswered}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetScore}
                  className="text-xs"
                >
                  リセット
                </Button>
              </div>
              <Progress value={accuracy} className="h-2" />
            </div>

            {/* Role Toggle */}
            <div className="p-4 flex justify-center">
              <RoleToggle currentRole={currentRole} onToggle={onToggleRole} />
            </div>

            {/* Question Area */}
            <div className="flex-1 p-4 overflow-auto">
              {currentQuestion ? (
                <QuestionCard
                  question={currentQuestion}
                  currentRole={currentRole}
                  showAnswer={showAnswer}
                  onShowAnswer={onShowAnswer}
                  onNext={onNextQuestion}
                />
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">質問データがありません</p>
                </Card>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/40 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                💡 ヒント: 営業役では回答を考えてから「回答を見る」をクリック。顧客役では質問を投げかける練習をしましょう。
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
