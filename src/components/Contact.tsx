'use client'

import { useState } from 'react'
import { Phone, Mail, Clock, Calendar, CheckCircle, User } from 'lucide-react'

// Contact SVG Icon
const ContactIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
    </svg>
)

export default function Contact() {
    const [scheduleType, setScheduleType] = useState<'consultation' | 'session' | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission here
        setIsSubmitted(true)
        setTimeout(() => {
            setIsSubmitted(false)
            setScheduleType(null)
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleScheduleClick = () => {
        setScheduleType(null) // Show options
    }

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
                                        <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Free 30-minute consultation</span> to discuss your goals and challenges
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Personalized learning plan</span> that works with your school curriculum
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Flexible scheduling</span> for your busy lifestyle
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="text-gray-300 text-sm">
                                            <span className="text-white font-medium">Ongoing support</span> between sessions via email
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Section */}
                        <div className="academic-card p-8">
                            {!scheduleType && !isSubmitted && (
                                <div className="text-center">
                                    <p className="text-gray-300 mb-8">
                                        Start with a free consultation or schedule your first tutoring session
                                    </p>

                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setScheduleType('consultation')}
                                            className="w-full academic-button px-6 py-4 text-lg font-semibold rounded-lg flex items-center justify-center space-x-2"
                                        >
                                            <Calendar className="w-5 h-5" />
                                            <span>Schedule Free Consultation</span>
                                        </button>

                                        <button
                                            onClick={() => setScheduleType('session')}
                                            className="w-full px-6 py-4 text-lg font-semibold rounded-lg border-2 border-academic-gold/30 hover:border-academic-gold/60 text-white hover:bg-academic-gold/10 transition-all duration-300"
                                        >
                                            Schedule Tutoring Session
                                        </button>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-academic-gold/20">
                                        <p className="text-gray-400 text-sm mb-4">Or contact me directly:</p>
                                        <a
                                            href="tel:(925)237-1327"
                                            className="inline-flex items-center space-x-2 text-academic-gold hover:text-academic-light-gold transition-colors"
                                        >
                                            <Phone className="w-4 h-4" />
                                            <span className="font-medium">(925) 237-1327</span>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {scheduleType && !isSubmitted && (
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-6 title-font">
                                        {scheduleType === 'consultation' ? 'Schedule Free Consultation' : 'Schedule Tutoring Session'}
                                    </h3>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="name" className="block text-white font-medium mb-2">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-academic-navy/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-academic-gold focus:outline-none focus:ring-2 focus:ring-academic-gold/20 transition-colors"
                                                    placeholder="Your full name"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-white font-medium mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-academic-navy/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-academic-gold focus:outline-none focus:ring-2 focus:ring-academic-gold/20 transition-colors"
                                                    placeholder="(925) 123-4567"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-white font-medium mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-academic-navy/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-academic-gold focus:outline-none focus:ring-2 focus:ring-academic-gold/20 transition-colors"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-white font-medium mb-2">
                                                Primary Interest *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-academic-navy/50 border border-gray-600 rounded-lg text-white focus:border-academic-gold focus:outline-none focus:ring-2 focus:ring-academic-gold/20 transition-colors"
                                            >
                                                <option value="">Select your main focus</option>
                                                <option value="sat-prep">SAT Preparation</option>
                                                <option value="act-prep">ACT Preparation</option>
                                                <option value="sat-subject">SAT Subject Tests</option>
                                                <option value="academic-support">Academic Support</option>
                                                <option value="multiple">Multiple Areas</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-white font-medium mb-2">
                                                Tell me about your goals *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-academic-navy/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-academic-gold focus:outline-none focus:ring-2 focus:ring-academic-gold/20 transition-colors resize-none"
                                                placeholder={scheduleType === 'consultation' ?
                                                    "What are your current academic challenges and goals? What subjects need the most support?" :
                                                    "What subjects do you need help with? When would you like to start sessions?"
                                                }
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="submit"
                                                className="academic-button flex-1 px-6 py-4 text-lg font-semibold rounded-lg"
                                            >
                                                {scheduleType === 'consultation' ? 'Request Consultation' : 'Schedule Session'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setScheduleType(null)}
                                                className="px-6 py-4 text-lg font-semibold rounded-lg border-2 border-white/20 hover:border-academic-gold/50 text-white hover:bg-academic-gold/10 transition-all duration-300"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {isSubmitted && (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h4 className="text-xl font-semibold text-white mb-2 title-font">Request Sent!</h4>
                                    <p className="text-gray-300 mb-4">
                                        Thank you for reaching out. I'll contact you within 24 hours to confirm your {scheduleType}.
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Need immediate assistance? Call me at (925) 237-1327
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="tel:(925)237-1327"
                                className="academic-button px-8 py-3 text-lg font-semibold rounded-lg flex items-center space-x-2"
                            >
                                <Phone className="w-5 h-5" />
                                <span>Call Now: (925) 237-1327</span>
                            </a>
                            <div className="text-gray-400">or</div>
                            <a
                                href="mailto:tutor@thebayareatutor.com"
                                className="px-8 py-3 text-lg font-semibold rounded-lg border-2 border-white/20 hover:border-academic-gold/50 text-white hover:bg-academic-gold/10 transition-all duration-300"
                            >
                                Send Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}