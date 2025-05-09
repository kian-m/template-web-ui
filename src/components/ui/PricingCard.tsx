import Button from './Button';
import { PricingPlan } from "@/types";

interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
    return (
        <div className={`
      bg-white rounded-lg shadow-lg overflow-hidden border
      ${plan.popular ? 'border-yellow-500 transform scale-105 z-10' : 'border-gray-200'}
      transition-all hover:shadow-xl
    `}>
            {plan.popular && (
                <div className="bg-yellow-600 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                </div>
            )}

            <div className="p-6">
                <h3 className="text-xl font-bold text-navy-800 mb-2">{plan.name}</h3>

                <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-navy-800">${plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.unit}</span>
                </div>

                <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    fullWidth
                    href="#schedule"
                >
                    {plan.cta}
                </Button>
            </div>
        </div>
    );
};

export default PricingCard;