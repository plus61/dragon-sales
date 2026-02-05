'use client'

import { useState, useCallback, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { ProgressBar } from '@/components/layout/ProgressBar'
import { FlowCanvasWrapper } from '@/components/flow/FlowCanvasWrapper'
import { DetailPanel } from '@/components/panel/DetailPanel'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { type ScriptNode, type Phase } from '@/types/script'

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

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
    // Don't clear selection to keep visual feedback
  }, [])

  // Handle navigation from action buttons
  const handleNavigate = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId)
  }, [])

  // Handle phase click from progress bar
  const handlePhaseClick = useCallback((phase: Phase) => {
    const firstNodeOfPhase = scriptNodes.find((node) => node.phase === phase)
    if (firstNodeOfPhase) {
      handleNodeSelect(firstNodeOfPhase.id)
    }
  }, [handleNodeSelect])

  // Handle practice mode (placeholder)
  const handlePracticeMode = useCallback(() => {
    // TODO: Implement practice mode
    console.log('Practice mode clicked')
  }, [])

  // Handle PDF export (placeholder)
  const handleExportPDF = useCallback(() => {
    // TODO: Implement PDF export
    console.log('Export PDF clicked')
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
    </div>
  )
}
