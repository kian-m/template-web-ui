// Location type definition
export interface Location {
    name: string;
    description: string;
    distance: string;
    address: string;
    mapUrl?: string;
}

// Subject type definition
export interface Subject {
    title: string;
    description: string;
    topics: string[];
    icon?: React.ReactNode;
}

// Subjects data structure
export interface SubjectsData {
    [key: string]: Subject;
}

// Testimonial type definition
export interface Testimonial {
    id: number;
    name: string;
    school: string;
    quote: string;
    subject: string;
    rating: number;
    imageUrl?: string;
}

// FAQ item type
export interface FaqItem {
    question: string;
    answer: string;
}

// Navigation link type
export interface NavLink {
    name: string;
    href: string;
    current?: boolean;
}