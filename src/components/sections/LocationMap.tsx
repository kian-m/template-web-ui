'use client';

import { useEffect, useRef, useState } from 'react';
import { LibraryLocation } from '@/types';
import Script from 'next/script';
import Image from 'next/image';
import { mapStyles } from '@/utils/mapUtils';

interface LocationMapProps {
    locations: LibraryLocation[];
    heading: string;
    subheading: string;
    description: string;
    callout: string;
    ctaText: string;
}

const LocationMap = ({
                         locations,
                         heading,
                         subheading,
                         description,
                         callout,
                         ctaText
                     }: LocationMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [ mapLoaded, setMapLoaded ] = useState(false);
    const [ activeLocation, setActiveLocation ] = useState<LibraryLocation | null>(null);

    // Initialize map after script loads
    useEffect(() => {
        // Check if map has loaded and DOM element exists
        if (!mapLoaded || !mapRef.current) return;

        // Check if Google Maps is available
        if (typeof window.google === 'undefined') {
            console.error('Google Maps JavaScript API not loaded');
            return;
        }

        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 37.8271, lng: -122.2913 }, // Center on East Bay
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            styles: mapStyles,
        });

        // Create markers and info windows for each location
        locations.forEach((location) => {
            const marker = new window.google.maps.Marker({
                position: {
                    lat: location.coordinates.lat,
                    lng: location.coordinates.lng
                },
                map: map,
                title: location.name,
                animation: window.google.maps.Animation.DROP,
            });

            // Create info window
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
          <div class="p-3">
            <h3 class="text-lg font-bold mb-1">${location.name}</h3>
            <p class="text-sm mb-2">${location.address}, ${location.city}</p>
            <p class="text-sm mb-2"><strong>Available:</strong> ${location.availableDays.join(', ')}</p>
            <a href="#schedule" class="inline-block py-1 px-3 bg-yellow-600 text-white text-sm rounded">
              Schedule Here
            </a>
          </div>
        `,
            });

            // Add click event listener to marker
            marker.addListener('click', () => {
                infoWindow.open(map, marker);
                setActiveLocation(location);
            });
        });
    }, [ mapLoaded, locations ]);

    return (
        <>
            {/* Load Google Maps Script */}
            <Script
                id="google-maps"
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`}
                onLoad={() => setMapLoaded(true)}
                strategy="lazyOnload"
            />

            <section id="locations" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3">{heading}</h2>
                        <p className="text-xl text-navy-600 mb-6">{subheading}</p>
                        <p className="max-w-3xl mx-auto text-gray-700 mb-6">{description}</p>

                    </div>

                    {/* Map fallback image for SSR and SEO */}
                    <div className="relative">
                        <div className="relative w-full h-[500px] rounded-lg shadow-lg mb-8 overflow-hidden">
                            {/* The actual map container */}
                            <div
                                ref={mapRef}
                                className="absolute inset-0 z-10"
                                aria-label="Map showing tutoring locations in Lafayette, Orinda, Dublin, Walnut Creek, and Berkeley"
                            ></div>

                            {/* Fallback image (shown during SSR and before map loads) */}
                            {!mapLoaded && (
                                <div className="absolute inset-0 z-0 bg-gray-200 flex items-center justify-center">
                                    <div className="p-4 bg-white rounded shadow-md">
                                        <p className="text-navy-800 font-medium">Loading map of tutoring locations...</p>
                                        <div className="mt-2 flex justify-center">
                                            <div className="animate-spin h-6 w-6 border-2 border-yellow-600 border-t-transparent rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location list for SEO and accessibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                className={`
                  bg-white p-5 rounded-lg shadow-md border 
                  ${activeLocation?.id === location.id ? 'border-yellow-500' : 'border-gray-200'} 
                  hover:border-yellow-500 transition-colors
                `}
                                onClick={() => setActiveLocation(location)}
                            >
                                <h3 className="font-bold text-lg text-navy-800 mb-2">{location.name}</h3>
                                <p className="text-navy-600 mb-3">{location.address}<br/>{location.city}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-sm bg-navy-50 text-navy-700 px-3 py-1 rounded-full">
                                        {location.region}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 mb-2">
                                    <strong>Available:</strong> {location.availableDays.join(', ')}
                                </div>
                                <div className="text-sm text-gray-700 mb-4">
                                    <strong>Amenities:</strong> {location.amenities.join(', ')}
                                </div>

                                <a
                                    href="#schedule"
                                    className="inline-block w-full text-center py-2 bg-yellow-600 text-white rounded-md font-medium hover:bg-yellow-700 transition-colors"
                                    data-ph-event="location_schedule_here_click"
                                >
                                    Schedule Here
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-navy-600 mb-4">Can't find a convenient location? I'm flexible and may be able to meet at other libraries or quiet study spaces in the Bay Area.</p>
                        <button
                            className="bg-navy-700 hover:bg-navy-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
                            data-ph-event="location_cta_click"
                        >
                            {ctaText}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LocationMap;