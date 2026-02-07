import { type SalesSession } from '@/types/session'
import { scriptNodes } from '@/data/scripts/sales-flow'
import { type Phase } from '@/types/script'

const phaseLabels: Record<Phase, string> = {
  opening: '開始',
  hearing: 'ヒアリング',
  proposal: '提案',
  closing: 'クロージング',
  followup: 'フォローアップ',
}

function getPhaseCompletionRate(
  session: SalesSession,
  phase: Phase
): { completed: number; total: number; rate: number } {
  let total = 0
  let completed = 0

  for (const node of scriptNodes) {
    if (node.phase !== phase) continue
    const states = session.checkpointStates[node.id]
    if (!states) continue
    total += states.length
    completed += states.filter(Boolean).length
  }

  return {
    completed,
    total,
    rate: total === 0 ? 100 : Math.round((completed / total) * 100),
  }
}

export function generateSuggestions(session: SalesSession): string[] {
  const suggestions: string[] = []
  const phases: Phase[] = ['opening', 'hearing', 'proposal', 'closing', 'followup']

  for (const phase of phases) {
    const { rate } = getPhaseCompletionRate(session, phase)
    if (rate < 50) {
      suggestions.push(
        `${phaseLabels[phase]}フェーズのチェック完了率が${rate}%です。準備を強化しましょう。`
      )
    }
  }

  const hearingRate = getPhaseCompletionRate(session, 'hearing')
  if (hearingRate.rate < 70) {
    suggestions.push(
      'ヒアリング項目の完了率が低めです。事前に質問リストを整理して、漏れなく確認しましょう。'
    )
  }

  const outcome = session.result?.outcome
  if (outcome === 'lost') {
    const proposalRate = getPhaseCompletionRate(session, 'proposal')
    if (proposalRate.rate < 80) {
      suggestions.push(
        '提案フェーズのチェック項目に未完了があります。提案内容の見直しを検討しましょう。'
      )
    }
    suggestions.push(
      '失注分析：ヒアリング内容と提案内容のギャップがなかったか振り返りましょう。'
    )
    suggestions.push(
      '次回の商談では、競合との差別化ポイントをより明確に伝えることを意識しましょう。'
    )
  }

  if (outcome === 'pending' || outcome === 'next_meeting') {
    suggestions.push(
      'フォローアップのタイミングを逃さないよう、次回アクションの日程を確定しましょう。'
    )
  }

  if (outcome === 'won') {
    suggestions.push(
      '受注おめでとうございます！成功要因を記録して、今後の商談に活かしましょう。'
    )
  }

  let totalAll = 0
  let completedAll = 0
  for (const states of Object.values(session.checkpointStates)) {
    totalAll += states.length
    completedAll += states.filter(Boolean).length
  }
  const overallRate = totalAll === 0 ? 0 : Math.round((completedAll / totalAll) * 100)

  if (overallRate >= 90) {
    suggestions.push(
      `全体チェック完了率${overallRate}%。スクリプトに沿った丁寧な商談ができています。`
    )
  } else if (overallRate >= 70) {
    suggestions.push(
      `全体チェック完了率${overallRate}%。もう少しでカバー率が高まります。未完了項目を確認しましょう。`
    )
  } else {
    suggestions.push(
      `全体チェック完了率${overallRate}%。スクリプトの各ステップをより意識して進めましょう。`
    )
  }

  return suggestions
}
