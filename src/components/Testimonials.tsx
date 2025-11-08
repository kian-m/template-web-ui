'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

import { siteContent } from '@/data/siteContent'

export default function Testimonials () {
    const { heading, subheading, items } = siteContent.testimonials
    const [ currentIndex, setCurrentIndex ] = useState(0)

    useEffect(() => {
        if (!items.length) {
            return
        }

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
        }, 8000)

        return () => clearInterval(interval)
    }, [items.length])

    if (!items.length) {
        return null
    }

    const currentTestimonial = items[currentIndex]

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }

    return (
        <section id="testimonials" className="py-20 lg:py-32 bg-zinc-100 dark:bg-academic-dark-blue/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-4 title-font">
                        {heading}
                    </h2>
                    <p className="text-lg sm:text-xl text-academic-medium-blue dark:text-academic-off-white max-w-2xl mx-auto">
                        {subheading}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative bg-white dark:bg-academic-navy rounded-3xl shadow-xl p-8 sm:p-12 transition-all duration-500">
                        <Quote className="w-10 h-10 text-academic-gold mb-6" />
                        <blockquote className="text-xl sm:text-2xl font-medium text-foreground dark:text-white leading-relaxed">
                            “{currentTestimonial.quote}”
                        </blockquote>
                        <div className="mt-8">
                            <p className="text-lg font-semibold text-foreground dark:text-academic-off-white">
                                {currentTestimonial.name}
                            </p>
                            <p className="text-sm uppercase tracking-wide text-academic-medium-blue dark:text-academic-off-white/70">
                                {currentTestimonial.role}
                            </p>
                        </div>
                        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-academic-gold text-academic-gold hover:bg-academic-gold hover:text-academic-navy transition-colors"
                                aria-label="Show previous testimonial"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <div className="flex-1 flex justify-center">
                                <div className="flex w-full max-w-xs sm:max-w-sm flex-wrap items-center justify-center gap-2">
                                    {items.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrentIndex(index)}
                                            className={`h-2.5 w-3 sm:w-4 rounded-full transition-all ${index === currentIndex ? 'bg-academic-gold' : 'bg-academic-gold/30'}`}
                                            aria-label={`Show testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-academic-gold text-academic-gold hover:bg-academic-gold hover:text-academic-navy transition-colors"
                                aria-label="Show next testimonial"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
