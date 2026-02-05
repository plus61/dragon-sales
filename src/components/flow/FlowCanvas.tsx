'use client'

import { useCallback, useMemo, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { ScriptNode, type ScriptNodeData } from './ScriptNode'
import { CustomEdge } from './CustomEdge'
import { scriptNodes, scriptEdges } from '@/data/scripts/sales-flow'
import { type ScriptNode as ScriptNodeDataType, type Phase } from '@/types/script'

// Define node types outside component to prevent re-creation
const nodeTypes = {
  scriptNode: ScriptNode,
}

// Define edge types outside component to prevent re-creation
const edgeTypes = {
  custom: CustomEdge,
}

interface FlowCanvasProps {
  selectedNodeId: string | null
  onNodeSelect: (nodeId: string | null) => void
}

// Use generic Node type with index signature compatible data
interface FlowNodeData extends Record<string, unknown> {
  label: string
  phase: Phase
  duration: string
  isSelected: boolean
}

type FlowNode = Node<FlowNodeData>

export function FlowCanvas({ selectedNodeId, onNodeSelect }: FlowCanvasProps) {
  // Convert script nodes to ReactFlow nodes
  const initialNodes: FlowNode[] = useMemo(
    () =>
      scriptNodes.map((node: ScriptNodeDataType): FlowNode => ({
        id: node.id,
        type: 'scriptNode',
        position: node.position,
        data: {
          label: node.title,
          phase: node.phase,
          duration: node.duration,
          isSelected: false,
        },
      })),
    []
  )

  // Convert script edges to ReactFlow edges
  const initialEdges: Edge[] = useMemo(
    () =>
      scriptEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        animated: edge.animated,
        label: edge.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--neon-primary)',
        },
      })),
    []
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes when selection changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.id === selectedNodeId,
        },
      }))
    )
  }, [selectedNodeId, setNodes])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id)
    },
    [onNodeSelect]
  )

  const onPaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background
          color="rgba(99, 102, 241, 0.1)"
          gap={24}
          size={1}
        />
        <Controls
          className="!bg-card !border-border/40 !rounded-lg overflow-hidden [&>button]:!bg-card [&>button]:!border-border/40 [&>button]:!text-foreground [&>button:hover]:!bg-muted"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap
          className="!bg-card !border-border/40 !rounded-lg"
          nodeColor={(node) => {
            const data = node.data as unknown as ScriptNodeData | undefined
            const phase: Phase | undefined = data?.phase
            const colors: Record<Phase, string> = {
              opening: '#10b981',
              hearing: '#3b82f6',
              proposal: '#8b5cf6',
              closing: '#f59e0b',
              followup: '#ec4899',
            }
            return phase ? colors[phase] : '#6366f1'
          }}
          maskColor="rgba(10, 10, 15, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}
