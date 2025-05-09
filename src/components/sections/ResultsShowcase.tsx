import Image from 'next/image';
import { StudentResult } from '@/types';

interface ResultsShowcaseProps {
    heading: string;
    subheading: string;
    description: string;
    results: StudentResult[];
}

const ResultsShowcase = ({ heading, subheading, description, results }: ResultsShowcaseProps) => {
    return (
        <section id="results" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                    <p className="text-xl text-navy-600 mb-6">{subheading}</p>
                    <p className="max-w-3xl mx-auto text-gray-700">{description}</p>
                </div>

                {/* Grade improvement visualization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-yellow-500 transition-all hover:shadow-xl"
                        >
                            <div className="p-1 bg-navy-700 text-white text-center text-sm font-medium">
                                {result.schoolName}
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-center">
                                        <div className="text-gray-500 text-sm">Before</div>
                                        <div className="text-4xl font-bold text-red-500">{result.beforeGrade}</div>
                                    </div>

                                    <div className="flex-1 px-4">
                                        <div className="h-2 bg-gray-200 rounded-full relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-0.5 bg-gray-300"></div>
                                                <div className="absolute left-0 right-0 flex justify-between">
                                                    <div className="h-4 w-4 rounded-full bg-red-500 transform -translate-y-1/2"></div>
                                                    <div className="h-4 w-4 rounded-full bg-green-500 transform -translate-y-1/2"></div>
                                                </div>
                                            </div>
                                            <div className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                        <div className="text-sm text-center mt-1 text-navy-600">{result.timeFrame}</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-gray-500 text-sm">After</div>
                                        <div className="text-4xl font-bold text-green-500">{result.afterGrade}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-navy-800 mb-2">{result.subject}</h3>
                                    <p className="text-gray-700">{result.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ResultsShowcase;