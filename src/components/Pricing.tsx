'use client'

import { Calendar } from 'lucide-react'
import { siteContent } from '@/data/siteContent'

export default function Pricing() {
    const { subheading, plans } = siteContent.pricing

    const scrollToContact = () => {
        const element = document.getElementById('contact')
        if (element) element.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section id="pricing" className="py-20 lg:py-32 bg-academic-dark-blue">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                        <span className="text-white">Investment in</span>
                        <span className="block text-gradient">Your Child's Future</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                        {subheading}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="academic-card p-8 text-center academic-hover">
                            <h3 className="text-xl font-bold text-white mb-4 title-font">{plan.name}</h3>
                            <div className="text-4xl font-bold text-academic-gold mb-4">
                                ${plan.price}
                                <span className="text-lg text-gray-300">{plan.unit}</span>
                            </div>
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="text-gray-300 text-sm">{feature}</li>
                                ))}
                            </ul>
                            <button
                                onClick={scrollToContact}
                                className="academic-button w-full px-4 py-3 font-semibold rounded-md flex items-center justify-center space-x-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>{plan.cta}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
