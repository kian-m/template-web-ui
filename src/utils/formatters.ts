// Text and data formatters

// Format phone number to (XXX) XXX-XXXX
export const formatPhoneNumber = (phoneNumberString: string): string => {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
};

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
    return `${value}%`;
};

// Create SEO-friendly URL slugs
export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

// Format location name for display in URLs or IDs
export const formatLocationName = (city: string): string => {
    return city.toLowerCase().replace(/\s+/g, '-');
};

// Generate a readable location description for SEO
export const getLocationSEODescription = (city: string, service: string): string => {
    return `Expert ${service} tutoring services available in ${city}, CA. Personalized sessions at local libraries or online. Schedule your free consultation today.`;
};

// Format time range (e.g., "3:00 PM - 5:00 PM")
export const formatTimeRange = (start: string, end: string): string => {
    return `${start} - ${end}`;
};

// Helper to truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};