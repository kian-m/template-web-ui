'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { siteContent } from '@/data/siteContent'
import { createSlug } from '@/utils/formatters'
import { captureEvent } from '../../analytics/utils'

// FAQ SVG Icon
const FAQIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,10.27 15.45,11.4 14.59,12.26L15.07,11.25M13,19V17H11V19H13Z"/>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
)

interface FAQItem {
    question: string
    answer: string
}

export default function FAQ () {
    const [ openItem, setOpenItem ] = useState<number | null>(null)

    const toggleItem = (index: number) => {
        const isOpening = openItem !== index
        setOpenItem(isOpening ? index : null)
        const faq = faqs[index]
        captureEvent(`faq_toggle_${createSlug(faq.question)}` , {
            faq_id: createSlug(faq.question),
            question: faq.question,
            state: isOpening ? 'open' : 'close',
        })
    }

    const faqs: FAQItem[] = siteContent.faq.items.map(item => ({
        question: item.question,
        answer: item.answer
    }))

    return (
        <section id="faq" className="py-20 lg:py-32 bg-background dark:bg-academic-dark-blue">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <FAQIcon />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                            <span className="text-foreground dark:text-white">Frequently Asked</span>
                            <span className="block text-academic-gold dark:text-gradient">Questions</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-academic-medium-blue dark:text-academic-off-white max-w-2xl mx-auto">
                            Get answers to common questions about my tutoring services and approach
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="academic-card academic-hover">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full p-6 text-left flex items-center justify-between focus:outline-none"
                                >
                                    <h3 className="text-lg font-semibold text-foreground dark:text-white pr-4 title-font">
                                        {faq.question}
                                    </h3>
                                    <div className="text-academic-gold flex-shrink-0">
                                        {openItem === index ? (
                                            <ChevronUp className="w-6 h-6" />
                                        ) : (
                                            <ChevronDown className="w-6 h-6" />
                                        )}
                                    </div>
                                </button>

                                <div className={`faq-content ${openItem === index ? 'open' : ''}`}>
                                    <div className="px-6 pb-6">
                                        <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-block academic-card p-6">
                            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3 title-font">Still have questions?</h3>
                            <p className="text-academic-medium-blue dark:text-academic-off-white mb-4">
                                Contact me directly to discuss your specific needs and goals
                            </p>
                            <button
                                onClick={() => {
                                    const element = document.getElementById('contact')
                                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="academic-button px-6 py-3 font-semibold rounded-lg"
                                data-ph-event="faq_ask_question_click"
                            >
                                Ask Your Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}