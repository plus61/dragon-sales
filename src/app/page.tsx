'use client'

import { useState, useCallback, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { FlowCanvasWrapper } from '@/components/flow/FlowCanvasWrapper'
import { DetailPanel } from '@/components/panel/DetailPanel'
import { PracticeMode } from '@/features/practice/PracticeMode'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { usePracticeMode } from '@/hooks/usePracticeMode'
import { type ScriptNode, type Phase } from '@/types/script'

const phases: Phase[] = ['opening', 'hearing', 'proposal', 'closing', 'followup']

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  // Practice mode
  const practice = usePracticeMode()

  // Get selected node data
  const selectedNode: ScriptNode | null = useMemo(
    () => scriptNodes.find((node) => node.id === selectedNodeId) ?? null,
    [selectedNodeId]
  )

  // Get current phase from selected node
  const currentPhase: Phase | undefined = selectedNode?.phase

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId)
    setIsPanelOpen(nodeId !== null)
  }, [])

  // Handle panel close
  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false)
  }, [])

  // Handle navigation from action buttons
  const handleNavigate = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId)
  }, [])

  // Handle phase click from progress bar
  const handlePhaseClick = useCallback(
    (phase: Phase) => {
      const firstNodeOfPhase = scriptNodes.find((node) => node.phase === phase)
      if (firstNodeOfPhase) {
        handleNodeSelect(firstNodeOfPhase.id)
      }
    },
    [handleNodeSelect]
  )

  // Navigate to previous/next phase
  const navigatePhase = useCallback(
    (direction: 'prev' | 'next') => {
      const currentIndex = currentPhase ? phases.indexOf(currentPhase) : -1
      let newIndex: number

      if (direction === 'prev') {
        newIndex = currentIndex <= 0 ? phases.length - 1 : currentIndex - 1
      } else {
        newIndex = currentIndex >= phases.length - 1 ? 0 : currentIndex + 1
      }

      handlePhaseClick(phases[newIndex])
    },
    [currentPhase, handlePhaseClick]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: () => {
      if (practice.isActive) {
        practice.endPractice()
      } else if (isPanelOpen) {
        handlePanelClose()
      }
    },
    onArrowLeft: () => navigatePhase('prev'),
    onArrowRight: () => navigatePhase('next'),
  })

  // Handle practice mode
  const handlePracticeMode = useCallback(() => {
    practice.startPractice()
  }, [practice])

  // Handle PDF export (placeholder - to be implemented)
  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export with @react-pdf/renderer
    alert('PDF出力機能は今後実装予定です')
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        currentPhase={currentPhase}
        onPracticeMode={handlePracticeMode}
        onExportPDF={handleExportPDF}
      />

      <main className="flex-1 relative overflow-hidden">
        <FlowCanvasWrapper
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
        />
      </main>

      <ProgressBar
        currentPhase={currentPhase ?? 'opening'}
        onPhaseClick={handlePhaseClick}
      />

      <DetailPanel
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        onNavigate={handleNavigate}
      />

      <PracticeMode
        isOpen={practice.isActive}
        onClose={practice.endPractice}
        currentRole={practice.currentRole}
        currentQuestion={practice.currentQuestion}
        showAnswer={practice.showAnswer}
        score={practice.score}
        totalAnswered={practice.totalAnswered}
        totalQuestions={practice.totalQuestions}
        onToggleRole={practice.toggleRole}
        onShowAnswer={practice.revealAnswer}
        onNextQuestion={practice.nextQuestion}
        onResetScore={practice.resetScore}
      />
    </div>
  )
}
