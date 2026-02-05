'use client'

import { type Script } from '@/types/script'

interface TalkScriptProps {
  script: Script
}

export function TalkScript({ script }: TalkScriptProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <h3 className="text-sm font-semibold text-foreground">トークスクリプト</h3>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 border border-border/40">
        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-mono">
          {script.main}
        </p>
      </div>

      {script.tips && script.tips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">💡</span>
            <h4 className="text-xs font-medium text-muted-foreground">ポイント</h4>
          </div>
          <ul className="space-y-1">
            {script.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="text-neon-primary mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
