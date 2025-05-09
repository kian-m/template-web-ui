import { LibraryLocation } from '@/types';

// Calculate center coordinates for a set of locations
export const calculateMapCenter = (locations: LibraryLocation[]): { lat: number; lng: number } => {
    if (locations.length === 0) {
        // Default to Bay Area center if no locations
        return { lat: 37.8271, lng: -122.2913 };
    }

    // Calculate average of coordinates
    const sumLat = locations.reduce((sum, location) => sum + location.coordinates.lat, 0);
    const sumLng = locations.reduce((sum, location) => sum + location.coordinates.lng, 0);

    return {
        lat: sumLat / locations.length,
        lng: sumLng / locations.length,
    };
};

// Get appropriate zoom level based on location spread
export const getZoomLevel = (locations: LibraryLocation[]): number => {
    if (locations.length <= 1) {
        return 13; // Close zoom for single location
    }

    // Calculate bounds
    const lats = locations.map(loc => loc.coordinates.lat);
    const lngs = locations.map(loc => loc.coordinates.lng);

    const maxLat = Math.max(...lats);
    const minLat = Math.min(...lats);
    const maxLng = Math.max(...lngs);
    const minLng = Math.min(...lngs);

    // Calculate distance
    const latDistance = maxLat - minLat;
    const lngDistance = maxLng - minLng;
    const maxDistance = Math.max(latDistance, lngDistance);

    // Determine zoom based on distance
    if (maxDistance > 0.5) return 9;
    if (maxDistance > 0.2) return 10;
    if (maxDistance > 0.1) return 11;
    if (maxDistance > 0.05) return 12;
    return 13;
};

// Generate Google Maps directions URL
export const getDirectionsUrl = (destination: LibraryLocation): string => {
    const address = encodeURIComponent(`${destination.name}, ${destination.address}, ${destination.city}, CA`);
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
};

// Custom map style focused on highlighting affluent neighborhoods
export const mapStyles = [
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#092f5e" }]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#e8f2e1" }, { "visibility": "on" }]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [{ "visibility": "on" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#dadada" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#c9e2f3" }]
    }
];

// Generate map pin based on affluence level (customize icon)
export const getLocationPin = (affluenceLevel: number): string => {
    // Pins can be customized based on the affluence level
    if (affluenceLevel >= 9) {
        return '/images/location-pins/premium-pin.png';
    } else if (affluenceLevel >= 7) {
        return '/images/location-pins/quality-pin.png';
    } else {
        return '/images/location-pins/standard-pin.png';
    }
};

// Filter locations by region
export const filterLocationsByRegion = (
    locations: LibraryLocation[],
    region: string
): LibraryLocation[] => {
    if (!region || region === 'all') return locations;
    return locations.filter(location => location.region === region);
};