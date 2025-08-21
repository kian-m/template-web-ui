import { Metadata } from 'next';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Services from '../components/sections/Services';
import LocationMap from '../components/sections/LocationMap';
import ResultsShowcase from '../components/sections/ResultsShowcase';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import ContactCTA from '../components/sections/ContactCTA';
import { siteContent } from '../data/siteContent';

export const metadata: Metadata = {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    keywords: siteContent.seo.keywords.join(', '),
};

export default function Home () {
    return (
        <main>
            <Hero
                heading={siteContent.hero.heading}
                subheading={siteContent.hero.subheading}
                cta={siteContent.hero.cta}
                secondaryCta={siteContent.hero.secondaryCta}
                trustBadges={siteContent.hero.trustBadges}
            />

            <About
                heading={siteContent.about.heading}
                bio={siteContent.about.bio}
                expertise={siteContent.about.expertise}
                approach={siteContent.about.approach}
            />

            <Services
                heading={siteContent.services.heading}
                subheading={siteContent.services.subheading}
                services={siteContent.services.items}
            />

            <LocationMap
                heading={siteContent.locations.heading}
                subheading={siteContent.locations.subheading}
                description={siteContent.locations.description}
                callout={siteContent.locations.callout}
                ctaText={siteContent.locations.ctaText}
                locations={siteContent.locations.libraries}
            />

            <ResultsShowcase
                heading={siteContent.results.heading}
                subheading={siteContent.results.subheading}
                description={siteContent.results.description}
                results={siteContent.results.items}
            />

            <Pricing
                heading={siteContent.pricing.heading}
                subheading={siteContent.pricing.subheading}
                note={siteContent.pricing.note}
                ctaText={siteContent.pricing.ctaText}
                plans={siteContent.pricing.plans}
                consultation={siteContent.pricing.consultation}
            />

            <FAQ
                heading={siteContent.faq.heading}
                subheading={siteContent.faq.subheading}
                faqs={siteContent.faq.items}
            />

            <ContactCTA
                heading={siteContent.contact.heading}
                subheading={siteContent.contact.subheading}
                email={siteContent.contact.email}
                phone={siteContent.contact.phone}
                availability={siteContent.contact.availability}
                ctaText={siteContent.contact.ctaText}
            />

            {/* Add structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": siteContent.seo.structuredData.type,
                        "name": siteContent.seo.structuredData.name,
                        "description": siteContent.seo.structuredData.description,
                        "address": {
                            "@type": "PostalAddress",
                            "addressRegion": "CA",
                            "addressCountry": "US"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 37.8914,
                            "longitude": -122.1159
                        },
                        "url": "https://www.bayareatutoring.com",
                        "telephone": siteContent.contact.phone,
                        "email": siteContent.contact.email,
                        "areaServed": siteContent.seo.structuredData.serviceArea.map(area => ({
                            "@type": "City",
                            "name": area,
                            "containedInPlace": {
                                "@type": "State",
                                "name": "California"
                            }
                        })),
                        "priceRange": "$60-$85",
                        "openingHoursSpecification": [
                            {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" ],
                                "opens": "15:00",
                                "closes": "20:00"
                            },
                            {
                                "@type": "OpeningHoursSpecification",
                                "dayOfWeek": [ "Saturday", "Sunday" ],
                                "opens": "10:00",
                                "closes": "17:00"
                            }
                        ]
                    })
                }}
            />
        </main>
    );
}