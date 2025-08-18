import { Metadata } from 'next';

// Function to generate dynamic SEO metadata for different pages
export function generateMetadata (
    title: string,
    description: string,
    path: string = '/',
    image: string = '/images/tutoring-og.jpg'
): Metadata {
    const url = `https://bayareatutoring.com${path}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'Bay Area Premier Tutoring',
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@bayareatutoring',
            images: [image],
        },
    };
}

// Generate structured data for local business
export function generateLocalBusinessSchema () {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Bay Area Premier Tutoring',
        description: 'Expert math and physics tutoring with 15+ years experience from a UC Berkeley educator serving Walnut Creek, Orinda, Lafayette, Rockridge and Dublin areas.',
        image: 'https://bayareatutoring.com/images/tutoring-logo.jpg',
        '@id': 'https://bayareatutoring.com',
        url: 'https://bayareatutoring.com',
        telephone: '+19255551234',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Walnut Creek Library Area',
            addressLocality: 'Walnut Creek',
            addressRegion: 'CA',
            postalCode: '94596',
            addressCountry: 'US'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.9101,
            longitude: -122.0652
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
                opens: '08:00',
                closes: '21:00'
            }
        ],
        sameAs: [
            'https://www.facebook.com/bayareatutoring',
            'https://www.instagram.com/bayareatutoring'
        ],
        priceRange: '$$'
    };
}

// Generate FAQPage schema
export function generateFAQSchema (faqItems: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };
}

// Generate Service schema
export function generateServiceSchema () {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Tutoring Service',
        provider: {
            '@type': 'LocalBusiness',
            name: 'Bay Area Premier Tutoring'
        },
        areaServed: {
            '@type': 'GeoCircle',
            geoMidpoint: {
                '@type': 'GeoCoordinates',
                latitude: 37.9101,
                longitude: -122.0652
            },
            geoRadius: '30 mi'
        },
        serviceOutput: 'Improved academic performance',
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceSpecification: {
                '@type': 'PriceSpecification',
                price: '60.00',
                priceCurrency: 'USD',
                unitText: 'HOUR'
            }
        }
    };
}