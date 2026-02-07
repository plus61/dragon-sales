import { type ComponentType } from 'react'
import {
  WelcomeIllustration,
  SessionIllustration,
  FlowIllustration,
  DetailIllustration,
  CheckpointIllustration,
  PracticeIllustration,
  TipsIllustration,
} from './illustrations'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  Illustration: ComponentType
}

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Dragon Sales へようこそ',
    description:
      'AI研修営業のトークスクリプトを、フローチャートで可視化。商談の流れを直感的に理解し、実践力を磨きましょう。',
    Illustration: WelcomeIllustration,
  },
  {
    id: 'session',
    title: 'セッションを始める',
    description:
      '企業名を入力して新規セッションを作成。商談ごとに進捗を記録し、チェックポイントで準備状況を管理できます。',
    Illustration: SessionIllustration,
  },
  {
    id: 'flow',
    title: '5つのフェーズを辿る',
    description:
      '開始 → ヒアリング → 提案 → クロージング → フォローアップ。各フェーズはカラーで区別され、ノードをタップして詳細へ。',
    Illustration: FlowIllustration,
  },
  {
    id: 'detail',
    title: '詳細パネルを活用する',
    description:
      'ノードをタップすると、トークスクリプト・想定Q&A・関連資料を確認できます。実際の商談で使えるフレーズが満載。',
    Illustration: DetailIllustration,
  },
  {
    id: 'checkpoints',
    title: 'チェックポイントで進捗管理',
    description:
      '各ステップの確認項目をチェック。セッション全体の達成率がリアルタイムで更新されます。',
    Illustration: CheckpointIllustration,
  },
  {
    id: 'practice',
    title: '練習モードでスキルアップ',
    description:
      '営業役・顧客役を切り替えて、想定Q&Aを実践練習。正解率を追跡して弱点を把握。',
    Illustration: PracticeIllustration,
  },
  {
    id: 'tips',
    title: '便利な機能を使いこなす',
    description:
      '\u2318K で検索、\u2190 \u2192 でフェーズ移動、PDF出力でオフライン活用。セッション履歴のエクスポート/インポートも。',
    Illustration: TipsIllustration,
  },
]

const GUIDE_SEEN_KEY = 'dragon-sales-guide-seen'

export function hasSeenGuide(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return localStorage.getItem(GUIDE_SEEN_KEY) === 'true'
  } catch {
    return true
  }
}

export function markGuideSeen(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(GUIDE_SEEN_KEY, 'true')
  } catch {
    // localStorage unavailable
  }
}
