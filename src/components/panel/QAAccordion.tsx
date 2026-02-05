'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { type QA } from '@/types/script'

interface QAAccordionProps {
  qaList: QA[]
}

export function QAAccordion({ qaList }: QAAccordionProps) {
  if (qaList.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">❓</span>
        <h3 className="text-sm font-semibold text-foreground">想定Q&A</h3>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {qaList.map((qa, index) => (
          <AccordionItem
            key={index}
            value={`qa-${index}`}
            className="border border-border/40 rounded-lg bg-muted/30 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 text-sm text-left hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-medium shrink-0">Q.</span>
                <span className="text-foreground/90">{qa.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex items-start gap-2 pt-2 border-t border-border/30">
                <span className="text-neon-primary font-medium shrink-0">A.</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
