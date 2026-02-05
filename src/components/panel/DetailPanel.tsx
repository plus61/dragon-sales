'use client'

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
import { type ScriptNode, type Phase } from '@/types/script'

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
}

export function DetailPanel({ node, isOpen, onClose, onNavigate }: DetailPanelProps) {
  return (
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

                <Checkpoints checkpoints={node.checkpoints} />

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
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
