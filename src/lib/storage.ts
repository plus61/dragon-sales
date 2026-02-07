import { type SalesSession, type SessionResult, type SessionSummary } from '@/types/session'
import { scriptNodes } from '@/data/scripts/sales-flow'

const STORAGE_KEY = 'dragon-sales-sessions'
const STORAGE_VERSION = 1

interface StorageData {
  version: number
  sessions: SalesSession[]
}

function readStorage(): StorageData {
  if (typeof window === 'undefined') {
    return { version: STORAGE_VERSION, sessions: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: STORAGE_VERSION, sessions: [] }
    const data = JSON.parse(raw) as StorageData
    if (data.version !== STORAGE_VERSION) {
      return { version: STORAGE_VERSION, sessions: [] }
    }
    return data
  } catch {
    return { version: STORAGE_VERSION, sessions: [] }
  }
}

function writeStorage(data: StorageData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.error('Failed to write to localStorage')
  }
}

function calculateCompletionRate(session: SalesSession): number {
  let total = 0
  let completed = 0
  for (const nodeId of Object.keys(session.checkpointStates)) {
    const states = session.checkpointStates[nodeId]
    total += states.length
    completed += states.filter(Boolean).length
  }
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

export const sessionStorage = {
  getAll(): SalesSession[] {
    return readStorage().sessions
  },

  getById(id: string): SalesSession | null {
    return readStorage().sessions.find((s) => s.id === id) ?? null
  },

  create(companyName: string, contactPerson?: string): SalesSession {
    const data = readStorage()
    const now = new Date().toISOString()

    const checkpointStates: Record<string, boolean[]> = {}
    for (const node of scriptNodes) {
      if (node.checkpoints.length > 0) {
        checkpointStates[node.id] = new Array(node.checkpoints.length).fill(false)
      }
    }

    const session: SalesSession = {
      id: crypto.randomUUID(),
      companyName,
      contactPerson,
      createdAt: now,
      updatedAt: now,
      status: 'in_progress',
      checkpointStates,
    }

    data.sessions.unshift(session)
    writeStorage(data)
    return session
  },

  update(id: string, patch: Partial<SalesSession>): SalesSession {
    const data = readStorage()
    const index = data.sessions.findIndex((s) => s.id === id)
    if (index === -1) throw new Error(`Session not found: ${id}`)

    const updated: SalesSession = {
      ...data.sessions[index],
      ...patch,
      id,
      updatedAt: new Date().toISOString(),
    }
    data.sessions[index] = updated
    writeStorage(data)
    return updated
  },

  delete(id: string): void {
    const data = readStorage()
    data.sessions = data.sessions.filter((s) => s.id !== id)
    writeStorage(data)
  },

  updateCheckpoint(sessionId: string, nodeId: string, index: number, checked: boolean): void {
    const data = readStorage()
    const session = data.sessions.find((s) => s.id === sessionId)
    if (!session) return

    if (!session.checkpointStates[nodeId]) {
      const node = scriptNodes.find((n) => n.id === nodeId)
      if (!node) return
      session.checkpointStates[nodeId] = new Array(node.checkpoints.length).fill(false)
    }

    session.checkpointStates[nodeId][index] = checked
    session.updatedAt = new Date().toISOString()
    writeStorage(data)
  },

  setResult(sessionId: string, result: SessionResult): void {
    const data = readStorage()
    const session = data.sessions.find((s) => s.id === sessionId)
    if (!session) return

    session.result = result
    session.status = 'completed'
    session.updatedAt = new Date().toISOString()
    writeStorage(data)
  },

  getSummaries(): SessionSummary[] {
    const data = readStorage()
    return data.sessions.map((s) => ({
      id: s.id,
      companyName: s.companyName,
      createdAt: s.createdAt,
      status: s.status,
      completionRate: calculateCompletionRate(s),
      outcome: s.result?.outcome,
    }))
  },

  exportToJSON(): string {
    const data = readStorage()
    return JSON.stringify(data, null, 2)
  },

  importFromJSON(json: string): { success: boolean; count: number; error?: string } {
    try {
      const imported = JSON.parse(json) as StorageData
      if (!imported.version || !Array.isArray(imported.sessions)) {
        return { success: false, count: 0, error: '無効なファイル形式です' }
      }
      const current = readStorage()
      const existingIds = new Set(current.sessions.map((s) => s.id))
      const newSessions = imported.sessions.filter((s) => !existingIds.has(s.id))
      current.sessions = [...newSessions, ...current.sessions]
      writeStorage(current)
      return { success: true, count: newSessions.length }
    } catch {
      return { success: false, count: 0, error: 'JSONの解析に失敗しました' }
    }
  },
}
