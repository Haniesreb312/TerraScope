
import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types';

// Declare global Leaflet variable
declare global {
  interface Window {
    L: any;
  }
}

interface MapComponentProps {
  coordinates: Coordinates;
  capitalCoordinates: Coordinates;
  countryName: string;
  capitalName: string;
  isDark: boolean;
  labels: any;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  coordinates, 
  capitalCoordinates,
  countryName,
  capitalName,
  isDark,
  labels
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    // Cleanup previous instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map
    const map = window.L.map(mapContainerRef.current, {
      center: [coordinates.latitude, coordinates.longitude],
      zoom: 4,
      zoomControl: false,
      attributionControl: false
    });
    
    mapInstanceRef.current = map;

    // Select Tile Layer based on Theme
    const tileUrl = isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      
    const attribution = isDark 
       ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
       : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

    window.L.tileLayer(tileUrl, {
      attribution: attribution,
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Custom Marker Icon
    const customIcon = window.L.divIcon({
      className: 'custom-pin-icon',
      html: `<div class="custom-pin-marker"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add Capital Marker
    const marker = window.L.marker(
      [capitalCoordinates.latitude, capitalCoordinates.longitude],
      { icon: customIcon }
    ).addTo(map);

    // Add Popup
    marker.bindPopup(`
      <div class="font-sans">
        <h3 class="font-bold text-cyan-600 dark:text-cyan-400">${capitalName}</h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 m-0">${labels.capitalOf} ${countryName}</p>
      </div>
    `).openPopup();

    // Add Attribution Control
    window.L.control.attribution({
      position: 'bottomright',
      prefix: false
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, capitalCoordinates, countryName, capitalName, isDark, labels]);

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden relative z-0 border border-slate-200 dark:border-slate-700/50 shadow-inner bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Overlay info */}
      <div className="absolute top-4 right-4 z-[400] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg shadow-lg pointer-events-none transition-colors duration-300">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
          <span>{capitalName}</span>
        </div>
      </div>
    </div>
  );
};
