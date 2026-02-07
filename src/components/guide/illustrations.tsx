'use client'

import { motion } from 'framer-motion'

// ─── 1. Welcome ─── Neon glow logo icon with pulse rings
export function WelcomeIllustration() {
  return (
    <div className="h-48 flex items-center justify-center relative">
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-neon-primary/30"
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{
            width: [80, 140 + i * 30],
            height: [80, 140 + i * 30],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Core circle */}
      <motion.div
        className="relative w-20 h-20 rounded-full bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center shadow-lg shadow-neon-primary/30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Flame SVG */}
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
          />
        </svg>
      </motion.div>

      {/* Orbiting dots */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-neon-primary/60"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          style={{
            top: `${50 + 42 * Math.sin((i * Math.PI) / 2)}%`,
            left: `${50 + 42 * Math.cos((i * Math.PI) / 2)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}

// ─── 2. Session ─── Company card creation mock
export function SessionIllustration() {
  return (
    <div className="h-48 flex items-center justify-center">
      <motion.div
        className="relative w-52 rounded-xl border border-border/60 bg-card/80 p-4 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Plus icon */}
        <motion.div
          className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neon-primary flex items-center justify-center shadow-md shadow-neon-primary/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </motion.div>

        {/* Company name bar */}
        <motion.div
          className="h-5 rounded bg-foreground/10 mb-3 flex items-center px-2"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span className="text-[10px] text-foreground/60 truncate">ABC Corporation</span>
        </motion.div>

        {/* Date bar */}
        <motion.div
          className="h-3 w-24 rounded bg-muted-foreground/10 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-muted-foreground">進捗</span>
            <motion.span
              className="text-[9px] font-mono text-neon-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              65%
            </motion.span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-primary to-neon-secondary"
              initial={{ width: '0%' }}
              animate={{ width: '65%' }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── 3. Flow ─── 5-color dot flow
export function FlowIllustration() {
  const phases = [
    { color: 'bg-emerald-400', label: '開始' },
    { color: 'bg-blue-400', label: 'ヒア' },
    { color: 'bg-purple-400', label: '提案' },
    { color: 'bg-amber-400', label: 'CL' },
    { color: 'bg-pink-400', label: 'FU' },
  ]

  return (
    <div className="h-48 flex items-center justify-center">
      <div className="flex items-center gap-2">
        {phases.map((phase, i) => (
          <div key={phase.label} className="flex items-center">
            <motion.div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-10 h-10 rounded-full ${phase.color} flex items-center justify-center shadow-md`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full border-2 border-white/30 absolute"
                  animate={i === 0 ? { scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span
                className="text-[9px] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.3 }}
              >
                {phase.label}
              </motion.span>
            </motion.div>

            {/* Connector line */}
            {i < phases.length - 1 && (
              <motion.div
                className="w-4 h-px bg-border/60 mx-0.5"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.15 + 0.1 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 4. Detail ─── Panel slide-in
export function DetailIllustration() {
  return (
    <div className="h-48 flex items-center justify-center gap-3 px-4">
      {/* Mini nodes */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-14 h-8 rounded-lg border ${
              i === 1 ? 'border-neon-primary/60 bg-neon-primary/10' : 'border-border/40 bg-card/50'
            } flex items-center justify-center`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-6 h-1 rounded-full ${i === 1 ? 'bg-neon-primary/60' : 'bg-muted-foreground/20'}`} />
          </motion.div>
        ))}
      </div>

      {/* Arrow */}
      <motion.svg
        className="w-5 h-5 text-neon-primary/60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ delay: 0.3, duration: 1.5, repeat: Infinity }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </motion.svg>

      {/* Panel mock */}
      <motion.div
        className="w-40 rounded-xl border border-border/60 bg-card/80 p-3 shadow-lg"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Phase badge */}
        <motion.div
          className="inline-flex h-4 rounded-full bg-blue-500/20 px-2 items-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-[8px] text-blue-400">ヒアリング</span>
        </motion.div>

        {/* Text lines */}
        {[0.7, 0.5, 0.85].map((w, i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded bg-muted-foreground/15 mb-1.5"
            style={{ width: `${w * 100}%` }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
          />
        ))}

        {/* Checkmark */}
        <motion.div
          className="flex items-center gap-1.5 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <svg className="w-2 h-2 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[8px] text-muted-foreground">確認済み</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── 5. Checkpoint ─── Checklist completion animation
export function CheckpointIllustration() {
  const items = ['事前調査の実施', '提案資料の準備', '想定Q&Aの確認', '日程の調整']

  return (
    <div className="h-48 flex items-center justify-center">
      <div className="w-52 space-y-2">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-1.5 flex-1 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />
          </div>
          <motion.span
            className="text-[10px] font-mono text-emerald-400 w-8 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            4/4
          </motion.span>
        </div>

        {/* Checklist */}
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4 + 0.3 }}
          >
            <motion.div
              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
              initial={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'transparent' }}
              animate={{
                borderColor: 'rgba(52, 211, 153, 0.6)',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
              }}
              transition={{ delay: i * 0.4 + 0.6 }}
            >
              <motion.svg
                className="w-2.5 h-2.5 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.4 + 0.6, duration: 0.3 }}
              >
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </motion.div>
            <span className="text-[10px] text-muted-foreground">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── 6. Practice ─── Role toggle with speech bubble
export function PracticeIllustration() {
  return (
    <div className="h-48 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Role toggle mock */}
        <motion.div
          className="flex rounded-full border border-border/60 bg-card/80 p-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <motion.div
            className="relative flex"
            animate={{ x: [0, 0, 0] }}
          >
            <motion.div
              className="absolute h-7 rounded-full bg-neon-primary/20 border border-neon-primary/40"
              animate={{
                x: [0, 72, 0],
                width: [72, 72, 72],
              }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
            />
            <div className="flex items-center justify-center w-[72px] h-7 px-3 z-10">
              <span className="text-[10px] font-medium text-foreground/80">営業役</span>
            </div>
            <div className="flex items-center justify-center w-[72px] h-7 px-3 z-10">
              <span className="text-[10px] font-medium text-foreground/80">顧客役</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Speech bubbles */}
        <div className="relative w-52 h-16">
          <motion.div
            className="absolute inset-0 rounded-xl border border-border/40 bg-card/60 p-2.5 flex items-start"
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
          >
            <div className="w-5 h-5 rounded-full bg-neon-primary/20 flex items-center justify-center flex-shrink-0 mr-2">
              <span className="text-[8px] text-neon-primary">営</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-32 rounded bg-muted-foreground/15" />
              <div className="h-1.5 w-24 rounded bg-muted-foreground/10" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 rounded-xl border border-border/40 bg-card/60 p-2.5 flex items-start"
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mr-2">
              <span className="text-[8px] text-amber-400">顧</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-28 rounded bg-muted-foreground/15" />
              <div className="h-1.5 w-20 rounded bg-muted-foreground/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── 7. Tips ─── 3-feature icon grid with rotating glow
export function TipsIllustration() {
  const features = [
    {
      icon: (
        <div className="flex items-center gap-0.5">
          <kbd className="h-4 rounded border border-border/60 bg-muted/50 px-1 text-[8px] font-mono text-muted-foreground">
            \u2318
          </kbd>
          <kbd className="h-4 rounded border border-border/60 bg-muted/50 px-1 text-[8px] font-mono text-muted-foreground">
            K
          </kbd>
        </div>
      ),
      label: '検索',
    },
    {
      icon: (
        <div className="flex items-center gap-0.5">
          <kbd className="h-4 rounded border border-border/60 bg-muted/50 px-1 text-[8px] font-mono text-muted-foreground">
            \u2190
          </kbd>
          <kbd className="h-4 rounded border border-border/60 bg-muted/50 px-1 text-[8px] font-mono text-muted-foreground">
            \u2192
          </kbd>
        </div>
      ),
      label: 'フェーズ移動',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
      label: 'PDF出力',
    },
  ]

  return (
    <div className="h-48 flex items-center justify-center">
      <div className="flex items-center gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.label}
            className="w-20 h-20 rounded-xl border border-border/40 bg-card/60 flex flex-col items-center justify-center gap-2"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          >
            <motion.div
              className="rounded-lg p-1.5"
              animate={{
                backgroundColor:
                  i === 0
                    ? ['rgba(0,255,170,0)', 'rgba(0,255,170,0.1)', 'rgba(0,255,170,0)']
                    : i === 1
                      ? ['rgba(0,255,170,0)', 'rgba(0,255,170,0)', 'rgba(0,255,170,0.1)', 'rgba(0,255,170,0)']
                      : ['rgba(0,255,170,0)', 'rgba(0,255,170,0)', 'rgba(0,255,170,0)', 'rgba(0,255,170,0.1)', 'rgba(0,255,170,0)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {feature.icon}
            </motion.div>
            <span className="text-[9px] text-muted-foreground">{feature.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
