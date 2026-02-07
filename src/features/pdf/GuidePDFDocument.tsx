'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj757w0g.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFE8j757w0g.ttf',
      fontWeight: 700,
    },
  ],
})

const NEON_PRIMARY = '#00ffaa'
const BRAND_COLOR = '#6366f1'

const phaseColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']

const steps = [
  {
    number: '01',
    title: 'Dragon Sales へようこそ',
    description:
      'AI研修営業のトークスクリプトを、フローチャートで可視化。商談の流れを直感的に理解し、実践力を磨きましょう。',
    tips: [
      'フローチャート上で全21ステップの営業プロセスを俯瞰できます',
      'ダークテーマで目に優しく、長時間の利用にも最適です',
    ],
  },
  {
    number: '02',
    title: 'セッションを始める',
    description:
      '企業名を入力して新規セッションを作成。商談ごとに進捗を記録し、チェックポイントで準備状況を管理できます。',
    tips: [
      'ヘッダーの「セッション」ボタンから新規作成・切替ができます',
      '進行中のセッションはWelcome画面に一覧表示されます',
      'セッション履歴からエクスポート/インポートも可能です',
    ],
  },
  {
    number: '03',
    title: '5つのフェーズを辿る',
    description:
      '開始 → ヒアリング → 提案 → クロージング → フォローアップ。各フェーズはカラーで区別され、ノードをタップして詳細へ。',
    tips: [
      '開始（緑）→ ヒアリング（青）→ 提案（紫）→ クロージング（黄）→ フォローアップ（ピンク）',
      '画面下部のプログレスバーからフェーズを直接選択できます',
      '← → キーでフェーズ間を移動できます',
    ],
  },
  {
    number: '04',
    title: '詳細パネルを活用する',
    description:
      'ノードをタップすると、トークスクリプト・想定Q&A・関連資料を確認できます。実際の商談で使えるフレーズが満載。',
    tips: [
      'トークスクリプト: メインの営業トーク文例を確認',
      '想定Q&A: 顧客からよくある質問と回答例',
      '関連資料: 各ステップで使う資料やツール',
      'Escキーでパネルを閉じることができます',
    ],
  },
  {
    number: '05',
    title: 'チェックポイントで進捗管理',
    description:
      '各ステップの確認項目をチェック。セッション全体の達成率がリアルタイムで更新されます。',
    tips: [
      '各ノードにはステップ固有のチェックポイントがあります',
      'チェック状況はセッションごとに自動保存されます',
      '達成率はフローチャート上のノードにも反映されます',
    ],
  },
  {
    number: '06',
    title: '練習モードでスキルアップ',
    description:
      '営業役・顧客役を切り替えて、想定Q&Aを実践練習。正解率を追跡して弱点を把握。',
    tips: [
      'ヘッダーの「練習モード」ボタンで開始',
      '営業役: 顧客の質問に対する回答を練習',
      '顧客役: 営業トークに対する想定質問を練習',
      '正解率で弱点ノードを特定できます',
    ],
  },
  {
    number: '07',
    title: '便利な機能を使いこなす',
    description:
      '\u2318K で検索、\u2190 \u2192 でフェーズ移動、PDF出力でオフライン活用。セッション履歴のエクスポート/インポートも。',
    tips: [
      '\u2318K (Ctrl+K): ノード・キーワード検索',
      '? キー: キーボードショートカット一覧',
      '\u2190 \u2192 キー: フェーズ間ナビゲーション',
      'Esc キー: パネル・ダイアログを閉じる',
      'PDF出力: トークスクリプト全体をPDFでダウンロード',
    ],
  },
]

const s = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  // Cover
  coverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: BRAND_COLOR,
    marginBottom: 8,
  },
  coverSub: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
  },
  coverDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLOR,
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: 700,
    color: BRAND_COLOR,
  },
  headerLogoSub: {
    fontSize: 18,
    fontWeight: 400,
    color: '#64748b',
  },
  headerRight: {
    fontSize: 10,
    color: '#94a3b8',
  },
  // Step
  stepContainer: {
    marginBottom: 28,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffffff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f172a',
    flex: 1,
  },
  stepDescription: {
    fontSize: 11,
    lineHeight: 1.7,
    color: '#334155',
    marginBottom: 10,
    paddingLeft: 44,
  },
  tipsBox: {
    marginLeft: 44,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: NEON_PRIMARY,
  },
  tipsLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#10b981',
    marginBottom: 6,
  },
  tipItem: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 3,
  },
  // Phase legend
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseLabel: {
    fontSize: 10,
    color: '#475569',
  },
  // Footer
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#94a3b8',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 35,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#94a3b8',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 20,
  },
})

export function GuidePDFDocument() {
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const phaseNames = ['開始', 'ヒアリング', '提案', 'クロージング', 'フォローアップ']

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" style={s.page}>
        <View style={s.coverContainer}>
          <Text style={s.coverTitle}>Dragon Sales</Text>
          <Text style={s.coverSub}>使い方ガイド</Text>
          <View style={{ alignItems: 'center', marginBottom: 30 }}>
            {phaseNames.map((name, i) => (
              <View key={name} style={s.phaseRow}>
                <View style={[s.phaseDot, { backgroundColor: phaseColors[i] }]} />
                <Text style={s.phaseLabel}>{name}</Text>
              </View>
            ))}
          </View>
          <Text style={s.coverDate}>{currentDate}</Text>
        </View>
        <Text style={s.footer}>Dragon AI - Confidential</Text>
      </Page>

      {/* Steps */}
      <Page size="A4" style={s.page} wrap>
        <View style={s.header}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={s.headerLogo}>Dragon</Text>
            <Text style={s.headerLogoSub}> Sales</Text>
            <Text style={[s.headerLogoSub, { marginLeft: 8 }]}>使い方ガイド</Text>
          </View>
          <Text style={s.headerRight}>{currentDate}</Text>
        </View>

        {steps.map((step, i) => (
          <View key={step.number} style={s.stepContainer} wrap={false}>
            {i > 0 && <View style={s.separator} />}
            <View style={s.stepHeader}>
              <View style={s.stepNumber}>
                <Text style={s.stepNumberText}>{step.number}</Text>
              </View>
              <Text style={s.stepTitle}>{step.title}</Text>
            </View>
            <Text style={s.stepDescription}>{step.description}</Text>
            {step.tips.length > 0 && (
              <View style={s.tipsBox}>
                <Text style={s.tipsLabel}>ポイント</Text>
                {step.tips.map((tip, j) => (
                  <Text key={j} style={s.tipItem}>
                    {'  \u2022  '}{tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <Text
          style={s.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
        <Text style={s.footer} fixed>
          Dragon AI - Confidential
        </Text>
      </Page>
    </Document>
  )
}
