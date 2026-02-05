'use client'

import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onEscape?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onEnter?: () => void
  onSlash?: () => void
  onQuestionMark?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      switch (event.key) {
        case 'Escape':
          handlers.onEscape?.()
          break
        case 'ArrowLeft':
          handlers.onArrowLeft?.()
          break
        case 'ArrowRight':
          handlers.onArrowRight?.()
          break
        case 'ArrowUp':
          handlers.onArrowUp?.()
          break
        case 'ArrowDown':
          handlers.onArrowDown?.()
          break
        case 'Enter':
          handlers.onEnter?.()
          break
        case '/':
          event.preventDefault()
          handlers.onSlash?.()
          break
        case '?':
          handlers.onQuestionMark?.()
          break
      }
    },
    [handlers]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
