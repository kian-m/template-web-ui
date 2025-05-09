'use client'

import { useState } from 'react';
import { MessageCircle, X, Menu } from 'lucide-react';

export default function BerkeleyTutorWebsite () {
    const [ chatOpen, setChatOpen ] = useState(false);
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);

    return (
        <div className="bg-gray-50">
            {/* Improved Typography and Accessibility Styles */}
            <style jsx global>{`
              @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');

              body {
                font-family: 'Montserrat', sans-serif;
              }

              h1, h2, h3, h4, h5, h6 {
                font-family: 'Crimson Pro', serif;
              }

              .text-3d {
                text-shadow: 0px 1px 0px rgba(255,255,255,0.5),
                0px 2px 0px rgba(0,0,0,0.1),
                0px 3px 3px rgba(0,0,0,0.15);
              }

              .heading-3d {
                color: #1e3a8a;
                text-shadow: 0px 1px 0px rgba(255,255,255,0.5),
                1px 2px 0px rgba(0,0,0,0.1),
                1px 3px 3px rgba(0,0,0,0.1),
                2px 4px 4px rgba(30,58,138,0.15);
                letter-spacing: 0.02em;
              }

              /* High contrast focus styles for accessibility */
              a:focus, button:focus, input:focus {
                outline: 3px solid #facc15;
                outline-offset: 2px;
              }

              /* Improved contrast ratios for text */
              .text-improved {
                color: #1a202c;
              }
            `}</style>
            {/* Header */}
            <header className="bg-white shadow-md relative">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-2xl md:text-3xl heading-3d">BerkeleyTutor</div>

                        <nav className="hidden lg:flex space-x-6 xl:space-x-10">
                            <a href="#" className="text-gray-800 hover:text-blue-900 text-base xl:text-lg font-medium transition-colors duration-300 border-b-2 border-transparent hover:border-blue-900">Home</a>
                            <a href="#" className="text-gray-800 hover:text-blue-900 text-base xl:text-lg font-medium transition-colors duration-300 border-b-2 border-transparent hover:border-blue-900">Services</a>
                            <a href="#" className="text-gray-800 hover:text-blue-900 text-base xl:text-lg font-medium transition-colors duration-300 border-b-2 border-transparent hover:border-blue-900">Locations</a>
                            <a href="#" className="text-gray-800 hover:text-blue-900 text-base xl:text-lg font-medium transition-colors duration-300 border-b-2 border-transparent hover:border-blue-900">Pricing</a>
                        </nav>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden text-blue-900 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <Menu size={24} />
                            </button>

                            <button className="bg-blue-900 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap" aria-label="Book a tutoring session">
                                Book a Session
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 py-4 px-6 transition-all duration-300">
                            <nav className="flex flex-col space-y-4">
                                <a href="#" className="text-gray-800 hover:text-blue-900 text-lg font-medium transition-colors duration-300 border-l-4 border-transparent hover:border-blue-900 pl-2">Home</a>
                                <a href="#" className="text-gray-800 hover:text-blue-900 text-lg font-medium transition-colors duration-300 border-l-4 border-transparent hover:border-blue-900 pl-2">Services</a>
                                <a href="#" className="text-gray-800 hover:text-blue-900 text-lg font-medium transition-colors duration-300 border-l-4 border-transparent hover:border-blue-900 pl-2">Locations</a>
                                <a href="#" className="text-gray-800 hover:text-blue-900 text-lg font-medium transition-colors duration-300 border-l-4 border-transparent hover:border-blue-900 pl-2">Pricing</a>
                                <div className="pt-2">
                                    <button className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-lg transition-all duration-300 text-center" aria-label="Book a tutoring session">
                                        Book a Session
                                    </button>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Rest of the component remains unchanged */}

            {/* Hero Section */}
            <section className="bg-white text-gray-900 py-20 flex justify-center">
                <div className="max-w-6xl w-full px-6">
                    <div className="md:w-2/3 mx-auto">
                        <h1 className="text-6xl font-bold mb-6 heading-3d text-blue-900 text-center">
                            Expert Math & Physics Tutoring in the Bay Area
                        </h1>
                        <p className="text-xl mb-8 leading-relaxed text-gray-700 text-center">
                            Personalized 1-on-1 sessions with a UC Berkeley-educated tutor with over 15 years of experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                className="bg-blue-900 text-white font-bold px-8 py-4 rounded-lg shadow-lg text-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                aria-label="Book your first tutoring session"
                            >
                                Book Your First Session
                            </button>
                            <button
                                className="border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-lg text-xl font-medium hover:bg-blue-900 hover:text-white transition-all duration-300"
                                aria-label="Learn more about tutoring services"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Banner */}
            <section className="py-12 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center">
                        <div className="text-7xl font-bold text-blue-900 mb-2 heading-3d">15+</div>
                        <div className="text-gray-700 font-medium text-xl">Years of Experience</div>
                    </div>
                </div>
            </section>

            {/* Teaching Approach */}
            <section className="py-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100 opacity-20 transform -skew-x-12"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-yellow-300 opacity-10"></div>

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl font-bold text-blue-900 mb-16 text-center heading-3d">My Teaching Approach</h2>

                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div className="transform transition-all duration-300 hover:-translate-y-2">
                                <h3 className="text-3xl font-semibold text-blue-900 mb-4 heading-3d">Building Strong Foundations</h3>
                                <p className="text-gray-800 text-lg leading-relaxed">Ensuring students thoroughly understand core concepts before advancing to more complex topics.</p>
                            </div>

                            <div className="transform transition-all duration-300 hover:-translate-y-2">
                                <h3 className="text-3xl font-semibold text-blue-900 mb-4 heading-3d">Developing Problem-Solving Skills</h3>
                                <p className="text-gray-800 text-lg leading-relaxed">Teaching strategies to approach new problems independently and with confidence.</p>
                            </div>

                            <div className="transform transition-all duration-300 hover:-translate-y-2">
                                <h3 className="text-3xl font-semibold text-blue-900 mb-4 heading-3d">Customized Learning Plans</h3>
                                <p className="text-gray-800 text-lg leading-relaxed">Creating personalized study plans based on individual strengths, weaknesses, and goals.</p>
                            </div>

                            <div className="transform transition-all duration-300 hover:-translate-y-2">
                                <h3 className="text-3xl font-semibold text-blue-900 mb-4 heading-3d">Regular Progress Assessment</h3>
                                <p className="text-gray-800 text-lg leading-relaxed">Continuous evaluation to ensure improvement and adjust strategies as needed.</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-10 rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                            <div className="text-center text-white h-full flex flex-col justify-center">
                                <p className="text-2xl mb-8 font-medium">Mathematical concept visualization</p>
                                <div className="flex justify-center space-x-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg transform rotate-12 shadow-lg hover:shadow-xl hover:rotate-6 transition-all duration-300"></div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">Tutoring Services</h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* In-Person Tutoring */}
                        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">In-Person Tutoring</h3>
                            <p className="text-gray-700 mb-8 text-center">Face-to-face sessions at various libraries throughout the Bay Area.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Personalized attention in a distraction-free environment</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Real-time problem solving and feedback</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Convenient locations throughout the Bay Area</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <button className="text-blue-900 font-medium flex items-center justify-center mx-auto">
                                    View Locations
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Online Tutoring */}
                        <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">Online Tutoring</h3>
                            <p className="text-gray-700 mb-8 text-center">Virtual sessions available worldwide through secure video conferencing.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Interactive digital whiteboard for problem-solving</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Flexible scheduling to accommodate any time zone</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Session recordings available for review</span>
                                </li>
                            </ul>
                            <div className="text-center">
                                <button className="text-blue-900 font-medium flex items-center justify-center mx-auto">
                                    Book Online Session
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center">Tutoring Rates</h2>
                    <p className="text-gray-600 text-center mb-12">Transparent pricing with options to fit your needs.</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Single Session */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-blue-900 mb-2">Single Session</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-blue-900">$75</span>
                                <span className="text-gray-600">/hour</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">One-on-one personalized instruction</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">In-person or online options</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">No long-term commitment</span>
                                </li>
                            </ul>
                            <button className="w-full bg-blue-900 text-white py-3 rounded-lg">Book Now</button>
                        </div>

                        {/* Package of 10 */}
                        <div className="bg-white rounded-xl shadow-xl p-8 transform scale-105 relative">
                            <div className="absolute top-0 right-0 bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg">
                                Most Popular
                            </div>
                            <h3 className="text-2xl font-semibold text-blue-900 mb-2">Package of 10</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-blue-900">$65</span>
                                <span className="text-gray-600">/hour</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Save $100 compared to single sessions</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Consistent weekly or bi-weekly sessions</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Progress tracking</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Email support between sessions</span>
                                </li>
                            </ul>
                            <button className="w-full bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg">Choose This Plan</button>
                        </div>

                        {/* Semester Package */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-blue-900 mb-2">Semester Package</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-blue-900">$60</span>
                                <span className="text-gray-600">/hour</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">16 weekly sessions (one semester)</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Best value for long-term improvement</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Comprehensive study plan</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">Priority scheduling</span>
                                </li>
                            </ul>
                            <button className="w-full bg-blue-900 text-white py-3 rounded-lg">Choose This Plan</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Book Your Tutoring Session</h2>
                    <p className="text-lg mb-12">Fill out the form to schedule a session or request more information. I'll respond within 24 hours to discuss your needs and set up our first meeting.</p>
                    <button className="bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-lg">Schedule Now</button>

                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <h3 className="text-xl mb-4">Email</h3>
                            <p className="text-blue-100">contact@berkeleytutor.com</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl mb-4">Phone</h3>
                            <p className="text-blue-100">(510) 555-1234</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl mb-4">Availability</h3>
                            <p className="text-blue-100">Weekdays: 3pm - 8pm<br />Weekends: 10am - 5pm</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="font-bold text-2xl text-blue-900 mb-4">BerkeleyTutor</div>
                            <p className="text-gray-600">Expert Math & Physics Tutoring in the Bay Area</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-blue-900 mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Home</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">About</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Services</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Pricing</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-blue-900 mb-4">Services</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Math Tutoring</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Physics Tutoring</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Online Sessions</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-blue-900">Group Tutoring</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-lg text-blue-900 mb-4">Newsletter</h3>
                            <p className="text-gray-600 mb-4">Subscribe for updates and study tips.</p>
                            <div className="flex">
                                <input type="email" placeholder="Your email" className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2" />
                                <button className="bg-blue-900 text-white px-4 py-2 rounded-r-lg">Subscribe</button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} BerkeleyTutor. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-blue-900">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-900">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating chat helper */}
            <div className="fixed bottom-8 right-8 z-50">
                {chatOpen ? (
                    <div className="bg-white rounded-xl shadow-xl w-80">
                        <div className="bg-blue-900 p-4 rounded-t-xl flex justify-between items-center">
                            <h3 className="text-white">Chat with BerkeleyTutor</h3>
                            <button onClick={() => setChatOpen(false)} className="text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto bg-gray-50">
                            <div className="bg-blue-100 p-3 rounded-lg rounded-tl-none mb-3 max-w-xs">
                                Hello! How can I help with your math or physics questions today?
                            </div>
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex">
                                <input type="text" placeholder="Type your message..." className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2" />
                                <button className="bg-blue-900 text-white px-4 py-2 rounded-r-lg">Send</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setChatOpen(true)} className="bg-blue-900 text-white p-4 rounded-full shadow-lg">
                        <MessageCircle size={24} />
                    </button>
                )}
            </div>
        </div>
    );
}