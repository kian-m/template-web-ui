'use client'

import { ArrowRight, Star, MapPin, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import { useCal } from './CalProvider'

// Academic Achievement SVG Icon
const AcademicIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
)

export default function Hero () {
    const { open } = useCal()

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Academic-style gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-academic-navy via-academic-dark-blue to-academic-navy">
                <div className="absolute inset-0 bg-gradient-to-r from-academic-gold/10 via-transparent to-academic-gold/5"></div>
            </div>

            {/* Subtle background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-2 h-2 bg-academic-gold rounded-full animate-pulse-slow"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse-slow delay-1000"></div>
                <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-academic-gold rounded-full animate-pulse-slow delay-500"></div>
                <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse-slow delay-700"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-academic-gold/20 backdrop-blur-sm border border-academic-gold/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
                        <AcademicIcon />
                        <span className="text-sm font-medium text-white">UC Berkeley Graduate • 15+ Years Experience</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up title-font">
                        <span className="block text-white leading-tight">Bay Area's</span>
                        <span className="block text-gradient leading-tight">Premier Tutor</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto animate-slide-up delay-200 leading-relaxed">
                        You deserve the best academic support. I provide expert tutoring for SAT, ACT, SAT Subject Tests,
                        and comprehensive school support. Familiar with Bay Area curricula and teachers.
                    </p>

                    {/* Location Badge */}
                    <div className="inline-flex items-center space-x-2 bg-academic-medium-blue/50 backdrop-blur-sm border border-academic-gold/20 rounded-full px-4 py-2 mb-8 animate-slide-up delay-300">
                        <MapPin className="w-4 h-4 text-academic-gold" />
                        <span className="text-sm text-white">In-Person* & Online • Bay Area Libraries & Your Home</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up delay-400">
                        <button
                            onClick={() => open()}
                            className="schedule-trigger academic-button px-8 py-4 text-lg font-semibold rounded-lg flex items-center space-x-2 w-full sm:w-auto"
                        >
                            <span>Schedule Free Consultation</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('services')
                                if (element) element.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white/20 hover:border-academic-gold/50 text-white hover:bg-academic-gold/10 transition-all duration-300 w-full sm:w-auto"
                        >
                            View Services
                        </button>
                    </div>

                    {/* School Logos */}
                    <div className="mt-12 animate-slide-up delay-500">
                        <p className="text-sm text-gray-400 mb-4">
                            Trusted by families from these East Bay schools:
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
                            <Image
                                src="/logos/acalanes.svg"
                                alt="Acalanes High School logo"
                                className="h-12 w-auto"
                                width={120}
                                height={48}
                                data-name="Acalanes High School"
                                data-phone="925-280-3970"
                            />
                            <Image
                                src="/logos/campolindo.svg"
                                alt="Campolindo High School logo"
                                className="h-12 w-auto"
                                width={120}
                                height={48}
                                data-name="Campolindo High School"
                                data-phone="925-280-3950"
                            />
                            <Image
                                src="/logos/laslomas.svg"
                                alt="Las Lomas High School logo"
                                className="h-12 w-auto"
                                width={120}
                                height={48}
                                data-name="Las Lomas High School"
                                data-phone="925-280-3920"
                            />
                            <Image
                                src="/logos/miramonte.svg"
                                alt="Miramonte High School logo"
                                className="h-12 w-auto"
                                width={120}
                                height={48}
                                data-name="Miramonte High School"
                                data-phone="925-280-3930"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}