'use client'

import { Phone, Mail, GraduationCap, ArrowUp, MapPin, Calendar } from 'lucide-react'

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <footer className="bg-academic-navy border-t border-academic-medium-blue/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-8 h-8 text-academic-gold" />
                            <h3 className="text-2xl font-bold text-academic-gold title-font">Bay Area Academic Tutor</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-md">
                            Expert academic tutoring for SAT, ACT, SAT Subject Tests, and comprehensive school support.
                            UC Berkeley graduate with deep Bay Area experience and curriculum knowledge.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-academic-gold" />
                                <a href="tel:(925)237-1327" className="text-white hover:text-academic-gold transition-colors font-medium">
                                    (925) 237-1327
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-academic-gold" />
                                <a href="mailto:tutor@thebayareatutor.com" className="text-white hover:text-academic-gold transition-colors font-medium">
                                    tutor@thebayareatutor.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-academic-gold" />
                                <span className="text-white font-medium">Bay Area • In-Person & Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6 title-font">Tutoring Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-gray-400 hover:text-academic-gold transition-colors text-sm"
                                >
                                    Test Preparation
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-gray-400 hover:text-academic-gold transition-colors text-sm"
                                >
                                    Academic Support
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-gray-400 hover:text-academic-gold transition-colors text-sm"
                                >
                                    Personalized Learning
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('contact')}
                                    className="text-gray-400 hover:text-academic-gold transition-colors text-sm"
                                >
                                    Free Consultation
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Test Types */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6 title-font">Test Types</h4>
                        <ul className="space-y-3">
                            <li className="text-gray-400 text-sm">SAT Prep</li>
                            <li className="text-gray-400 text-sm">ACT Prep</li>
                            <li className="text-gray-400 text-sm">SAT Subject Tests</li>
                            <li className="text-gray-400 text-sm">Academic Tutoring</li>
                            <li className="text-academic-gold text-sm font-medium">Almost All Subjects Covered</li>
                        </ul>
                    </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="border-t border-academic-medium-blue/30 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h4 className="text-lg font-semibold text-white mb-2 title-font">Start Your Academic Success Today</h4>
                            <p className="text-gray-400 text-sm">Get the best tutoring support in the Bay Area</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="tel:(925)237-1327"
                                className="academic-button px-6 py-3 font-semibold rounded-lg flex items-center space-x-2"
                            >
                                <Phone className="w-4 h-4" />
                                <span>Call Now</span>
                            </a>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="px-6 py-3 font-semibold rounded-lg border-2 border-white/20 hover:border-academic-gold/50 text-white hover:bg-academic-gold/10 transition-all duration-300 flex items-center space-x-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Now</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-academic-medium-blue/30 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                            <span>&copy; {new Date().getFullYear()} Bay Area Academic Tutor. All rights reserved.</span>
                            <span className="hidden sm:block">•</span>
                            <span>UC Berkeley Graduate • 15+ Years Experience • Bay Area Expert</span>
                        </div>

                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-gray-400 hover:text-academic-gold transition-colors text-sm"
                        >
                            <span>Back to Top</span>
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    )
}