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
          <p className="text-xl text-academic-medium-blue dark:text-academic-off-white max-w-3xl mx-auto">{subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
        <p className="pt-2 text-center text-lg text-academic-medium-blue dark:text-academic-off-white mt-4">*In-person price adjustments are applied based on distance to stay minimal. <a href="mailto:amir@thebayareatutor.com" className="text-blue-600 hover:text-blue-800 underline">Email</a>, <a href="tel:+19252371327" className="text-blue-600 hover:text-blue-800 underline">call (925) 237-1327</a> or schedule a consultation for more accurate pricing.</p>    </section>
  )
}
