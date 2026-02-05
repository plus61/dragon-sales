'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { type Role } from '@/hooks/usePracticeMode'
import { type QA } from '@/types/script'

interface QuestionCardProps {
  question: QA
  currentRole: Role
  showAnswer: boolean
  onShowAnswer: () => void
  onNext: (wasCorrect: boolean) => void
}

export function QuestionCard({
  question,
  currentRole,
  showAnswer,
  onShowAnswer,
  onNext,
}: QuestionCardProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Question */}
      <Card className="p-6 bg-card border-border/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-bold">Q</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {currentRole === 'sales' ? '顧客からの質問' : 'あなたが投げかける質問'}
            </p>
            <p className="text-lg font-medium text-foreground">{question.question}</p>
          </div>
        </div>
      </Card>

      {/* Answer Section */}
      <AnimatePresence mode="wait">
        {showAnswer ? (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 bg-neon-primary/5 border-neon-primary/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-neon-primary font-bold">A</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">模範回答</p>
                  <p className="text-foreground leading-relaxed">{question.answer}</p>
                </div>
              </div>
            </Card>

            {/* Self-assessment */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">自己評価してください</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => onNext(true)}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  正解できた
                </Button>
                <Button
                  onClick={() => onNext(false)}
                  variant="outline"
                  className="border-danger/40 text-danger hover:bg-danger/10"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  不正解だった
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4"
          >
            {currentRole === 'sales' ? (
              <>
                <p className="text-muted-foreground text-center">
                  この質問に対する回答を考えてみましょう。
                  <br />
                  準備ができたら「回答を見る」をクリック。
                </p>
                <Button
                  onClick={onShowAnswer}
                  className="bg-neon-primary hover:bg-neon-primary/90"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  回答を見る
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-center">
                  顧客役として、この質問を営業担当に投げかけてみましょう。
                  <br />
                  相手の反応を想像して、次の質問へ進みましょう。
                </p>
                <Button
                  onClick={onShowAnswer}
                  className="bg-neon-secondary hover:bg-neon-secondary/90"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  営業の回答例を見る
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
