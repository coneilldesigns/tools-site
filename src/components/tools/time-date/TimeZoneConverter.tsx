'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { formatInTimeZone } from 'date-fns-tz';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [comparisonLocation, setComparisonLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set default location based on browser timezone
  const setDefaultLocation = () => {
    const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    setUserLocation({
      id: 'user',
      coordinates: [0, 0],
      timeZone: defaultTimeZone,
      label: 'Default Location',
      displayName: `Default Location (${defaultTimeZone})`
    });
  };

  // Initialize component
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    setDefaultLocation();
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
        console.log('Location search API response:', data);
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchError('Failed to fetch location suggestions. Please try again.');
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

      // Get timezone based on coordinates
      // For now, we'll use a simple mapping of coordinates to timezones
      // This is a simplified version - in production you'd want a more comprehensive solution
      const getTimezoneFromCoordinates = (lat: number, lon: number): string => {
        // North America
        if (lat > 24 && lat < 50 && lon > -125 && lon < -60) {
          if (lon < -100) return 'America/Chicago';
          if (lon < -85) return 'America/New_York';
          return 'America/Toronto';
        }
        // Europe
        if (lat > 35 && lat < 60 && lon > -10 && lon < 40) {
          return 'Europe/London';
        }
        // Asia
        if (lat > 20 && lat < 50 && lon > 70 && lon < 140) {
          return 'Asia/Tokyo';
        }
        // Default to UTC if we can't determine
        return 'UTC';
      };

      const timeZone = getTimezoneFromCoordinates(coordinates[0], coordinates[1]);
      console.log('Detected timezone:', timeZone);

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
  if (!isClient) {
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
                <p className="text-lg mt-2">
                  {formatInTimeZone(currentTime, userLocation.timeZone, 'h:mm:ss a')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, userLocation.timeZone, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, userLocation.timeZone, 'z')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, userLocation.timeZone, 'XXX')}
                </p>
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
                <p className="text-lg mt-2">
                  {formatInTimeZone(currentTime, comparisonLocation.timeZone, 'h:mm:ss a')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, comparisonLocation.timeZone, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, comparisonLocation.timeZone, 'z')}
                </p>
                <p className="text-sm text-gray-400">
                  {formatInTimeZone(currentTime, comparisonLocation.timeZone, 'XXX')}
                </p>
                {userLocation && (
                  <p className="text-sm text-gray-400 mt-1">
                    {Math.round(
                      (new Date(formatInTimeZone(currentTime, comparisonLocation.timeZone, 'yyyy-MM-dd HH:mm:ss')).getTime() - 
                       new Date(formatInTimeZone(currentTime, userLocation.timeZone, 'yyyy-MM-dd HH:mm:ss')).getTime()) / (1000 * 60 * 60)
                    )} hours from your time
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 