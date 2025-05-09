import Image from 'next/image';
import Button from '../ui/Button';

interface AboutProps {
    heading: string;
    bio: string;
    expertise: string[];
    approach: {
        heading: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
        }>;
    };
}

const About = ({ heading, bio, expertise, approach }: AboutProps) => {
    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-6">{heading}</h2>
                        <p className="text-gray-700 mb-6">{bio}</p>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-navy-800 mb-4">Areas of Expertise:</h3>
                            <div className="flex flex-wrap gap-3">
                                {expertise.map((area, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-navy-50 text-navy-800 rounded-full text-sm font-medium"
                                    >
                    {area}
                  </span>
                                ))}
                            </div>
                        </div>

                        <Button href="#schedule">Schedule a Free Consultation</Button>
                    </div>

                    <div className="relative">
                        <div className="bg-navy-50 rounded-lg p-8 relative z-10">
                            <Image
                                src="/images/tutor-profile.jpg"
                                alt="UC Berkeley graduate math and physics tutor"
                                width={400}
                                height={400}
                                className="rounded-lg mx-auto shadow-lg"
                            />

                            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-yellow-600 rounded-full p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                    </div>
                                    <div className="text-navy-800">
                                        <div className="font-semibold">UC Berkeley Graduate</div>
                                        <div className="text-sm">Mathematics & Physics</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-navy-800 rounded-lg -z-10 rotate-3"></div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-navy-800 mb-3">{approach.heading}</h2>
                        <p className="text-gray-700 max-w-3xl mx-auto">{approach.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {approach.points.map((point, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-6 shadow border border-gray-100 hover:border-yellow-500 transition-all"
                            >
                                <div className="w-12 h-12 bg-navy-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-navy-800 font-bold text-xl">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold text-navy-800 mb-3">{point.title}</h3>
                                <p className="text-gray-700">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;