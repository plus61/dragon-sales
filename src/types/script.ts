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

export type ResourceType = 'pptx' | 'pdf' | 'video' | 'image' | 'link'

export interface Resource {
  id: string
  type: ResourceType
  title: string
  description?: string
  url: string
  timing?: string  // いつ表示するかのガイダンス
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
  resources?: Resource[]  // 関連資料
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
