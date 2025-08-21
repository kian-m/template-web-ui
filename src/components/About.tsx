'use client'

import { GraduationCap, Award, Users, TrendingUp, Clock, Target, School, MapPin } from 'lucide-react'
import { siteContent } from '@/data/siteContent'
import { useCal } from './CalProvider'

// Teaching Philosophy SVG Icon
const TeachingIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12,3L1,9L12,15L21,9V10H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
    </svg>
)

// Experience SVG Icon
const ExperienceIcon = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V8A2,2 0 0,1 4,6H8V4A2,2 0 0,1 10,2M14,6V4H10V6H14Z"/>
    </svg>
)

export default function About () {
    const { open } = useCal()
    const expertise = siteContent.about.expertise

    const achievements = [
        { icon: <GraduationCap className="w-6 h-6" />, stat: "UC Berkeley", label: "Graduate" },
        { icon: <Clock className="w-6 h-6" />, stat: "15+", label: "Years Teaching" },
        { icon: <Users className="w-6 h-6" />, stat: "500+", label: "Students Helped" },
        { icon: <School className="w-6 h-6" />, stat: "Bay Area", label: "Expert" }
    ]

    const bayAreaExperience = [
        "I know the teachers, curricula, and expectations at local high schools",
        "You get tutoring that directly supports what you're learning in class",
        "I can anticipate and prepare you for specific teacher styles and test formats",
        "Your tutoring follows, supplements, and goes beyond classroom material"
    ]

    return (
        <section id="about" className="py-20 lg:py-32 bg-background dark:bg-academic-navy">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 title-font">
                            <span className="text-foreground dark:text-white">About Your</span>
                            <span className="block text-academic-gold dark:text-gradient">Dedicated Tutor</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-academic-medium-blue dark:text-academic-off-white max-w-3xl mx-auto">
                            You deserve a tutor who understands both the material and the local academic environment.
                            I combine UC Berkeley education with deep Bay Area teaching experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                        {/* Left side - Main content */}
                        <div className="space-y-8">
                            <div className="academic-card p-8">
                                <div className="flex items-center mb-6">
                                    <TeachingIcon />
                                    <h3 className="text-2xl font-bold text-foreground dark:text-white ml-4 title-font">My Teaching Approach</h3>
                                </div>
                                <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed mb-6">
                                    You get more than just test prep. I work as your private tutor and academic coach,
                                    providing support that directly connects to your classroom experience.
                                    I've worked at tutoring centers and as a private tutor throughout the Bay Area.
                                </p>
                                <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed">
                                    Your success comes from understanding concepts deeply and building confidence.
                                    I create personalized strategies that work with your learning style and academic goals.
                                </p>
                            </div>

                            <div className="academic-card p-8">
                                <h3 className="text-xl font-bold text-foreground dark:text-white mb-4 flex items-center title-font">
                                    <Award className="w-6 h-6 text-academic-gold mr-3" />
                                    Areas of Expertise
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {expertise.map((area, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-academic-medium-blue dark:text-academic-off-white text-sm">{area}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right side - Stats and achievements */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                {achievements.map((achievement, index) => (
                                    <div key={index} className="academic-card p-6 text-center academic-hover">
                                        <div className="text-academic-gold mb-4 flex justify-center">
                                            {achievement.icon}
                                        </div>
                                        <div className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-2 title-font">
                                            {achievement.stat}
                                        </div>
                                        <div className="text-sm text-academic-medium-blue dark:text-academic-off-white">
                                            {achievement.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="academic-card p-8">
                                <h3 className="text-xl font-bold text-foreground dark:text-white mb-6 flex items-center title-font">
                                    <MapPin className="w-6 h-6 text-academic-gold mr-3" />
                                    Bay Area Advantage
                                </h3>
                                <div className="space-y-4">
                                    {bayAreaExperience.map((point, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="w-2 h-2 bg-academic-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <div className="text-academic-medium-blue dark:text-academic-off-white text-sm">{point}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="bg-zinc-200 dark:bg-academic-medium-blue/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground dark:text-white mb-6 title-font flex items-center">
                                    <ExperienceIcon />
                                    <span className="ml-4">Professional Experience</span>
                                </h3>
                                <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed mb-6">
                                    I've worked as a private tutor and at established tutoring locations throughout the Bay Area.
                                    This experience gives me deep insight into local academic standards and teaching methods.
                                </p>
                                <p className="text-academic-medium-blue dark:text-academic-off-white leading-relaxed">
                                    You benefit from my familiarity with Bay Area high schools, teachers, and curricula.
                                    I know what works and what doesn't in this specific academic environment.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-2 h-2 bg-academic-gold rounded-full mt-1 flex-shrink-0"></div>
                                    <div>
                                        <div className="text-foreground dark:text-white font-semibold mb-1">Private Tutoring</div>
                                        <div className="text-academic-medium-blue dark:text-academic-off-white text-sm">One-on-one academic support in homes and libraries</div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-2 h-2 bg-academic-gold rounded-full mt-1 flex-shrink-0"></div>
                                    <div>
                                        <div className="text-foreground dark:text-white font-semibold mb-1">Tutoring Centers</div>
                                        <div className="text-academic-medium-blue dark:text-academic-off-white text-sm">Professional tutoring experience at established locations</div>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-2 h-2 bg-academic-gold rounded-full mt-1 flex-shrink-0"></div>
                                    <div>
                                        <div className="text-foreground dark:text-white font-semibold mb-1">Curriculum Expertise</div>
                                        <div className="text-academic-medium-blue dark:text-academic-off-white text-sm">Deep knowledge of Bay Area school programs and standards</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to action */}
                    <div className="text-center">
                        <div className="inline-block academic-card p-8 max-w-2xl">
                            <h3 className="text-2xl font-bold text-foreground dark:text-white mb-4 title-font">Ready to Excel Academically?</h3>
                            <p className="text-academic-medium-blue dark:text-academic-off-white mb-6">
                                You get the best tutoring support in the Bay Area. Let's discuss your goals and create a plan for your academic success.
                            </p>
                            <button
                                onClick={() => open()}
                                className="schedule-trigger academic-button px-8 py-3 text-lg font-semibold rounded-lg"
                            >
                                Schedule Your Free Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}