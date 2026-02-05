export type Phase = 'opening' | 'hearing' | 'proposal' | 'closing' | 'followup'

export type ActionStyle = 'primary' | 'secondary' | 'warning'

export interface QA {
  question: string
  answer: string
}

export interface Action {
  label: string
  nextNodeId: string
  style: ActionStyle
}

export interface Script {
  main: string
  tips?: string[]
}

export interface ScriptNode {
  id: string
  phase: Phase
  title: string
  duration: string
  script: Script
  checkpoints: string[]
  qa: QA[]
  actions: Action[]
  position: { x: number; y: number }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface ScriptData {
  nodes: ScriptNode[]
  edges: FlowEdge[]
}
