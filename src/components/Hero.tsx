'use client'
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, MapPin } from 'lucide-react'
import { useCal } from './CalProvider'

// Academic Achievement SVG Icon
const AcademicIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
)

const schoolLogos = [
    {
        src: 'https://www.acalanes.k12.ca.us/cms/lib/CA01001364/Centricity/Template/GlobalAssets/images/Logos/Acalanes_A.png',
        alt: 'Acalanes High School logo',
        name: 'Acalanes High School',
        phone: '925-280-3970'
    },
    {
        src: 'https://www.acalanes.k12.ca.us/cms/lib/CA01001364/Centricity/Template/GlobalAssets/images/Logos/BlockC.png',
        alt: 'Campolindo High School logo',
        name: 'Campolindo High School',
        phone: '925-280-3950'
    },
    {
        src: '/las-lomas.svg',
        alt: 'Las Lomas High School logo',
        name: 'Las Lomas High School',
        phone: '925-280-3920'
    },
    {
        src: 'https://www.acalanes.k12.ca.us/cms/lib/CA01001364/Centricity/Template/GlobalAssets/images/Logos/2020%20Block%20M.jpg',
        alt: 'Miramonte High School logo',
        name: 'Miramonte High School',
        phone: '925-280-3930'
    },
    {
        src: '/carondelet.svg',
        alt: 'Carondelet High School logo',
        name: 'Carondelet High School',
        phone: '925-686-5353'
    },
    {
        src: 'https://resources.finalsite.net/images/v1689581096/delasallehigh/ruhsaayrud0sfww3csrt/header-logo.svg',
        alt: 'De La Salle High School logo',
        name: 'De La Salle High School',
        phone: '925-288-8100'
    }
]

export default function Hero () {
    const { open } = useCal()

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background dark:bg-academic-navy">
            {/* Academic-style gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-academic-off-white via-academic-light-blue/20 to-academic-off-white dark:from-academic-navy dark:via-academic-dark-blue dark:to-academic-navy">
                <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-academic-gold/10 dark:via-transparent dark:to-academic-gold/5"></div>
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
                        <span className="text-sm font-medium text-foreground dark:text-white">UC Berkeley Graduate • 15+ Years Experience</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up title-font">
                        <span className="block text-foreground dark:text-white leading-tight">Your Local</span>
                        <span className="block text-academic-gold dark:text-gradient leading-tight">Bay Area Premier Tutor</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-lg sm:text-xl lg:text-2xl text-academic-medium-blue dark:text-academic-off-white mb-8 max-w-4xl mx-auto animate-slide-up delay-200 leading-relaxed">
                        Offering the best academic support. Providing expert tutoring for SAT, ACT, SAT Subject Tests,
                        and comprehensive school support. Familiar with Bay Area curricula and teachers.
                    </p>

                    {/* Location Badge */}
                    <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-academic-medium-blue/50 backdrop-blur-sm border border-academic-gold/20 rounded-full px-4 py-2 mb-8 animate-slide-up delay-300">
                        <MapPin className="w-4 h-4 text-academic-gold" />
                        <span className="text-sm text-foreground dark:text-white">In-Person* & Online • Bay Area Libraries & Your Home</span>
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
                            className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-academic-navy/20 dark:border-white/20 text-foreground dark:text-white hover:border-academic-gold/50 hover:bg-academic-gold/10 transition-all duration-300 w-full sm:w-auto"
                        >
                            View Services
                        </button>
                    </div>

                    {/* School Logos */}
                    <div className="mt-12 animate-slide-up delay-500">
                        <p className="text-sm text-gray-400 mb-4">
                            Trusted by families from these East Bay schools:
                        </p>
                        <div className="relative overflow-hidden bg-gray-100/10 rounded-xl py-8">
                            <div className="flex items-center gap-16 animate-logo-scroll">
                                {[ ...schoolLogos, ...schoolLogos ].map((logo, idx) => (
                                    <img
                                        key={idx}
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-24 w-auto flex-shrink-0"
                                        data-name={logo.name}
                                        data-phone={logo.phone}
                                    />
                                ))}
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-100/10 to-transparent"></div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-100/10 to-transparent"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}