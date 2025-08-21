'use client'

import { Monitor, Users, Target, BookOpen, Calculator, PenTool, Microscope, Home, Building2, Globe } from 'lucide-react'

// Test Prep SVG Icon
const TestPrepIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z"/>
    </svg>
)

// Academic Support SVG Icon
const AcademicSupportIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12,3L1,9L12,15L21,9V10H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
    </svg>
)

// Personalized Learning SVG Icon
const PersonalizedIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"/>
    </svg>
)

export default function Services () {
    const services = [
        {
            icon: <TestPrepIcon />,
            title: "Test Preparation",
            description: "Expert preparation for SAT, ACT, and AP classes. You'll master test strategies and content knowledge with proven methods.",
            features: [ "SAT, ACT, AP classes", "Practice tests & strategies", "Score improvement focus", "Test-day confidence building" ]
        },
        {
            icon: <AcademicSupportIcon />,
            title: "Academic Tutoring",
            description: "Comprehensive support for your high school courses. I help you understand, master, and excel in your current classes.",
            features: [ "Most high school subjects", "Homework & project help", "Study skills development", "Grade improvement" ]
        },
        {
            icon: <PersonalizedIcon />,
            title: "Personalized Learning",
            description: "Every student learns differently. I create custom learning plans that work with your strengths and address your specific needs.",
            features: [ "Individual learning plans", "Progress tracking", "Flexible pacing", "Confidence building" ]
        }
    ]

    const testTypes = [
        { icon: <Calculator className="w-6 h-6" />, name: "Standardized tests", topics: "SAT, ACT, GRE,..." },
        { icon: <PenTool className="w-6 h-6" />, name: "Introductory College Courses", topics: "College Algebra, Calculus, Differential Equations, and more." },
        { icon: <BookOpen className="w-6 h-6" />, name: "AP classes", topics: "Calculus, Physics, Statistics, and more. " },
        { icon: <Microscope className="w-6 h-6" />, name: "Academic Support", topics: "Math, Physics, Chemistry, Biology" }
    ]

    const locations = [
        { icon: <Home className="w-6 h-6" />, name: "Your Home*", description: "Comfortable, familiar environment" },
        { icon: <Building2 className="w-6 h-6" />, name: "Bay Area Libraries*", description: "Quiet, professional settings" },
        { icon: <Monitor className="w-6 h-6" />, name: "Online Sessions", description: "Flexible, worldwide availability", popular: true }
    ]

    return (
        <section id="services" className="py-20 lg:py-32 bg-background dark:bg-academic-dark-blue">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                        <span className="text-foreground dark:text-white">Comprehensive Tutoring</span>
                        <span className="block text-academic-gold dark:text-gradient">Services</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-academic-medium-blue dark:text-academic-off-white max-w-3xl mx-auto">
                        Expert support for standardized tests and academic success. I provide personalized tutoring that works with your schedule and learning style.
                    </p>
                </div>

                {/* Main Services */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {services.map((service, index) => (
                        <div key={index} className="academic-card p-8 academic-hover">
                            <div className="text-academic-gold mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-foreground dark:text-white mb-4 title-font">
                                {service.title}
                            </h3>
                            <p className="text-academic-medium-blue dark:text-academic-off-white mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-academic-medium-blue dark:text-academic-off-white flex items-start">
                                        <div className="w-2 h-2 bg-academic-gold rounded-full mt-1 mr-3 flex-shrink-0"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Test Types & Academic Support */}
                <div className="bg-zinc-200 dark:bg-academic-medium-blue/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-4 title-font">
                            Complete Test Prep & Academic Support
                        </h3>
                        <p className="text-lg text-academic-medium-blue dark:text-academic-off-white">
                            You'll master every test type and subject with expert guidance
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testTypes.map((test, index) => (
                            <div key={index} className="bg-zinc-300 dark:bg-academic-dark-blue rounded-xl p-6 border border-academic-gold/20 hover:border-academic-gold/40 transition-all duration-300">
                                <div className="text-academic-gold mb-4">
                                    {test.icon}
                                </div>
                                <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2 title-font">
                                    {test.name}
                                </h4>
                                <p className="text-sm text-academic-medium-blue dark:text-academic-off-white">
                                    {test.topics}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tutoring Locations */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-4 title-font">
                        Flexible Learning Locations
                    </h3>
                    <p className="text-lg text-academic-medium-blue dark:text-academic-off-white">
                        Choose the environment that works best for you
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {locations.map((location, index) => (
                        <div
                            key={index}
                            className={`academic-card rounded-lg shadow-lg overflow-hidden border flex flex-col text-center transition-all hover:shadow-xl ${location.popular ? 'border-academic-gold transform scale-105 z-10' : 'border-academic-navy/20 dark:border-academic-off-white/20'}`}
                        >
                            {location.popular && (
                                <div className="bg-academic-gold text-academic-navy text-center py-1 text-sm font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="text-academic-gold mb-4 flex justify-center">
                                    {location.icon}
                                </div>
                                <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2 title-font">
                                    {location.name}
                                </h4>
                                <p className="text-sm text-academic-medium-blue dark:text-academic-off-white">
                                    {location.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-6 text-center text-xs text-academic-medium-blue dark:text-academic-off-white">
                *In-person sessions include an additional fee.
                </p>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center space-x-2 bg-academic-gold/20 backdrop-blur-sm border border-academic-gold/30 rounded-full px-6 py-3">
                        <Globe className="w-5 h-5 text-academic-gold" />
                        <span className="text-foreground dark:text-white font-medium">Serving the entire Bay Area and beyond</span>
                    </div>
                </div>
            </div>
        </section>
    )
}