export interface SalesSession {
  id: string
  companyName: string
  contactPerson?: string
  createdAt: string
  updatedAt: string
  status: 'in_progress' | 'completed'
  checkpointStates: Record<string, boolean[]>
  notes?: Record<string, string>
  result?: SessionResult
  suggestions?: string[]
}

export interface SessionResult {
  outcome: 'won' | 'lost' | 'pending' | 'next_meeting'
  revenue?: number
  nextAction?: string
  notes?: string
  completedAt: string
}

export interface SessionSummary {
  id: string
  companyName: string
  createdAt: string
  status: 'in_progress' | 'completed'
  completionRate: number
  outcome?: SessionResult['outcome']
}
