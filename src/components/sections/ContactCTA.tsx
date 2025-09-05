'use client';


import { useState } from 'react';

interface ContactCTAProps {
    heading: string;
    subheading: string;
    email: string;
    phone: string;
    availability: string[];
    ctaText: string;
}

const ContactCTA = ({ heading, subheading, email, phone, availability, ctaText }: ContactCTAProps) => {
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        phone: '',
        studentGrade: '',
        subject: '',
        message: '',
    });

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ showSuccess, setShowSuccess ] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);

            // Here you would integrate with Cal.com or your scheduling tool
            // window.location.href = 'https://cal.com/yourusername/free-consultation';
        }, 1000);
    };

    return (
        <section id="schedule" className="py-20 bg-navy-50">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                        <p className="text-xl text-navy-600">{subheading}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-5">
                            {/* Contact info */}
                            <div className="lg:col-span-2 bg-navy-800 text-white p-8">
                                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-gray-300 mb-1">Email</p>
                                        <a href={`mailto:${email}`} className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
                                            {email}
                                        </a>
                                    </div>

                                    <div>
                                        <p className="text-gray-300 mb-1">Phone</p>
                                        <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
                                            {phone}
                                        </a>
                                    </div>

                                    {/*<div>*/}
                                    {/*    <p className="text-gray-300 mb-1">Availability</p>*/}
                                    {/*    <ul className="space-y-1">*/}
                                    {/*        {availability.map((time, index) => (*/}
                                    {/*            <li key={index} className="text-white">{time}</li>*/}
                                    {/*        ))}*/}
                                    {/*    </ul>*/}
                                    {/*</div>*/}
                                </div>

                                <div className="mt-12">
                                    <p className="text-gray-300 mb-4">Main Locations:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Lafayette</span>
                                        <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Orinda</span>
                                        <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Dublin</span>
                                        <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Walnut Creek</span>
                                        <span className="px-3 py-1 bg-navy-700 text-white rounded-full text-sm">Berkeley</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                            </div>

                            {/* Form or Cal.com embed */}
                            <div className="lg:col-span-3 p-8">
                                {showSuccess ? (
                                    <div className="text-center py-12">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-navy-800 mb-2">Thank You!</h3>
                                        <p className="text-navy-600 mb-6">Your consultation request has been received. I'll be in touch within 24 hours to confirm your appointment.</p>
                                        <a
                                            href="#"
                                            className="text-yellow-600 hover:text-yellow-700 font-medium"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowSuccess(false);
                                                setFormData({
                                                    name: '',
                                                    email: '',
                                                    phone: '',
                                                    studentGrade: '',
                                                    subject: '',
                                                    message: '',
                                                });
                                            }}
                                        >
                                            Return to form
                                        </a>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-navy-800 mb-6">Schedule Your Free Consultation</h3>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700 mb-1">Student's Grade</label>
                                                    <select
                                                        id="studentGrade"
                                                        name="studentGrade"
                                                        value={formData.studentGrade}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                        required
                                                    >
                                                        <option value="">Select grade level</option>
                                                        <option value="6-8">Middle School (6-8)</option>
                                                        <option value="9">High School - Freshman</option>
                                                        <option value="10">High School - Sophomore</option>
                                                        <option value="11">High School - Junior</option>
                                                        <option value="12">High School - Senior</option>
                                                        <option value="college">College</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject Needed</label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                    required
                                                >
                                                    <option value="">Select subject</option>
                                                    <option value="Algebra">Algebra</option>
                                                    <option value="Geometry">Geometry</option>
                                                    <option value="Trigonometry">Trigonometry</option>
                                                    <option value="Pre-Calculus">Pre-Calculus</option>
                                                    <option value="AP Calculus AB">AP Calculus AB</option>
                                                    <option value="AP Calculus BC">AP Calculus BC</option>
                                                    <option value="AP Physics 1">AP Physics 1</option>
                                                    <option value="AP Physics 2">AP Physics 2</option>
                                                    <option value="AP Physics C">AP Physics C</option>
                                                    <option value="College Calculus">College Calculus</option>
                                                    <option value="Linear Algebra">Linear Algebra</option>
                                                    <option value="Differential Equations">Differential Equations</option>
                                                    <option value="Other">Other (specify in message)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={4}
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                                    placeholder="Tell me about your student's needs, goals, or any challenges they're facing."
                                                ></textarea>
                                            </div>

                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    className="w-full py-3 px-6 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition-colors disabled:opacity-75"
                                                    disabled={isSubmitting}
                                                    data-ph-event="contact_form_submit"
                                                >
                                                    {isSubmitting ? 'Submitting...' : ctaText}
                                                </button>
                                            </div>

                                            <p className="text-sm text-gray-500 mt-4">
                                                By submitting this form, you will receive a response within 24 hours to set up your free consultation. No obligation or commitment required.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactCTA;