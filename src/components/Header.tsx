'use client'

import { useState, useEffect, MouseEvent } from 'react'
import { Menu, X, Calendar } from 'lucide-react'
import { useCal } from './CalProvider'
import ThemeToggle from './ThemeToggle'

export default function Header () {
    const [ isScrolled, setIsScrolled ] = useState(false)
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setIsMobileMenuOpen(false)
        }
    }

    const { open } = useCal()

    const handleScheduleClick = (url?: string | MouseEvent<HTMLButtonElement>) => {
        open(typeof url === 'string' ? url : 'https://cal.com/thebayarea?embed=1')
        setIsMobileMenuOpen(false)
    }

    const [ showFloating, setShowFloating ] = useState(true)

    useEffect(() => {
        const triggers = document.querySelectorAll('.schedule-trigger')
        const visibleMap = new Map<Element, boolean>()

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                visibleMap.set(entry.target, entry.isIntersecting)
            })
            const anyVisible = Array.from(visibleMap.values()).some(Boolean)
            setShowFloating(!anyVisible)
        }, { threshold: 0.1 })

        triggers.forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [isMobileMenuOpen])

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-academic-off-white/95 dark:bg-academic-navy/95 backdrop-blur-md shadow-lg'
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
                                className="text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium"
                                data-ph-event="nav_services_click"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium"
                                data-ph-event="nav_about_click"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium"
                                data-ph-event="nav_faq_click"
                            >
                                FAQ
                            </button>
                            <button
                                onClick={() => handleScheduleClick()}
                                data-action="schedule_now"
                                className="schedule-trigger academic-button px-6 py-2 text-sm font-semibold rounded-md flex items-center space-x-2"
                                data-ph-event="nav_schedule_now_click"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Now</span>
                            </button>
                            <ThemeToggle />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden text-academic-navy dark:text-white p-2"
                            data-ph-event="nav_mobile_menu_toggle"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden bg-academic-off-white/95 dark:bg-academic-dark-blue/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4">
                            <button
                                onClick={() => scrollToSection('services')}
                                className="block w-full text-left text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium py-2"
                                data-ph-event="mobile_nav_services_click"
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="block w-full text-left text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium py-2"
                                data-ph-event="mobile_nav_about_click"
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('faq')}
                                className="block w-full text-left text-academic-navy dark:text-white hover:text-academic-gold transition-colors font-medium py-2"
                                data-ph-event="mobile_nav_faq_click"
                            >
                                FAQ
                            </button>
                            <button
                                onClick={handleScheduleClick}
                                data-action="schedule_now"
                                className="schedule-trigger academic-button w-full px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center space-x-2"
                                data-ph-event="mobile_nav_schedule_now_click"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Schedule Now</span>
                            </button>
                            <div className="flex justify-center">
                                <ThemeToggle />
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Floating Schedule Button */}
            {showFloating && (
                <button
                    onClick={() => handleScheduleClick()}
                    className="schedule-button academic-button px-4 py-3 rounded-full flex items-center justify-center space-x-2 animate-academic-glow"
                    data-ph-event="floating_schedule_now_click"
                >
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Schedule Now</span>
                </button>
            )}
        </>
    )
}