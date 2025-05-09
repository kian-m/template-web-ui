import Image from 'next/image';
import ParentReviewBadge from '../ui/ParentReviewBadge';

interface HeroProps {
    heading: string;
    subheading: string;
    cta: string;
    secondaryCta: string;
    trustBadges: string[];
}

const Hero = ({ heading, subheading, cta, secondaryCta, trustBadges }: HeroProps) => {
    return (
        <section className="relative pt-16 pb-20 bg-gradient-to-b from-navy-900 to-navy-800 text-white overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {trustBadges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium px-3 py-1 bg-navy-700 text-yellow-400 rounded-full"
                                >
                  {badge}
                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {heading}
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 text-gray-200">
                            {subheading}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <a
                                href="#schedule"
                                className="py-3 px-8 rounded-md bg-yellow-600 text-white font-medium text-center hover:bg-yellow-700 transition-colors"
                            >
                                {cta}
                            </a>
                            <a
                                href="#locations"
                                className="py-3 px-8 rounded-md bg-transparent border border-white text-white font-medium text-center hover:bg-white/10 transition-colors"
                            >
                                {secondaryCta}
                            </a>
                        </div>

                        {/* Mini testimonials to build trust */}
                        {/*<div className="grid grid-cols-2 gap-4">*/}
                        {/*    <ParentReviewBadge*/}
                        {/*        name="Parent in Lafayette"*/}
                        {/*        location="Acalanes High School"*/}
                        {/*        quote="My daughter got a 5 on her AP Calculus exam after struggling with math!"*/}
                        {/*        size="sm"*/}
                        {/*    />*/}
                        {/*    <ParentReviewBadge*/}
                        {/*        name="Parent in Orinda"*/}
                        {/*        location="Miramonte High School"*/}
                        {/*        quote="Going from a C to an A in physics in just one semester!"*/}
                        {/*        size="sm"*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>

                    <div className="relative">
                        <div className="relative bg-navy-700 rounded-lg overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                            <div className="p-2">
                                <Image
                                    src="/images/tutor-session.jpg"
                                    alt="Professional tutor helping student with advanced mathematics problem"
                                    width={600}
                                    height={400}
                                    className="rounded"
                                    priority
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="font-medium text-lg text-white mb-2">Expert Math & Physics Tutoring</h3>
                                <p className="text-gray-300 mb-4">UC Berkeley graduate with 15+ years experience helping students excel in top Bay Area schools.</p>

                                <div className="grid grid-cols-3 text-center border-t border-navy-600 pt-4">
                                    <div>
                                        <div className="text-3xl font-bold text-yellow-500">15+</div>
                                        <div className="text-xs text-gray-300">Years Experience</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-yellow-500">500+</div>
                                        <div className="text-xs text-gray-300">Students Helped</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-yellow-500">100%</div>
                                        <div className="text-xs text-gray-300">Satisfaction Guarenteed</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating schedule badge */}
                        <div className="absolute -bottom-6 -right-6 bg-yellow-600 text-white p-4 rounded-lg shadow-lg transform rotate-3 z-20 hidden lg:block">
                            <p className="text-sm font-bold">Limited Availability!</p>
                            <p className="text-xs">Schedule your free consultation today</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;