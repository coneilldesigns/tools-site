'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { formatInTimeZone } from 'date-fns-tz';
import '@formatjs/intl-datetimeformat';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TimezoneBoundaries } from './TimezoneBoundaries';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: string;
  coordinates: [number, number];
  timeZone: string;
  label: string;
  displayName: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function TimeZoneConverter() {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [comparisonLocation, setComparisonLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper function to set default location
  const setDefaultLocation = useCallback(() => {
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setUserLocation({
      id: 'user',
      coordinates: [0, 0],
      timeZone: defaultTimeZone,
      label: 'Default Location',
      displayName: `Default Location (${defaultTimeZone})`
    });
  }, []); // Empty dependency array since we're only using setUserLocation which is stable

  // Move getUserLocation into useCallback
  const getUserLocation = useCallback(async () => {
    try {
      // First check if geolocation is supported
      if (!navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser. Please search for your location manually or ');
        setDefaultLocation();
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            // Handle specific geolocation errors
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setLocationError('Location access denied. You can enable location access in your browser settings or ');
                setDefaultLocation();
                reject(new Error('Location permission denied'));
                break;
              case error.POSITION_UNAVAILABLE:
                setLocationError('Location information unavailable. Please check your device settings or ');
                setDefaultLocation();
                reject(new Error('Location information unavailable'));
                break;
              case error.TIMEOUT:
                setLocationError('Location request timed out. Please check your internet connection or ');
                setDefaultLocation();
                reject(new Error('Location request timed out'));
                break;
              default:
                setLocationError('Unable to get your location. Please check your device settings or ');
                setDefaultLocation();
                reject(new Error('Unknown location error'));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;

      // Get location details from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const data = await response.json();
      const timeZone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

      setUserLocation({
        id: 'user',
        coordinates: [latitude, longitude],
        timeZone,
        label: data.display_name.split(',')[0],
        displayName: data.display_name
      });
      setLocationError(null);
    } catch (error) {
      console.error('Error getting location:', error);
      setDefaultLocation();
    }
  }, [setDefaultLocation]); // Include setDefaultLocation in dependencies

  useEffect(() => {
    if (isClient) {
      getUserLocation();
    }
  }, [isClient, getUserLocation]);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  // Update current time every second
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchError(null);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSuggestionClick = async (suggestion: Suggestion) => {
    setSearchError(null);
    setSuggestions([]);

    try {
      const coordinates: [number, number] = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];

      // Get timezone from coordinates
      const timezoneResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${suggestion.lat}&lon=${suggestion.lon}&zoom=10`
      );
      const timezoneData = await timezoneResponse.json();
      
      // Calculate timezone based on coordinates
      const lat = parseFloat(suggestion.lat);
      const lon = parseFloat(suggestion.lon);
      
      // Map coordinates to IANA timezone names
      let timeZone = timezoneData.timezone;
      
      if (!timeZone) {
        // Simple mapping of coordinates to timezone names
        if (lat >= 0) { // Northern Hemisphere
          if (lon >= -180 && lon < -120) timeZone = 'America/Anchorage';
          else if (lon >= -120 && lon < -60) timeZone = 'America/New_York';
          else if (lon >= -60 && lon < 0) timeZone = 'Europe/London';
          else if (lon >= 0 && lon < 60) timeZone = 'Europe/London';
          else if (lon >= 60 && lon < 120) timeZone = 'Asia/Shanghai';
          else timeZone = 'Asia/Tokyo';
        } else { // Southern Hemisphere
          if (lon >= -180 && lon < -120) timeZone = 'Pacific/Auckland';
          else if (lon >= -120 && lon < -60) timeZone = 'America/Santiago';
          else if (lon >= -60 && lon < 0) timeZone = 'America/Sao_Paulo';
          else if (lon >= 0 && lon < 60) timeZone = 'Africa/Johannesburg';
          else if (lon >= 60 && lon < 120) timeZone = 'Asia/Singapore';
          else timeZone = 'Australia/Sydney';
        }
      }

      const newLocation: Location = {
        id: userLocation ? 'comparison' : 'user',
        coordinates,
        timeZone,
        label: suggestion.display_name.split(',')[0],
        displayName: suggestion.display_name
      };

      if (!userLocation) {
        setUserLocation(newLocation);
      } else {
        setComparisonLocation(newLocation);
      }
    } catch (error) {
      console.error('Error setting location:', error);
      setSearchError('Failed to set location. Please try again.');
    } finally {
      setSearchQuery('');
    }
  };

  // Don't render anything until we're on the client
  if (!isClient || !currentTime) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-pulse bg-gray-800 rounded-lg p-4">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full m-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full"
      >
        <div className="relative w-full h-full bg-gray-900 overflow-hidden">
          {/* Location Error Message */}
          {locationError && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-md">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  {locationError}
                  <button
                    onClick={() => {
                      setLocationError(null);
                      getUserLocation();
                    }}
                    className="text-white underline hover:text-gray-200 ml-1"
                  >
                    try again
                  </button>
                  <div className="text-xs mt-1 text-gray-200">
                    You can also search for your location using the search box below.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <MapContainer
            center={[0, 0]}
            zoom={2}
            className="w-full h-full"
            style={{ background: '#1a1a1a' }}
            zoomControl={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            boxZoom={false}
            keyboard={false}
            attributionControl={false}
            minZoom={2}
            maxZoom={2}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            {/* Timezone Boundaries */}
            <TimezoneBoundaries 
              timezoneData={[]} 
              selectedTimezone={userLocation?.timeZone || null} 
            />
            
            {/* User Location Marker */}
            {userLocation && (
              <>
                <Marker
                  position={userLocation.coordinates}
                  icon={L.icon({
                    ...DefaultIcon.options,
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
                  })}
                >
                  <Popup className="dark-popup">
                    <div className="p-2 bg-gray-800 text-white">
                      <h3 className="font-bold">My Location</h3>
                      <p>{userLocation.label}</p>
                    </div>
                  </Popup>
                </Marker>
                <MapUpdater center={userLocation.coordinates} />
              </>
            )}

            {/* Comparison Location Marker */}
            {comparisonLocation && (
              <Marker
                position={comparisonLocation.coordinates}
                icon={L.icon({
                  ...DefaultIcon.options,
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                })}
              >
                <Popup className="dark-popup">
                  <div className="p-2 bg-gray-800 text-white">
                    <h3 className="font-bold">{comparisonLocation.label}</h3>
                    <p>{formatInTimeZone(currentTime, comparisonLocation.timeZone, 'h:mm:ss a')}</p>
                    <p>UTC{formatInTimeZone(currentTime, comparisonLocation.timeZone, 'xxx')}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Search Box */}
          <div className="absolute bottom-4 left-4 z-[1000] w-80">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search location..."
                className="w-full px-4 py-2 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"></div>
                </div>
              )}
            </div>
            {suggestions.length > 0 && (
              <div className="absolute bottom-full mb-2 w-full bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  >
                    {suggestion.display_name}
                  </button>
                ))}
              </div>
            )}
            {searchError && (
              <div className="absolute bottom-full mb-2 w-full px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg">
                {searchError}
              </div>
            )}
          </div>

          {/* Location Info Boxes */}
          <div className="absolute top-4 right-4 space-y-2 z-[1001]">
            {userLocation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setUserLocation(null);
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-gray-400 hover:text-white"
                    title="Clear location"
                  >
                    ×
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-gray-400 hover:text-white"
                    title="Edit location"
                  >
                    ✎
                  </button>
                </div>
                <h3 className="font-bold mb-2">My Location</h3>
                <p className="text-sm text-gray-400">{userLocation.displayName}</p>
                <p className="text-sm text-gray-400">Lat: {userLocation.coordinates[0].toFixed(4)}, Long: {userLocation.coordinates[1].toFixed(4)}</p>
                {(() => {
                  const now = new Date();
                  return (
                    <>
                      <p className="text-lg mt-2">
                        {formatInTimeZone(now, userLocation.timeZone, 'h:mm:ss a')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, userLocation.timeZone, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, userLocation.timeZone, 'z')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, userLocation.timeZone, 'XXX')}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {comparisonLocation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setComparisonLocation(null)}
                    className="text-gray-400 hover:text-white"
                    title="Clear location"
                  >
                    ×
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="text-gray-400 hover:text-white"
                    title="Edit location"
                  >
                    ✎
                  </button>
                </div>
                <h3 className="font-bold mb-2">{comparisonLocation.label}</h3>
                <p className="text-sm text-gray-400">{comparisonLocation.displayName}</p>
                <p className="text-sm text-gray-400">Lat: {comparisonLocation.coordinates[0].toFixed(4)}, Long: {comparisonLocation.coordinates[1].toFixed(4)}</p>
                {(() => {
                  const now = new Date();
                  console.log('comparisonLocation', comparisonLocation)
                  console.log('Comparison Location Time Debug:', {
                    timeZone: comparisonLocation.timeZone,
                    localTime: now.toISOString(),
                    localTimeString: now.toString(),
                    localTimeLocale: now.toLocaleString(),
                    formattedTime: formatInTimeZone(now, comparisonLocation.timeZone, 'h:mm:ss a'),
                    formattedTimeWithOffset: formatInTimeZone(now, comparisonLocation.timeZone, 'yyyy-MM-dd HH:mm:ss XXX'),
                    formattedTimeWithZone: formatInTimeZone(now, comparisonLocation.timeZone, 'yyyy-MM-dd HH:mm:ss zzz')
                  });
                  return (
                    <>
                      <p className="text-lg mt-2">
                        {formatInTimeZone(now, comparisonLocation.timeZone, 'h:mm:ss a')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, comparisonLocation.timeZone, 'EEEE, MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, comparisonLocation.timeZone, 'z')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatInTimeZone(now, comparisonLocation.timeZone, 'XXX')}
                      </p>
                      {userLocation && (
                        <p className="text-sm text-gray-400 mt-1">
                          {Math.round(
                            (new Date(formatInTimeZone(now, comparisonLocation.timeZone, 'yyyy-MM-dd HH:mm:ss')).getTime() - 
                             new Date(formatInTimeZone(now, userLocation.timeZone, 'yyyy-MM-dd HH:mm:ss')).getTime()) / (1000 * 60 * 60)
                          )} hours from your time
                        </p>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 