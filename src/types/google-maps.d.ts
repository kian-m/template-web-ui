declare global {
    interface Window {
        google: {
            maps: {
                Map: typeof google.maps.Map;
                Marker: typeof google.maps.Marker;
                InfoWindow: typeof google.maps.InfoWindow;
                LatLng: typeof google.maps.LatLng;
                Animation: {
                    DROP: number;
                    BOUNCE: number;
                };
                MapTypeControlStyle: {
                    DEFAULT: number;
                    HORIZONTAL_BAR: number;
                    DROPDOWN_MENU: number;
                };
            };
        };
    }
}

export {};