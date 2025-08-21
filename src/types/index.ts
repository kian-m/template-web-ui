export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    benefits: string[];
}

export interface LibraryLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    region: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    amenities: string[]; // Study room, quiet space, etc.
    availableDays: string[]; // Days available at this location
}

export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    unit: string;
    popular?: boolean;
    features: string[];
    cta: string;
    sessions?: number;
    savings?: number;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export interface StudentResult {
    id: string;
    beforeGrade: string;
    afterGrade: string;
    subject: string;
    timeFrame: string;
    description: string;
    schoolName?: string; // Optional to include prestigious schools
}

export interface SiteContent {
    hero: {
        heading: string;
        subheading: string;
        cta: string;
        secondaryCta: string;
        trustBadges: string[]; // "UC Berkeley Graduate", "15+ Years Experience", etc.
    };
    stats: {
        experience: number;
        studentsHelped: number;
        gradeImprovement: number;
        acceptanceRate?: number; // % of students accepted to target schools
    };
    about: {
        heading: string;
        bio: string;
        expertise: string[];
        approach: {
            heading: string;
            description: string;
            points: Array<{
                title: string;
                description: string;
            }>;
        };
    };
    services: {
        heading: string;
        subheading: string;
        items: Service[];
    };
    locations: {
        heading: string;
        subheading: string;
        description: string;
        callout: string; // Highlighting affluent neighborhoods
        ctaText: string;
        libraries: LibraryLocation[];
    };
    results: {
        heading: string;
        subheading: string;
        description: string;
        items: StudentResult[];
    };
    pricing: {
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
    };
    faq: {
        heading: string;
        subheading: string;
        items: FAQ[];
    };
    contact: {
        heading: string;
        subheading: string;
        email: string;
        phone: string;
        availability: string[];
        ctaText: string;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
        structuredData: {
            type: string;
            name: string;
            description: string;
            serviceArea: string[];
        };
    };
}