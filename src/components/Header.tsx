'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Calendar } from 'lucide-react'
import { useCalModal } from '@/components/CalModal'

export default function Header () {
    const [ isScrolled, setIsScrolled ] = useState(false)
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [ ])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    const { open } = useCalModal()
    const handleScheduleClick = () => {
        open('https://cal.com/thebayarea/consultation?embed=1')
    }

    const [ showFloating, setShowFloating ] = useState(true)

    useEffect(() => {
        const checkButtons = () => {
            const buttons = document.querySelectorAll('[data-schedule]')
            const anyVisible = Array.from(buttons).some((btn) => {
                const rect = btn.getBoundingClientRect()
                return rect.top < window.innerHeight && rect.bottom > 0
            })
            setShowFloating(!anyVisible)
        }
        checkButtons()
        window.addEventListener('scroll', checkButtons)
        window.addEventListener('resize', checkButtons)
        return () => {
            window.removeEventListener('scroll', checkButtons)
            window.removeEventListener('resize', checkButtons)
        }
    }, [ ])

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-academic-navy/95 backdrop-blur-md shadow-lg'
                        : 'bg-transparent'
                }`}
            >
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-academic-gold logo-font tracking-wide drop-shadow">
                                The Bay Area Tutor
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <button
                                onClick={() => scrollToSection('services')}
                                className="text-white hover:text-academic-gold transition-colors font-medium"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-white hover:text-academic-gold transition-colors font-medium"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-white hover:text-academic-gold transition-colors font-medium"
                            >
                                FAQ
                            </button>
                            <button
                                data-schedule
                                onClick={handleScheduleClick}
                                className="academic-button px-6 py-2 text-sm font-semibold rounded-md flex items-center space-x-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Now</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-white p-2"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden bg-academic-dark-blue/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4">
                            <button
                                onClick={() => scrollToSection('services')}
                                className="block w-full text-left text-white hover:text-academic-gold transition-colors font-medium py-2"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="block w-full text-left text-white hover:text-academic-gold transition-colors font-medium py-2"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="block w-full text-left text-white hover:text-academic-gold transition-colors font-medium py-2"
                            >
                                FAQ
                            </button>
                            <button
                                data-schedule
                                onClick={handleScheduleClick}
                                className="academic-button w-full px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center space-x-2"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Now</span>
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* Floating Schedule Button */}
            {showFloating && (
                <button
                    onClick={handleScheduleClick}
                    className="schedule-button academic-button px-4 py-3 rounded-full flex items-center justify-center space-x-2 animate-academic-glow"
                >
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Schedule Now</span>
                </button>
            )}
        </>
    )
}