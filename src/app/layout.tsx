import type { Metadata } from 'next'
import './globals.css'
import { CalModalProvider } from '@/components/CalModal'

export const metadata: Metadata = {
    title: 'Bay Area Academic Tutoring | SAT, ACT & School Support | Expert Private Tutor',
    description: 'Expert Bay Area tutoring for SAT, ACT, SAT Subject Tests, and academic support. UC Berkeley graduate with 15+ years experience. Familiar with local schools and curriculum.',
    keywords: 'Bay Area tutor, SAT tutoring, ACT prep, academic tutoring, UC Berkeley, private tutor, high school support, test prep, Bay Area schools',
    authors: [{ name: 'Bay Area Academic Tutor' }],
    openGraph: {
        title: 'Bay Area Academic Tutoring | Expert Private Tutor',
        description: 'UC Berkeley graduate providing expert tutoring for SAT, ACT, and academic support in the Bay Area',
        url: 'https://thebayareatutor.com',
        siteName: 'Bay Area Academic Tutor',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Bay Area Academic Tutoring',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Bay Area Academic Tutoring | Expert Private Tutor',
        description: 'UC Berkeley graduate providing expert tutoring for SAT, ACT, and academic support',
        images: ['/og-image.jpg'],
    },
    viewport: 'width=device-width, initial-scale=1',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function RootLayout ({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Expert Bay Area Academic Tutoring Services",
                        "description": "Comprehensive tutoring services for SAT, ACT, SAT Subject Tests, and academic support from UC Berkeley graduate with 15+ years experience",
                        "author": {
                            "@type": "Person",
                            "name": "Bay Area Academic Tutor",
                            "alumniOf": "UC Berkeley"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Bay Area Academic Tutor"
                        },
                        "datePublished": "2025-01-01",
                        "dateModified": "2025-01-01",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "https://thebayareatutor.com"
                        }
                    })
                }}
            />
        </head>
        <body className="bg-academic-navy text-white antialiased">
        <CalModalProvider>
            {children}
        </CalModalProvider>
        </body>
        </html>
    )
}