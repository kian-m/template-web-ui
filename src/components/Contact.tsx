'use client'

import { Phone, Mail, Clock, Calendar, User, Check } from 'lucide-react'
import { useCalModal } from '@/components/CalModal'

// Contact SVG Icon
const ContactIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
    </svg>
)

export default function Contact () {
    const { open } = useCalModal()

    return (
        <section id="contact" className="py-20 lg:py-32 bg-academic-navy">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center mb-6">
                            <ContactIcon />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                            <span className="text-white">Schedule Your</span>
                            <span className="block text-gradient">Academic Success</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                            Take the first step toward academic excellence. Contact me to discuss your goals and start your journey to better grades and test scores.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="academic-card p-8">
                                <h3 className="text-2xl font-bold text-white mb-6 title-font">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <Phone className="w-6 h-6 text-academic-gold mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold mb-1">Phone</div>
                                            <div className="text-gray-300">(925) 237-1327</div>
                                            <div className="text-sm text-gray-400 mt-1">Call or text for quick responses</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <Mail className="w-6 h-6 text-academic-gold mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold mb-1">Email</div>
                                            <div className="text-gray-300">tutor@thebayareatutor.com</div>
                                            <div className="text-sm text-gray-400 mt-1">I respond within 24 hours</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <Clock className="w-6 h-6 text-academic-gold mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-white font-semibold mb-1">Availability</div>
                                            <div className="text-gray-300">Flexible scheduling</div>
                                            <div className="text-sm text-gray-400 mt-1">Evenings, weekends, and online sessions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="academic-card p-8">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center title-font">
                                    <User className="w-6 h-6 text-academic-gold mr-3" />
                                    What You Get
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <Check className="w-5 h-5 text-academic-gold mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Free 30-minute consultation</span> to discuss your goals and challenges
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Check className="w-5 h-5 text-academic-gold mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Personalized learning plan</span> that works with your school curriculum
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Check className="w-5 h-5 text-academic-gold mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Flexible scheduling</span> for your busy lifestyle
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Check className="w-5 h-5 text-academic-gold mr-2 mt-0.5 flex-shrink-0" />
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Ongoing support</span> between sessions via email
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Section */}
                        <div className="academic-card p-8 flex flex-col justify-between">
                            <div className="text-center">
                                <p className="text-gray-300 mb-8">
                                    Start with a free consultation or schedule your first tutoring session
                                </p>

                                <div className="space-y-4">
                                    <button
                                        data-schedule
                                        onClick={() => open('https://cal.com/thebayarea/consultation?embed=1')}
                                        className="w-full academic-button px-6 py-4 text-lg font-semibold rounded-lg flex items-center justify-center space-x-2"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        <span>Schedule Free Consultation</span>
                                    </button>

                                    <button
                                        data-schedule
                                        onClick={() => open('https://cal.com/thebayarea/consultation?embed=1')}
                                        className="w-full px-6 py-4 text-lg font-semibold rounded-lg border-2 border-academic-gold/30 hover:border-academic-gold/60 text-white hover:bg-academic-gold/10 transition-all duration-300"
                                    >
                                        Schedule Tutoring Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
