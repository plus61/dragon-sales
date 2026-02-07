'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pdf } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { onboardingSteps, markGuideSeen } from './onboarding-steps'
import { GuidePDFDocument } from '@/features/pdf/GuidePDFDocument'

interface OnboardingGuideProps {
  isOpen: boolean
  onClose: () => void
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

const slideTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

export function OnboardingGuide({ isOpen, onClose }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const totalSteps = onboardingSteps.length
  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === totalSteps - 1

  const handleNext = useCallback(() => {
    if (isLastStep) {
      markGuideSeen()
      setCurrentStep(0)
      onClose()
      return
    }
    setDirection(1)
    setCurrentStep((prev) => prev + 1)
  }, [isLastStep, onClose])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  const handleSkip = useCallback(() => {
    markGuideSeen()
    setCurrentStep(0)
    onClose()
  }, [onClose])

  const handleDownloadPDF = useCallback(async () => {
    setIsGeneratingPDF(true)
    try {
      const blob = await pdf(<GuidePDFDocument />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const date = new Date().toISOString().split('T')[0]
      link.download = `dragon-sales-guide-${date}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Guide PDF generation failed:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [])

  const handleDotClick = useCallback(
    (index: number) => {
      setDirection(index > currentStep ? 1 : -1)
      setCurrentStep(index)
    },
    [currentStep]
  )

  if (!isOpen) return null

  const StepIllustration = step.Illustration

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] backdrop-blur-md bg-black/60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleSkip}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-card/95 border border-border/40 gradient-border overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
              {/* Header: Skip + Step counter */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-muted-foreground">
                  {currentStep + 1}/{totalSteps}
                </div>
                {!isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    スキップ
                  </button>
                )}
              </div>

              {/* Illustration area */}
              <div className="rounded-xl bg-gradient-to-br from-background/50 to-muted/30 overflow-hidden mb-5">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                  >
                    <StepIllustration />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`content-${step.id}`}
                  custom={direction}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold tracking-tight mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                {onboardingSteps.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className={`h-2 rounded-full transition-colors ${
                      i === currentStep
                        ? 'bg-neon-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    animate={{ width: i === currentStep ? 24 : 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    aria-label={`ステップ ${i + 1}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                {currentStep > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg className="mr-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    戻る
                  </Button>
                ) : (
                  <div />
                )}

                {isLastStep ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="border-border/40 hover:border-neon-secondary/60 hover:bg-neon-secondary/10"
                    >
                      {isGeneratingPDF ? (
                        <svg className="mr-1.5 h-3.5 w-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-neon-primary to-neon-secondary hover:from-neon-primary/90 hover:to-neon-secondary/90 text-white font-semibold neon-pulse px-6"
                    >
                      始めましょう!
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-neon-primary hover:bg-neon-primary/90 text-white px-6"
                  >
                    次へ
                    <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
