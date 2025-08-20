'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

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

export default function FAQ() {
    const [openItem, setOpenItem] = useState<number | null>(null)

    const toggleItem = (index: number) => {
        setOpenItem(openItem === index ? null : index)
    }

    const faqs: FAQItem[] = [
        {
            question: "How do you customize tutoring to work with my current classes?",
            answer: "I review your current coursework, understand your teachers' methods, and align my tutoring to support what you're learning in class. You get help that directly improves your classroom performance while building stronger foundations."
        },
        {
            question: "What makes your Bay Area knowledge valuable for students?",
            answer: "I know the teachers, curricula, and academic expectations at local high schools. This means your tutoring directly supports your classroom experience. I can prepare you for specific teacher styles and help you excel in your current environment."
        },
        {
            question: "Do you offer both test prep and academic tutoring?",
            answer: "Yes. You can get comprehensive support for SAT, ACT, and SAT Subject Tests, plus ongoing help with your high school courses. I create integrated plans that improve both your test scores and classroom grades."
        },
        {
            question: "Where do tutoring sessions take place?",
            answer: "You choose what works best. I offer sessions at your home, Bay Area libraries, or online. Each location provides a professional learning environment tailored to your preferences and schedule."
        },
        {
            question: "How quickly can I expect to see improvement?",
            answer: "Most students see improvements within 4-6 weeks of consistent tutoring. Your progress depends on your starting point, goals, and commitment. I track your progress and adjust our approach to ensure steady improvement."
        },
        {
            question: "What's included in the free consultation?",
            answer: "We discuss your academic goals, review your current challenges, and I explain how I can help you succeed. You'll get a clear understanding of my approach and a preliminary learning plan with no commitment required."
        }
    ]

    return (
        <section id="faq" className="py-20 lg:py-32 bg-academic-dark-blue">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <FAQIcon />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                            <span className="text-white">Frequently Asked</span>
                            <span className="block text-gradient">Questions</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
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
                                    <h3 className="text-lg font-semibold text-white pr-4 title-font">
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
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <div className="inline-block academic-card p-6">
                            <h3 className="text-xl font-bold text-white mb-3 title-font">Still have questions?</h3>
                            <p className="text-gray-300 mb-4">
                                Contact me directly to discuss your specific needs and goals
                            </p>
                            <button
                                onClick={() => {
                                    const element = document.getElementById('contact')
                                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="academic-button px-6 py-3 font-semibold rounded-lg"
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