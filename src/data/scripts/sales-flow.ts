import { type ScriptNode, type FlowEdge } from "@/types/script"

export const scriptNodes: ScriptNode[] = [
  {
    id: "opening-1",
    phase: "opening",
    title: "アポイント確認・アイスブレイク",
    duration: "3-5分",
    script: {
      main: `本日はお時間をいただきありがとうございます。
○○株式会社の△△と申します。

本日は、御社のAI活用に関する課題やご要望をお伺いし、
弊社のAI研修サービスがお役に立てるかどうか、
一緒に確認させていただければと思います。

まずは、御社の現状について教えていただけますか？`,
      tips: [
        "相手の名前を確認して呼びかける",
        "名刺交換がまだなら先に行う",
        "時間の確認（60分程度のお時間をいただけますか？）",
      ],
    },
    checkpoints: [
      "時間の確認ができた",
      "担当者の役職・部署を把握した",
      "アイスブレイクで場が和んだ",
    ],
    qa: [
      {
        question: "御社について詳しく教えていただけますか？",
        answer:
          "弊社Dragon AIは、企業向けAI研修に特化した会社です。ChatGPTやClaude等の生成AIの業務活用から、エンジニア向けのMLOps研修まで、幅広いプログラムを提供しています。導入実績は300社以上、受講者満足度は98%を達成しています。",
      },
    ],
    actions: [
      { label: "次へ進む", nextNodeId: "hearing-1", style: "primary" },
    ],
    position: { x: 250, y: 50 },
  },
  {
    id: "hearing-1",
    phase: "hearing",
    title: "現状の課題ヒアリング",
    duration: "10-15分",
    script: {
      main: `御社では現在、社員のAIリテラシー向上に関して、
どのような取り組みをされていますか？

また、AI活用において、どのような課題を感じていらっしゃいますか？

具体的に、どの部署や業務でAIを活用したいとお考えですか？`,
      tips: [
        "オープンクエスチョンで相手に話してもらう",
        "メモを取りながら聞く姿勢を見せる",
        "「なるほど」「確かに」など相槌を適度に入れる",
      ],
    },
    checkpoints: [
      "現状のAI活用状況を把握した",
      "具体的な課題を3つ以上聞き出した",
      "対象部署・人数を確認した",
      "予算感を確認した",
      "決裁者・決裁フローを把握した",
    ],
    qa: [
      {
        question: "他社はどんな研修をしていますか？",
        answer:
          "業種によって異なりますが、最近は全社員向けの生成AIリテラシー研修から始める企業が多いです。その後、営業部門向けのプロンプトエンジニアリング研修や、開発部門向けのAIコード生成研修など、部門特化型に展開するケースが増えています。",
      },
      {
        question: "研修の効果測定はどうしていますか？",
        answer:
          "研修前後でのスキルテスト、業務効率化の定量データ（作業時間削減率など）、受講者アンケート、3ヶ月後のフォローアップ調査など、複数の指標で効果を測定しています。導入企業では平均30%の業務効率化を実現しています。",
      },
    ],
    actions: [
      { label: "課題が明確", nextNodeId: "proposal-1", style: "primary" },
      {
        label: "追加ヒアリング必要",
        nextNodeId: "hearing-2",
        style: "secondary",
      },
      { label: "ニーズなし", nextNodeId: "followup-1", style: "warning" },
    ],
    position: { x: 250, y: 200 },
  },
  {
    id: "hearing-2",
    phase: "hearing",
    title: "深堀りヒアリング",
    duration: "5-10分",
    script: {
      main: `もう少し詳しくお聞かせください。

・その課題が解決されると、どのような状態になりますか？
・現在、その課題によってどのくらいのコストがかかっていますか？
・いつまでに解決したいとお考えですか？`,
      tips: [
        "課題の影響度を数値化してもらう",
        "理想の状態を具体的にイメージしてもらう",
        "緊急度・重要度を確認する",
      ],
    },
    checkpoints: [
      "課題の影響度を数値で把握した",
      "解決後の理想状態を確認した",
      "タイムラインを把握した",
    ],
    qa: [
      {
        question: "すぐに始められますか？",
        answer:
          "はい、最短2週間でキックオフ可能です。ただし、御社の課題に合わせたカスタマイズを行う場合は、1ヶ月程度の準備期間をいただくことをお勧めしています。",
      },
    ],
    actions: [
      { label: "提案へ進む", nextNodeId: "proposal-1", style: "primary" },
    ],
    position: { x: 500, y: 200 },
  },
  {
    id: "proposal-1",
    phase: "proposal",
    title: "ソリューション提案",
    duration: "10-15分",
    script: {
      main: `お聞きした課題を整理させていただきますと...

【課題1】○○○
【課題2】○○○
【課題3】○○○

これらの課題に対して、弊社では以下のソリューションをご提案いたします。

1. 全社員向けAIリテラシー研修（半日×2回）
2. 営業部門向けプロンプトエンジニアリング実践研修（1日）
3. 3ヶ月間のフォローアップサポート

導入効果として、過去の実績では...`,
      tips: [
        "相手の言葉を使って課題を整理する",
        "ソリューションと課題を明確に紐づける",
        "具体的な数字・事例を提示する",
      ],
    },
    checkpoints: [
      "課題とソリューションの紐付けができた",
      "導入効果を具体的に説明できた",
      "競合との差別化ポイントを伝えた",
      "価格感を伝えた",
    ],
    qa: [
      {
        question: "費用はどのくらいですか？",
        answer:
          "研修の規模や内容によって異なりますが、全社員100名向けの標準プランで、150万円〜が目安となります。詳細なお見積りは、御社の要件を確認した上で作成させていただきます。",
      },
      {
        question: "オンラインでも対応可能ですか？",
        answer:
          "はい、対面・オンライン・ハイブリッド、いずれの形式にも対応しています。オンラインの場合は、Zoom/Teams/Meetなど、御社でお使いのツールに合わせて実施可能です。",
      },
      {
        question: "研修内容はカスタマイズできますか？",
        answer:
          "もちろんです。御社の業務フローや使用ツールに合わせて、研修内容を最適化いたします。事前に御社の業務をヒアリングし、実際の業務で使える演習問題を作成します。",
      },
    ],
    actions: [
      { label: "興味あり", nextNodeId: "closing-1", style: "primary" },
      { label: "検討必要", nextNodeId: "closing-2", style: "secondary" },
      { label: "見送り", nextNodeId: "followup-1", style: "warning" },
    ],
    position: { x: 250, y: 350 },
  },
  {
    id: "closing-1",
    phase: "closing",
    title: "クロージング（前向き）",
    duration: "5-10分",
    script: {
      main: `ありがとうございます。
それでは、次のステップとして、
正式なお見積りと研修プログラムの詳細をお送りいたします。

来週中にご確認いただき、
再来週にお打ち合わせの場を設けさせていただけますでしょうか？

○月○日（○）と○月○日（○）でしたら、どちらがご都合よろしいでしょうか？`,
      tips: [
        "二者択一で日程を提案する",
        "次のアクションを明確にする",
        "決裁者への同席依頼を検討する",
      ],
    },
    checkpoints: [
      "次回打ち合わせの日程を確定した",
      "必要な資料・見積りを確認した",
      "同席者を確認した",
    ],
    qa: [
      {
        question: "稟議に必要な資料はありますか？",
        answer:
          "はい、会社概要、サービス概要資料、導入事例集、お見積書をお送りいたします。その他、稟議に必要な資料があれば、お知らせください。ROI計算書や比較表なども作成可能です。",
      },
    ],
    actions: [
      {
        label: "日程確定",
        nextNodeId: "followup-2",
        style: "primary",
      },
    ],
    position: { x: 100, y: 500 },
  },
  {
    id: "closing-2",
    phase: "closing",
    title: "クロージング（検討中）",
    duration: "5-10分",
    script: {
      main: `承知いたしました。
ご検討いただけるとのこと、ありがとうございます。

検討にあたって、何か追加でご質問や
必要な情報はございますでしょうか？

また、いつ頃までにご検討いただけそうでしょうか？
こちらからフォローアップのご連絡を差し上げたいと思います。`,
      tips: [
        "検討のボトルネックを探る",
        "競合検討の有無を確認する",
        "次回連絡のタイミングを決める",
      ],
    },
    checkpoints: [
      "検討期間を確認した",
      "追加で必要な情報を確認した",
      "次回連絡日を決めた",
    ],
    qa: [
      {
        question: "他社も検討していますか？",
        answer:
          "比較検討されることは大切なことです。もしよろしければ、比較ポイントをお教えいただけますか？弊社の強みをお伝えできるかもしれません。",
      },
    ],
    actions: [
      {
        label: "フォローアップ設定",
        nextNodeId: "followup-1",
        style: "primary",
      },
    ],
    position: { x: 400, y: 500 },
  },
  {
    id: "followup-1",
    phase: "followup",
    title: "フォローアップ設定",
    duration: "2-3分",
    script: {
      main: `本日は貴重なお時間をいただき、ありがとうございました。

本日お話しした内容をまとめたサマリーと、
追加資料を本日中にメールでお送りいたします。

○月○日（○）にフォローアップのお電話を差し上げてもよろしいでしょうか？`,
      tips: [
        "必ず次のアクションを設定する",
        "サマリーメールを当日中に送る",
        "フォローアップの許可を得る",
      ],
    },
    checkpoints: [
      "フォローアップ日程を設定した",
      "送付資料を確認した",
      "お礼を伝えた",
    ],
    qa: [],
    actions: [
      { label: "完了", nextNodeId: "followup-2", style: "primary" },
    ],
    position: { x: 250, y: 650 },
  },
  {
    id: "followup-2",
    phase: "followup",
    title: "商談完了",
    duration: "-",
    script: {
      main: `商談完了

【次のアクション】
□ サマリーメール送付
□ 見積書作成
□ カレンダー登録
□ CRM更新`,
      tips: [
        "48時間以内にフォローアップメールを送る",
        "約束した資料は必ず期限内に送付",
        "CRMに詳細を記録する",
      ],
    },
    checkpoints: ["サマリーメール送付完了", "CRM更新完了"],
    qa: [],
    actions: [],
    position: { x: 250, y: 800 },
  },
]

export const scriptEdges: FlowEdge[] = [
  { id: "e-opening-hearing", source: "opening-1", target: "hearing-1" },
  { id: "e-hearing-1-2", source: "hearing-1", target: "hearing-2" },
  { id: "e-hearing-1-proposal", source: "hearing-1", target: "proposal-1" },
  { id: "e-hearing-1-followup", source: "hearing-1", target: "followup-1" },
  { id: "e-hearing-2-proposal", source: "hearing-2", target: "proposal-1" },
  { id: "e-proposal-closing1", source: "proposal-1", target: "closing-1" },
  { id: "e-proposal-closing2", source: "proposal-1", target: "closing-2" },
  { id: "e-proposal-followup", source: "proposal-1", target: "followup-1" },
  { id: "e-closing1-followup2", source: "closing-1", target: "followup-2" },
  { id: "e-closing2-followup1", source: "closing-2", target: "followup-1" },
  { id: "e-followup1-2", source: "followup-1", target: "followup-2" },
]
