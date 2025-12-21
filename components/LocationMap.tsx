'use client';

import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useMemo } from 'react';

interface Location {
    type: 'gps' | 'ip';
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    country?: string;
    city?: string;
    timestamp: string;
}

interface LocationMapProps {
    locations: Location[];
}

const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px'
};

const defaultCenter = {
    lat: 18.5944, // Haiti center
    lng: -72.3074
};

export default function LocationMap({ locations }: LocationMapProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    // Filter only GPS locations with coordinates
    const gpsLocations = useMemo(() => {
        return locations.filter(loc =>
            loc.type === 'gps' &&
            loc.latitude !== undefined &&
            loc.longitude !== undefined
        );
    }, [locations]);

    // Calculate center based on locations
    const center = useMemo(() => {
        if (gpsLocations.length === 0) return defaultCenter;

        const lastLocation = gpsLocations[0];
        return {
            lat: lastLocation.latitude!,
            lng: lastLocation.longitude!
        };
    }, [gpsLocations]);

    if (loadError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Erreur de chargement de la carte</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center" style={{ height: '500px' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de la carte...</p>
                </div>
            </div>
        );
    }

    if (gpsLocations.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">Aucune localisation GPS disponible pour afficher la carte</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            {gpsLocations.map((location, index) => (
                <Marker
                    key={index}
                    position={{
                        lat: location.latitude!,
                        lng: location.longitude!
                    }}
                    onClick={() => setSelectedLocation(location)}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#3B82F6',
                        fillOpacity: 0.8,
                        strokeColor: '#1E40AF',
                        strokeWeight: 2,
                    }}
                />
            ))}

            {selectedLocation && selectedLocation.latitude && selectedLocation.longitude && (
                <InfoWindow
                    position={{
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                >
                    <div className="p-2">
                        <h3 className="font-semibold text-sm mb-1">📍 Position GPS</h3>
                        {selectedLocation.city && selectedLocation.country && (
                            <p className="text-xs text-gray-600 mb-1">
                                {selectedLocation.city}, {selectedLocation.country}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            Lat: {selectedLocation.latitude.toFixed(6)}<br />
                            Lon: {selectedLocation.longitude.toFixed(6)}
                        </p>
                        {selectedLocation.accuracy && (
                            <p className="text-xs text-gray-500">
                                Précision: ±{selectedLocation.accuracy.toFixed(0)}m
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(selectedLocation.timestamp).toLocaleString('fr-FR')}
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
