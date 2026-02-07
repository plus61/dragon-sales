'use client'

import { useState, useCallback, useEffect } from 'react'
import { type SalesSession, type SessionResult, type SessionSummary } from '@/types/session'
import { sessionStorage } from '@/lib/storage'
import { generateSuggestions } from '@/lib/suggestions'

export function useSession() {
  const [currentSession, setCurrentSession] = useState<SalesSession | null>(null)
  const [summaries, setSummaries] = useState<SessionSummary[]>([])

  const refreshSummaries = useCallback(() => {
    setSummaries(sessionStorage.getSummaries())
  }, [])

  useEffect(() => {
    refreshSummaries()
  }, [refreshSummaries])

  const createSession = useCallback(
    (companyName: string, contactPerson?: string) => {
      const session = sessionStorage.create(companyName, contactPerson)
      setCurrentSession(session)
      refreshSummaries()
      return session
    },
    [refreshSummaries]
  )

  const selectSession = useCallback((sessionId: string) => {
    const session = sessionStorage.getById(sessionId)
    setCurrentSession(session)
  }, [])

  const clearSession = useCallback(() => {
    setCurrentSession(null)
  }, [])

  const updateCheckpoint = useCallback(
    (nodeId: string, index: number, checked: boolean) => {
      if (!currentSession) return
      sessionStorage.updateCheckpoint(currentSession.id, nodeId, index, checked)
      const updated = sessionStorage.getById(currentSession.id)
      setCurrentSession(updated)
      refreshSummaries()
    },
    [currentSession, refreshSummaries]
  )

  const getCheckpointStates = useCallback(
    (nodeId: string): boolean[] | null => {
      if (!currentSession) return null
      return currentSession.checkpointStates[nodeId] ?? null
    },
    [currentSession]
  )

  const setResult = useCallback(
    (result: SessionResult) => {
      if (!currentSession) return
      const suggestions = generateSuggestions({
        ...currentSession,
        result,
        status: 'completed',
      })
      sessionStorage.setResult(currentSession.id, result)
      sessionStorage.update(currentSession.id, { suggestions })
      const updated = sessionStorage.getById(currentSession.id)
      setCurrentSession(updated)
      refreshSummaries()
    },
    [currentSession, refreshSummaries]
  )

  const deleteSession = useCallback(
    (sessionId: string) => {
      sessionStorage.delete(sessionId)
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
      }
      refreshSummaries()
    },
    [currentSession, refreshSummaries]
  )

  const getNodeProgress = useCallback(
    (nodeId: string): { completed: number; total: number } => {
      if (!currentSession) return { completed: 0, total: 0 }
      const states = currentSession.checkpointStates[nodeId]
      if (!states) return { completed: 0, total: 0 }
      return {
        completed: states.filter(Boolean).length,
        total: states.length,
      }
    },
    [currentSession]
  )

  return {
    currentSession,
    summaries,
    createSession,
    selectSession,
    clearSession,
    updateCheckpoint,
    getCheckpointStates,
    setResult,
    deleteSession,
    getNodeProgress,
    refreshSummaries,
  }
}
