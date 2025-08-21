import Button from './Button';
import { PricingPlan } from "@/types";
import { useCal } from '../CalProvider';

interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
    const { open } = useCal();
    return (
        <div className={`bg-white rounded-lg shadow-lg overflow-hidden border flex flex-col ${plan.popular ? 'border-yellow-500 transform scale-105 z-10' : 'border-gray-200'} transition-all hover:shadow-xl`}>
            {plan.popular && (
                <div className="bg-yellow-600 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-navy-800 mb-2">{plan.name}</h3>

                <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-navy-800">${plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.unit}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    fullWidth
                    onClick={() => open('https://cal.com/thebayarea/1-hour-session?embed=1')}
                    className="schedule-trigger"
                >
                    {plan.cta}
                </Button>
            </div>
        </div>
    );
};

export default PricingCard;