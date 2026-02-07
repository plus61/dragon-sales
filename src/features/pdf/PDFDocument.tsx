'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { type ScriptNode, type Phase } from '@/types/script'

// Register Japanese font (using Noto Sans JP from Google Fonts CDN)
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

const phaseLabels: Record<Phase, string> = {
  opening: '開始',
  hearing: 'ヒアリング',
  proposal: '提案',
  closing: 'クロージング',
  followup: 'フォローアップ',
}

const phaseColors: Record<Phase, string> = {
  opening: '#10b981',
  hearing: '#3b82f6',
  proposal: '#8b5cf6',
  closing: '#f59e0b',
  followup: '#ec4899',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    backgroundColor: '#ffffff',
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: '#6366f1',
  },
  logoSub: {
    fontSize: 24,
    fontWeight: 400,
    color: '#64748b',
  },
  date: {
    fontSize: 10,
    color: '#64748b',
  },
  nodeSection: {
    marginBottom: 20,
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 700,
  },
  nodeTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0a0a0f',
    flex: 1,
  },
  duration: {
    fontSize: 10,
    color: '#64748b',
  },
  scriptContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  scriptLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6366f1',
    marginBottom: 6,
  },
  scriptText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#1e293b',
  },
  tipsContainer: {
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#10b981',
  },
  tipsLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#10b981',
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  checkpointsContainer: {
    marginTop: 8,
  },
  checkpointsLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#f59e0b',
    marginBottom: 4,
  },
  checkpointItem: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
    flexDirection: 'row',
  },
  checkBox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginRight: 6,
    marginTop: 1,
  },
  qaContainer: {
    marginTop: 8,
  },
  qaLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  qaItem: {
    marginBottom: 6,
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
  },
  question: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
  },
  answer: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  actionsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionsLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ec4899',
    marginBottom: 4,
    width: '100%',
  },
  actionBadge: {
    fontSize: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#94a3b8',
  },
  footer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 35,
    right: 35,
    textAlign: 'center',
    color: '#94a3b8',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginVertical: 15,
  },
})

interface PDFDocumentProps {
  nodes: ScriptNode[]
}

export function SalesScriptPDFDocument({ nodes }: PDFDocumentProps) {
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Group nodes by phase
  const nodesByPhase = nodes.reduce(
    (acc, node) => {
      if (!acc[node.phase]) {
        acc[node.phase] = []
      }
      acc[node.phase].push(node)
      return acc
    },
    {} as Record<Phase, ScriptNode[]>
  )

  const phaseOrder: Phase[] = ['opening', 'hearing', 'proposal', 'closing', 'followup']

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 36, fontWeight: 700, color: '#6366f1', marginBottom: 10 }}>
            Dragon Sales
          </Text>
          <Text style={{ fontSize: 18, color: '#64748b', marginBottom: 40 }}>
            AI研修 営業トークスクリプト
          </Text>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>{currentDate}</Text>
        </View>
        <Text style={styles.footer}>Dragon AI - Confidential</Text>
      </Page>

      {/* Content Pages */}
      {phaseOrder.map((phase) => {
        const phaseNodes = nodesByPhase[phase]
        if (!phaseNodes || phaseNodes.length === 0) return null

        return (
          <Page key={phase} size="A4" style={styles.page} wrap>
            <View style={styles.header}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.logo}>Dragon</Text>
                <Text style={styles.logoSub}> Sales</Text>
              </View>
              <Text style={styles.date}>{currentDate}</Text>
            </View>

            {/* Phase Title */}
            <View
              style={{
                backgroundColor: phaseColors[phase],
                padding: 10,
                borderRadius: 6,
                marginBottom: 15,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                {phaseLabels[phase]}フェーズ
              </Text>
            </View>

            {phaseNodes.map((node, index) => (
              <View key={node.id} style={styles.nodeSection} wrap={false}>
                {/* Node Header */}
                <View style={styles.nodeHeader}>
                  <View
                    style={[styles.phaseBadge, { backgroundColor: phaseColors[node.phase] }]}
                  >
                    <Text>{phaseLabels[node.phase]}</Text>
                  </View>
                  <Text style={styles.nodeTitle}>{node.title}</Text>
                  <Text style={styles.duration}>{node.duration}</Text>
                </View>

                {/* Main Script */}
                <View style={styles.scriptContainer}>
                  <Text style={styles.scriptLabel}>トークスクリプト</Text>
                  <Text style={styles.scriptText}>{node.script.main}</Text>

                  {/* Tips */}
                  {node.script.tips && node.script.tips.length > 0 && (
                    <View style={styles.tipsContainer}>
                      <Text style={styles.tipsLabel}>ポイント</Text>
                      {node.script.tips.map((tip, tipIndex) => (
                        <Text key={tipIndex} style={styles.tipItem}>
                          • {tip}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                {/* Checkpoints */}
                {node.checkpoints.length > 0 && (
                  <View style={styles.checkpointsContainer}>
                    <Text style={styles.checkpointsLabel}>チェックポイント</Text>
                    {node.checkpoints.map((checkpoint, cpIndex) => (
                      <View key={cpIndex} style={styles.checkpointItem}>
                        <View style={styles.checkBox} />
                        <Text style={{ fontSize: 9, color: '#475569' }}>{checkpoint}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Q&A */}
                {node.qa.length > 0 && (
                  <View style={styles.qaContainer}>
                    <Text style={styles.qaLabel}>想定Q&A</Text>
                    {node.qa.map((qa, qaIndex) => (
                      <View key={qaIndex} style={styles.qaItem}>
                        <Text style={styles.question}>Q: {qa.question}</Text>
                        <Text style={styles.answer}>A: {qa.answer}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Actions */}
                {node.actions.length > 0 && (
                  <View style={styles.actionsContainer}>
                    <Text style={styles.actionsLabel}>次のアクション</Text>
                    {node.actions.map((action, actionIndex) => (
                      <Text key={actionIndex} style={styles.actionBadge}>
                        {action.label}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Separator (except for last item) */}
                {index < phaseNodes.length - 1 && <View style={styles.separator} />}
              </View>
            ))}

            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
              fixed
            />
            <Text style={styles.footer} fixed>
              Dragon AI - Confidential
            </Text>
          </Page>
        )
      })}
    </Document>
  )
}
