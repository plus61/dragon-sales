'use client'

import { cn } from '@/lib/utils'
import { type Role } from '@/hooks/usePracticeMode'

interface RoleToggleProps {
  currentRole: Role
  onToggle: () => void
}

export function RoleToggle({ currentRole, onToggle }: RoleToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-full p-1">
      <button
        onClick={onToggle}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          currentRole === 'sales'
            ? 'bg-neon-primary text-white shadow-lg shadow-neon-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="mr-2">👔</span>
        営業役
      </button>
      <button
        onClick={onToggle}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
          currentRole === 'customer'
            ? 'bg-neon-secondary text-white shadow-lg shadow-neon-secondary/30'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="mr-2">🏢</span>
        顧客役
      </button>
    </div>
  )
}
