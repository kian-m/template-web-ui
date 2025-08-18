import { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:border-yellow-500 transition-all p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mr-4">
                    {service.icon === 'location-pin' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                    {service.icon === 'laptop' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    )}
                    {service.icon === 'document-check' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    )}
                    {service.icon === 'graduation-cap' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-navy-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    )}
                </div>
                <h3 className="text-xl font-bold text-navy-800">{service.title}</h3>
            </div>

            <p className="text-gray-700 mb-6">{service.description}</p>

            <div className="mt-auto">
                <h4 className="font-semibold text-navy-800 mb-2">Benefits:</h4>
                <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ServiceCard;