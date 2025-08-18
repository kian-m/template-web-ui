'use client';

import { useState } from 'react';
import { FAQ } from '@/types';

interface FAQItemProps {
    faq: FAQ;
}

const FAQItem = ({ faq }: FAQItemProps) => {
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <button
                className="flex justify-between items-center w-full py-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-medium text-navy-800">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
          {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
          ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
          )}
        </span>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}
                aria-hidden={!isOpen}
            >
                <p className="text-gray-700">{faq.answer}</p>
            </div>
        </div>
    );
};

export default FAQItem;