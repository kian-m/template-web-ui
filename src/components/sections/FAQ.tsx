import { FAQ } from '@/types';
import FAQItem from '../ui/FAQItem';

interface FAQProps {
    heading: string;
    subheading: string;
    faqs: FAQ[];
}

const FAQSection = ({ heading, subheading, faqs }: FAQProps) => {
    return (
        <section id="faq" className="py-16 bg-navy-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                    <p className="text-xl text-navy-600 max-w-3xl mx-auto">{subheading}</p>
                </div>

                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-1 bg-yellow-600"></div>
                    <div className="p-6">
                        {faqs.map((faq) => (
                            <FAQItem key={faq.id} faq={faq} />
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="mb-4 text-navy-700">Don't see your question answered?</p>
                    <a
                        href="#schedule"
                        className="inline-block py-2 px-6 text-navy-800 border border-navy-800 rounded-md font-medium hover:bg-navy-800 hover:text-white transition-colors"
                    >
                        Contact me directly
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;