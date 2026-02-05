'use client'

import { useState, useCallback, useMemo } from 'react'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { type QA } from '@/types/script'

export type Role = 'sales' | 'customer'

interface PracticeState {
  isActive: boolean
  currentRole: Role
  currentQuestionIndex: number
  showAnswer: boolean
  score: number
  totalAnswered: number
}

const initialState: PracticeState = {
  isActive: false,
  currentRole: 'sales',
  currentQuestionIndex: 0,
  showAnswer: false,
  score: 0,
  totalAnswered: 0,
}

export function usePracticeMode() {
  const [state, setState] = useState<PracticeState>(initialState)

  // Collect all Q&A from all nodes
  const allQA: QA[] = useMemo(() => {
    return scriptNodes.flatMap((node) => node.qa)
  }, [])

  // Shuffle questions for practice
  const shuffledQA = useMemo(() => {
    return [...allQA].sort(() => Math.random() - 0.5)
  }, [allQA])

  const currentQuestion = shuffledQA[state.currentQuestionIndex]

  const startPractice = useCallback(() => {
    setState({
      ...initialState,
      isActive: true,
    })
  }, [])

  const endPractice = useCallback(() => {
    setState(initialState)
  }, [])

  const toggleRole = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRole: prev.currentRole === 'sales' ? 'customer' : 'sales',
    }))
  }, [])

  const revealAnswer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showAnswer: true,
    }))
  }, [])

  const nextQuestion = useCallback(
    (wasCorrect: boolean) => {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex:
          prev.currentQuestionIndex + 1 >= shuffledQA.length
            ? 0
            : prev.currentQuestionIndex + 1,
        showAnswer: false,
        score: wasCorrect ? prev.score + 1 : prev.score,
        totalAnswered: prev.totalAnswered + 1,
      }))
    },
    [shuffledQA.length]
  )

  const resetScore = useCallback(() => {
    setState((prev) => ({
      ...prev,
      score: 0,
      totalAnswered: 0,
    }))
  }, [])

  return {
    ...state,
    currentQuestion,
    totalQuestions: shuffledQA.length,
    startPractice,
    endPractice,
    toggleRole,
    revealAnswer,
    nextQuestion,
    resetScore,
  }
}
