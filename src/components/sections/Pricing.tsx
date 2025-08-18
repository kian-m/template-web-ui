import { PricingPlan } from '@/types';
import PricingCard from '../ui/PricingCard';
import Button from '../ui/Button';

interface PricingProps {
    heading: string;
    subheading: string;
    note: string;
    ctaText: string;
    plans: PricingPlan[];
    consultation: {
        heading: string;
        description: string;
        ctaText: string;
    };
}

const Pricing = ({ heading, subheading, note, ctaText, plans, consultation }: PricingProps) => {
    return (
        <section id="pricing" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                    <p className="text-xl text-navy-600 max-w-3xl mx-auto">{subheading}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <PricingCard key={plan.id} plan={plan} />
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <Button
                        href="#contact"
                        variant="outline"
                    >
                        {ctaText}
                    </Button>
                </div>

                <p className="text-center text-gray-600 mt-8 mb-12">{note}</p><div className="max-w-4xl mx-auto bg-navy-50 rounded-lg p-8 border-l-4 border-yellow-600">

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="md:w-2/3 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-navy-800 mb-3">{consultation.heading}</h3>
                        <p className="text-navy-600 mb-6">{consultation.description}</p>

                        <Button
                            href="#schedule"
                            variant="primary"
                        >
                            {consultation.ctaText}
                        </Button>
                    </div>
                </div>
            </div>

            </div>
        </section>
    );
};

export default Pricing;