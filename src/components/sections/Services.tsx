import { Service } from '@/types';
import ServiceCard from '../ui/ServiceCard';

interface ServicesProps {
    heading: string;
    subheading: string;
    services: Service[];
}

const Services = ({ heading, subheading, services }: ServicesProps) => {
    return (
        <section id="services" className="py-16 bg-navy-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                    <p className="text-xl text-navy-600 max-w-3xl mx-auto">{subheading}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>

                <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto border-l-4 border-yellow-600">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-navy-800 mb-2">Not sure which service is right for your child?</h3>
                            <p className="text-gray-700 mb-4">
                                Every student has unique needs and learning styles. Schedule a free consultation to discuss your child's
                                specific challenges and goals, and I'll recommend the best approach for their success.
                            </p>

                            <a
                                href="#schedule"
                                className="inline-block py-2 px-6 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 transition-colors"
                            >
                                Schedule Free Consultation
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;