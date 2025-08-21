import Button from './Button';
import { PricingPlan } from "@/types";
import { useCal } from '../CalProvider';
import { Check } from 'lucide-react';

interface PricingCardProps {
    plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
    const { open } = useCal();
    return (
        <div className={`academic-card rounded-lg shadow-lg overflow-hidden border flex flex-col ${plan.popular ? 'border-academic-gold transform scale-105 z-10' : 'border-academic-navy/20 dark:border-academic-off-white/20'} transition-all hover:shadow-xl`}>
            {plan.popular && (
                <div className="bg-academic-gold text-academic-navy text-center py-1 text-sm font-medium">
                    Most Popular
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">{plan.name}</h3>

                <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-foreground dark:text-white">${plan.price}</span>
                    <span className="text-academic-medium-blue dark:text-academic-off-white ml-1">{plan.unit}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <Check className="w-5 h-5 text-academic-gold mr-2 flex-shrink-0" />
                            <span className="text-academic-medium-blue dark:text-academic-off-white">{feature}</span>
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