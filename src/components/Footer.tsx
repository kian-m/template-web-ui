'use client'

import { Phone, Mail, GraduationCap, ArrowUp, MapPin, Calendar } from 'lucide-react'

export default function Footer () {
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
        <footer className="bg-academic-off-white dark:bg-academic-navy border-t border-academic-medium-blue/30 text-academic-navy dark:text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand & Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-8 h-8 text-academic-gold" />
                            <h3 className="text-2xl font-bold text-academic-gold title-font">Bay Area Academic Tutor</h3>
                        </div>
                        <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed max-w-md">
                            Expert academic tutoring for SAT, ACT, SAT Subject Tests, and comprehensive school support.
                            UC Berkeley graduate with deep Bay Area experience and curriculum knowledge.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-academic-gold" />
                <a href="tel:(925)237-1327" className="hover:text-academic-gold transition-colors font-medium">
                                    (925) 237-1327
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-academic-gold" />
                                <a href="mailto:amir@thebayareatutor.com" className="hover:text-academic-gold transition-colors font-medium">
                                    amir@thebayareatutor.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-academic-gold" />
                                <span className="font-medium">Bay Area • In-Person* & Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 title-font">Tutoring Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-academic-medium-blue dark:text-academic-off-white hover:text-academic-gold transition-colors text-sm"
                                    data-ph-event="footer_test_preparation_click"
                                >
                                    Test Preparation
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-academic-medium-blue dark:text-academic-off-white hover:text-academic-gold transition-colors text-sm"
                                    data-ph-event="footer_academic_support_click"
                                >
                                    Academic Support
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="text-academic-medium-blue dark:text-academic-off-white hover:text-academic-gold transition-colors text-sm"
                                    data-ph-event="footer_personalized_learning_click"
                                >
                                    Personalized Learning
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('contact')}
                                    className="text-academic-medium-blue dark:text-academic-off-white hover:text-academic-gold transition-colors text-sm"
                                    data-ph-event="footer_free_consultation_click"
                                >
                                    Free Consultation
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Test Types */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 title-font">Test Types</h4>
                        <ul className="space-y-3">
                            <li className="text-academic-medium-blue dark:text-academic-off-white text-sm">SAT Prep</li>
                            <li className="text-academic-medium-blue dark:text-academic-off-white text-sm">ACT Prep</li>
                            <li className="text-academic-medium-blue dark:text-academic-off-white text-sm">SAT Subject Tests</li>
                            <li className="text-academic-medium-blue dark:text-academic-off-white text-sm">Academic Tutoring</li>
                            <li className="text-academic-gold text-sm font-medium">Almost All Subjects Covered</li>
                        </ul>
                    </div>
                </div>



                {/* Bottom Bar */}
                <div className="border-t border-academic-medium-blue/30 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-academic-medium-blue dark:text-academic-off-white">
                            <span>&copy; {new Date().getFullYear()} The Bay Area Tutor. All rights reserved.</span>
                            <span className="hidden sm:block">•</span>
                            <span>UC Berkeley Graduate • 15+ Years Local Experience • Bay Area Expert</span>
                        </div>

                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-academic-medium-blue dark:text-academic-off-white hover:text-academic-gold transition-colors text-sm"
                            data-ph-event="footer_back_to_top_click"
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