'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { FlowCanvasWrapper } from '@/components/flow/FlowCanvasWrapper'
import { DetailPanel } from '@/components/panel/DetailPanel'
import { PracticeMode } from '@/features/practice/PracticeMode'
import { SearchDialog } from '@/components/layout/SearchDialog'
import { KeyboardHelp } from '@/components/layout/KeyboardHelp'
import { SessionHistory } from '@/components/session/SessionHistory'
import { WelcomeOverlay } from '@/components/session/WelcomeOverlay'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { usePracticeMode } from '@/hooks/usePracticeMode'
import { useSearch } from '@/hooks/useSearch'
import { useSession } from '@/hooks/useSession'
import { type ScriptNode, type Phase } from '@/types/script'

const phases: Phase[] = ['opening', 'hearing', 'proposal', 'closing', 'followup']

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isBrowseMode, setIsBrowseMode] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)

  // Session management
  const session = useSession()

  // Practice mode
  const practice = usePracticeMode()

  // Search
  const search = useSearch()

  // Current session completion rate
  const currentCompletionRate = useMemo(() => {
    if (!session.currentSession) return undefined
    const summary = session.summaries.find((s) => s.id === session.currentSession?.id)
    return summary?.completionRate
  }, [session.currentSession, session.summaries])

  // Show WelcomeOverlay when no session selected and not in browse mode
  const showWelcome = !session.currentSession && !isBrowseMode

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
      if (isHelpOpen) {
        setIsHelpOpen(false)
      } else if (search.isOpen) {
        search.closeSearch()
      } else if (practice.isActive) {
        practice.endPractice()
      } else if (isPanelOpen) {
        handlePanelClose()
      }
    },
    onArrowLeft: () => {
      if (!search.isOpen && !practice.isActive && !isHelpOpen) {
        navigatePhase('prev')
      }
    },
    onArrowRight: () => {
      if (!search.isOpen && !practice.isActive && !isHelpOpen) {
        navigatePhase('next')
      }
    },
    onQuestionMark: () => {
      if (!search.isOpen && !practice.isActive) {
        setIsHelpOpen((prev) => !prev)
      }
    },
  })

  // Add Cmd/Ctrl+K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        search.toggleSearch()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [search])

  // Handle practice mode
  const handlePracticeMode = useCallback(() => {
    practice.startPractice()
  }, [practice])

  // Handle search result selection
  const handleSearchSelect = useCallback(
    (nodeId: string) => {
      handleNodeSelect(nodeId)
    },
    [handleNodeSelect]
  )

  // WelcomeOverlay handlers
  const handleWelcomeCreateSession = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleWelcomeSelectSession = useCallback(
    (id: string) => {
      session.selectSession(id)
      setIsBrowseMode(false)
    },
    [session]
  )

  const handleBrowseMode = useCallback(() => {
    setIsBrowseMode(true)
  }, [])

  // Reset browse mode when session is created/selected
  const handleCreateSession = useCallback(
    (companyName: string, contactPerson?: string) => {
      session.createSession(companyName, contactPerson)
      setIsBrowseMode(false)
    },
    [session]
  )

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      session.selectSession(sessionId)
      setIsBrowseMode(false)
    },
    [session]
  )

  const handleClearSession = useCallback(() => {
    session.clearSession()
    setIsBrowseMode(false)
  }, [session])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        currentPhase={currentPhase}
        onPracticeMode={handlePracticeMode}
        onOpenSearch={search.openSearch}
        showPDFButton={true}
        sessionProps={{
          currentSessionName: session.currentSession?.companyName,
          summaries: session.summaries,
          onCreateSession: handleCreateSession,
          onSelectSession: handleSelectSession,
          onClearSession: handleClearSession,
          onDeleteSession: session.deleteSession,
          onOpenHistory: () => setIsHistoryOpen(true),
          isCreateDialogOpen,
          onCreateDialogChange: setIsCreateDialogOpen,
          isSelectDialogOpen,
          onSelectDialogChange: setIsSelectDialogOpen,
          currentCompletionRate,
        }}
      />

      <main className="flex-1 relative overflow-hidden" role="main" aria-label="営業トークスクリプト フローチャート">
        <FlowCanvasWrapper
          selectedNodeId={selectedNodeId}
          onNodeSelect={handleNodeSelect}
          sessionId={session.currentSession?.id}
          getNodeProgress={session.getNodeProgress}
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
        sessionId={session.currentSession?.id}
        getCheckpointStates={session.getCheckpointStates}
        onCheckpointChange={session.updateCheckpoint}
        onSetResult={session.setResult}
        currentSession={session.currentSession}
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

      <SearchDialog
        isOpen={search.isOpen}
        query={search.query}
        results={search.results}
        onQueryChange={search.setQuery}
        onClose={search.closeSearch}
        onSelectResult={handleSearchSelect}
      />

      <KeyboardHelp
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SessionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        summaries={session.summaries}
        onSelectSession={(id) => {
          handleSelectSession(id)
          setIsHistoryOpen(false)
        }}
        onDeleteSession={session.deleteSession}
      />

      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay
            summaries={session.summaries}
            onCreateSession={handleWelcomeCreateSession}
            onSelectSession={handleWelcomeSelectSession}
            onBrowseMode={handleBrowseMode}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
