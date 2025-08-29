'use client'

import PricingCard from './ui/PricingCard'
import { siteContent } from '@/data/siteContent'
import Button from './ui/Button'
import { useCal } from './CalProvider'

export default function Pricing () {
  const { heading, subheading, plans } = siteContent.pricing
  const { open } = useCal()
  return (
    <section id="pricing" className="py-16 bg-background dark:bg-academic-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-academic-off-white mb-3">
            {heading}
          </h2>
          <p className="text-xl text-academic-medium-blue dark:text-academic-off-white max-w-3xl mx-auto">{subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
      <div className="pt-3 text-center text-lg mt-4">
        <p className="text-academic-medium-blue dark:text-academic-off-white mb-4">
          In-person pricing is determined on a case-by-case basis. Schedule a consultation to discuss options.
        </p>
        <Button
          onClick={() => open('https://cal.com/thebayarea/consultation?embed=1')}
          variant="primary"
          className="schedule-trigger"
          phEvent="pricing_schedule_now_click"
        >
          Schedule Now
        </Button>
      </div>
    </section>
  )
}
