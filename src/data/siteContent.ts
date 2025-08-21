import { SiteContent } from '../types';

export const siteContent: SiteContent = {
    hero: {
        heading: "Expert Math & Physics Tutoring in Top Bay Area Neighborhoods",
        subheading: "UC Berkeley-educated tutor helping students excel at Lafayette, Orinda, Dublin, Walnut Creek, and Berkeley libraries or online",
        cta: "Schedule Free Consultation",
        secondaryCta: "View Tutoring Locations",
        trustBadges: [ "UC Berkeley Graduate", "15+ Years Experience", "Grade Improvement", "Test Preparation" ]
    },
    stats: {
        experience: 10,
        studentsHelped: 500,
        gradeImprovement: 95,
        acceptanceRate: 87 // % of students accepted to target schools
    },
    about: {
        heading: "Your Child's Success is My Priority",
        bio: "I'm a UC Berkeley graduate with over 15 years of experience tutoring students in mathematics and physics. My approach focuses on building strong foundations while developing critical thinking skills that extend beyond the classroom.",
        expertise: [
            "Algebra & Geometry",
            "Trigonometry",
            "Pre-Calculus",
            "AP Calculus (AB & BC)",
            "AP Physics",
            "College Calculus I-III",
            "Linear Algebra",
            "Differential Equations"
        ],
        approach: {
            heading: "My Teaching Approach",
            description: "I believe that every student has unique learning needs. My tutoring philosophy centers around:",
            points: [
                {
                    title: "Building Strong Foundations",
                    description: "Ensuring students thoroughly understand core concepts before advancing to more complex topics."
                },
                {
                    title: "Developing Problem-Solving Skills",
                    description: "Teaching strategies to approach new problems independently and with confidence."
                },
                {
                    title: "Customized Learning Plans",
                    description: "Creating personalized study plans based on individual strengths, weaknesses, and goals."
                },
                {
                    title: "Regular Progress Assessment",
                    description: "Continuous evaluation to ensure improvement and adjust strategies as needed."
                }
            ]
        }
    },
    services: {
        heading: "Personalized Tutoring Services",
        subheading: "Tailored to your child's specific needs and learning style",
        items: [
            {
                id: "in-person",
                title: "In-Person Tutoring*",
                description: "Face-to-face sessions at the best libraries throughout Lafayette, Orinda, Dublin, Walnut Creek, and Berkeley.",
                icon: "location-pin",
                benefits: [
                    "Personalized attention in a distraction-free environment",
                    "Real-time problem solving and feedback",
                    "Convenient locations in the East Bay",
                    "Access to library resources and study materials"
                ]
            },
            {
                id: "online",
                title: "Online Tutoring",
                description: "Virtual sessions available worldwide through secure video conferencing.",
                icon: "laptop",
                benefits: [
                    "Interactive digital whiteboard for problem-solving",
                    "Flexible scheduling to accommodate any time zone",
                    "Session recordings available for review",
                    "No commute time – perfect for busy schedules"
                ]
            },
            {
                id: "test-prep",
                title: "AP & SAT Test Preparation",
                description: "Specialized coaching for Advanced Placement exams and SAT Math/Physics Subject Tests.",
                icon: "document-check",
                benefits: [
                    "Targeted practice with actual exam questions",
                    "Test-taking strategies to maximize scores",
                    "Comprehensive review of all test topics",
                    "Proven track record of 5s on AP exams"
                ]
            },
            {
                id: "college-prep",
                title: "College Application Support",
                description: "Guidance on course selection and academic preparation for competitive colleges.",
                icon: "graduation-cap",
                benefits: [
                    "Advice on high school course selection",
                    "Strategies for standing out academically",
                    "Building a strong STEM foundation",
                    "Preparation for college-level mathematics"
                ]
            }
        
        ],
    },
    locations: {
        heading: "Tutoring Locations",
        subheading: "Serving the Bay Area's Brightest",
        description: "I offer tutoring sessions at five premier libraries throughout the Bay Area, carefully selected for their excellent facilities, comfortable study environments, and convenient locations accessible by bart.",
        callout: "",
        ctaText: "Discuss Location Options",
        libraries: [
            {
                id: "lafayette",
                name: "Lafayette Library and Learning Center",
                address: "3491 Mt Diablo Blvd",
                city: "Lafayette",
                region: "East Bay",
                coordinates: {
                    lat: 37.8914,
                    lng: -122.1159
                },
                amenities: [ "Private study rooms", "Modern facilities", "Quiet atmosphere" ],
                availableDays: [ "Monday", "Wednesday", "Friday" ]
            },
            {
                id: "orinda",
                name: "Orinda Library",
                address: "26 Orinda Way",
                city: "Orinda",
                region: "East Bay",
                coordinates: {
                    lat: 37.8771,
                    lng: -122.1799
                },
                amenities: [ "Group study areas", "Peaceful environment", "Advanced technology" ],
                availableDays: [ "Tuesday", "Thursday", "Saturday" ]
            },
            {
                id: "dublin",
                name: "Dublin Library",
                address: "200 Civic Plaza",
                city: "Dublin",
                region: "East Bay",
                coordinates: {
                    lat: 37.7021,
                    lng: -121.9269
                },
                amenities: [ "Modern study spaces", "Digital resources", "Conference rooms" ],
                availableDays: [ "Monday", "Tuesday", "Saturday" ]
            },
            {
                id: "walnut-creek",
                name: "Walnut Creek Library",
                address: "1644 N Broadway",
                city: "Walnut Creek",
                region: "East Bay",
                coordinates: {
                    lat: 37.9045,
                    lng: -122.0605
                },
                amenities: [ "Private tutoring rooms", "Quiet study area", "Premier facilities" ],
                availableDays: [ "Wednesday", "Thursday", "Friday" ]
            },
            {
                id: "berkeley",
                name: "Berkeley Public Library - North Branch",
                address: "1170 The Alameda",
                city: "Berkeley",
                region: "East Bay",
                coordinates: {
                    lat: 37.8912,
                    lng: -122.2835
                },
                amenities: [ "University atmosphere", "Academic resources", "Study rooms" ],
                availableDays: [ "Tuesday", "Friday", "Sunday" ]
            }
        ]
    },
    results: {
        heading: "Proven Results",
        subheading: "See how my students transform their academic performance",
        description: "I've helped hundreds of students achieve remarkable improvements in their grades and test scores. Here are some recent success stories:",
        items: [

        ]
    },
    pricing: {
        heading: "Investment in Your Child's Future",
        subheading: "Transparent pricing with options to fit your needs",
        note: "Need a custom package? Contact me to discuss your specific requirements.",
        ctaText: "Request Custom Package",
        plans: [
            {
                id: "single",
                name: "Single Session",
                price: 85,
                unit: "/hour",
                sessions: 1,
                features: [
                    "One-on-one personalized instruction",
                    "Flexible scheduling",
                    "No long-term commitment"
                ],
                cta: "Book Now"
            },
            {
                id: "semester",
                name: "Semester Package",
                price: 65,
                unit: "/hour",
                popular: true,
                sessions: 16,
                savings: 320,
                features: [
                    "16 weekly sessions (one semester)",
                    "Best value for long-term improvement",
                    "Comprehensive study plan",
                    "Priority scheduling",
                    "Unlimited email support"
                ],
                cta: "Book Now"
            },
            {
                id: "package",
                name: "Package of 10",
                price: 75,
                unit: "/hour",
                popular: false,
                sessions: 10,
                savings: 100,
                features: [
                    "Save $100 compared to single sessions",
                    "Consistent weekly or bi-weekly sessions",
                    "Progress tracking",
                    "Email support between sessions"
                ],
                cta: "Book Now"
            }
        ],
        consultation: {
            heading: "Free Initial Consultation",
            description: "Schedule a 30-minute consultation to discuss your child's needs and goals. I'll create a personalized learning plan and show you how I can help your child succeed.",
            ctaText: "Schedule Free Consultation"
        }
    },
    faq: {
        heading: "Frequently Asked Questions",
        subheading: "Find answers to common questions about my tutoring services",
        items: [
            {
                id: "faq-1",
                question: "How do I know if my child needs a tutor?",
                answer: "Signs that your child might benefit from tutoring include declining grades, expressed frustration with school work, procrastination on assignments, or simply wanting to excel beyond the classroom curriculum. Many parents in Lafayette, Orinda, and surrounding communities use tutoring to give their children a competitive edge academically."
            },
            {
                id: "faq-2",
                question: "What makes you different from other tutors?",
                answer: "As a UC Berkeley graduate specializing in mathematics and physics, I bring deep subject expertise combined with over 15 years of experience teaching students specifically from top Bay Area schools. I understand the academic pressures and expectations in our affluent communities and tailor my approach to help your child excel in these competitive environments."
            },
            {
                id: "faq-3",
                question: "How long are tutoring sessions?",
                answer: "Standard sessions are 60 minutes, but I also offer 90-minute and 2-hour sessions for more intensive study needs. The best duration depends on your child's age, attention span, and learning goals. For advanced placement and college prep students, I typically recommend longer sessions."
            },
            {
                id: "faq-4",
                question: "How often should we schedule sessions?",
                answer: "For most students, weekly sessions provide the right balance of instruction and independent practice. For students who need more support or are preparing for important exams, twice-weekly sessions may be recommended. Consistency is key to seeing improvement."
            },
            {
                id: "faq-5",
                question: "What's your cancellation policy?",
                answer: "I understand that things come up. I request at least 24 hours notice for cancellations. Sessions cancelled with less than 24 hours notice may be charged a 50% fee. No-shows are charged the full session rate. This policy respects everyone's time and allows me to potentially offer the slot to another student."
            },
            {
                id: "faq-6",
                question: "Do you offer any guarantees?",
                answer: "While I can't guarantee specific grade improvements (no ethical tutor can), I do guarantee that I will provide the highest quality instruction tailored to your child's needs. If you're ever unsatisfied with a session, please let me know immediately, and we'll address your concerns or adjust our approach."
            },
            {
                id: "faq-7",
                question: "Can you help with college applications?",
                answer: "Yes, I offer guidance on course selection and academic preparation to strengthen college applications. Many of my former students have been accepted to prestigious institutions including Stanford, UC Berkeley, MIT, and Ivy League schools. While I don't write essays or complete applications, I help students build the strong academic foundation that makes them competitive candidates."
            },
            {
                id: "faq-8",
                question: "Do you assign homework?",
                answer: "Yes, I typically provide practice problems between sessions to reinforce concepts we've covered. The amount varies based on the student's needs and schedule, but consistent practice is key to improvement in math and physics. I carefully select problems that will be most beneficial to your child's specific learning goals."
            }
        ]
    },
    contact: {
        heading: "Book Your Free Consultation",
        subheading: "Let's discuss how I can help your child excel academically",
        email: "contact@bayareatutoring.com",
        phone: "(925) 555-1234",
        availability: [
            "Weekdays: 3pm - 8pm",
            "Weekends: 10am - 5pm"
        ],
        ctaText: "Schedule Free Consultation"
    },
    seo: {
        title: "Expert Math & Physics Tutoring | Lafayette, Orinda, Dublin, Walnut Creek, Berkeley",
        description: "UC Berkeley-educated tutor offering personalized math and physics tutoring in Top Bay Area neighborhoods. 100% satisfaction guaranteed. Schedule a free consultation today.",
        keywords: [
            "math tutor Lafayette",
            "physics tutor Orinda",
            "AP Calculus tutor Walnut Creek",
            "Berkeley math tutor",
            "Dublin physics tutoring",
            "East Bay STEM tutor",
            "AP test prep Bay Area",
            "private math tutor affluent Bay Area",
            "college prep tutor"
        ],
        structuredData: {
            type: "LocalBusiness",
            name: "Bay Area Premium Tutoring",
            description: "Expert math and physics tutoring services in affluent Bay Area neighborhoods.",
            serviceArea: [ "Lafayette", "Orinda", "Dublin", "Walnut Creek", "Berkeley" ]
        }
    }
};