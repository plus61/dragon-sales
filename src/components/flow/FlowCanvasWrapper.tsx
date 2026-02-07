'use client'

import dynamic from 'next/dynamic'

const FlowCanvas = dynamic(
  () => import('./FlowCanvas').then((mod) => mod.FlowCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-primary/30 border-t-neon-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">フローチャートを読み込み中...</p>
        </div>
      </div>
    ),
  }
)

interface FlowCanvasWrapperProps {
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string | null) => void
  sessionId?: string
  getNodeProgress?: (nodeId: string) => { completed: number; total: number }
}

export function FlowCanvasWrapper(props: FlowCanvasWrapperProps) {
  return <FlowCanvas {...props} />
}
