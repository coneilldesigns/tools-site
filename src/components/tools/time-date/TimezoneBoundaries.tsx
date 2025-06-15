'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

interface TimezoneData {
  type: string;
  properties: {
    tzid: string;
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface TimezoneBoundariesProps {
  timezoneData: TimezoneData[];
  selectedTimezone: string | null;
}

export function TimezoneBoundaries({ timezoneData, selectedTimezone }: TimezoneBoundariesProps) {
  const map = useMap();

  useEffect(() => {
    if (!timezoneData || !map) return;

    // Clear existing boundaries
    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    // Add new boundaries
    timezoneData.forEach((timezone) => {
      if (timezone.geometry.type === 'Polygon') {
        const coordinates: LatLngExpression[] = timezone.geometry.coordinates[0].map((coord) => [coord[1], coord[0]] as [number, number]);
        const polygon = L.polygon(coordinates, {
          color: timezone.properties.tzid === selectedTimezone ? '#10B981' : '#4B5563',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.1
        });

        polygon.addTo(map);
      }
    });
  }, [timezoneData, selectedTimezone, map]);

  return null;
} 