'use client'

import PricingCard from './ui/PricingCard'
import { siteContent } from '@/data/siteContent'

export default function Pricing () {
  const { heading, subheading, plans } = siteContent.pricing
  return (
    <section id="pricing" className="py-16 bg-background dark:bg-academic-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-academic-off-white mb-3">
            {heading}
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">{subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
