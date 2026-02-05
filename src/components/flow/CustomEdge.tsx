'use client'

import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react'

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: 'url(#edge-gradient)',
          strokeWidth: 2,
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-2 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium text-muted-foreground rounded border border-border/40"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
      {/* Gradient definition */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--neon-primary)" />
            <stop offset="100%" stopColor="var(--neon-secondary)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  )
}

export const CustomEdge = memo(CustomEdgeComponent)
