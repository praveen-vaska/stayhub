"use client";

import React, { useEffect, useRef, useState } from "react";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

export default function InteractiveMap({
  properties,
  selectedProperty,
  onSelectProperty,
  center = [17.4401, 78.3489],
  zoom = 12,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialCenter =
        properties.length > 0 && properties[0].coordinates
          ? [properties[0].coordinates.lat, properties[0].coordinates.lng]
          : center;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter as [number, number],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      if (isMounted) setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;

    async function renderMarkers() {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds: any[] = [];

      properties.forEach((prop) => {
        if (!prop.coordinates || !prop.coordinates.lat || !prop.coordinates.lng) return;

        const isSelected = selectedProperty?.id === prop.id;
        const color =
          prop.category === "PG"
            ? "#159A91"
            : prop.category === "Hotel"
            ? "#142D4E"
            : prop.category === "Hostel"
            ? "#E9A23B"
            : "#1C3C66";

        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="
              background: ${isSelected ? "#142D4E" : color};
              color: white;
              padding: 4px 8px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(20,45,78,0.25);
              border: 2px solid white;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
              transition: transform 0.2s;
              cursor: pointer;
            ">
              <span>${formatPrice(prop.price, prop.pricingType)}</span>
            </div>
          `,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], {
          icon: customIcon,
        }).addTo(map);

        const googleMapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${prop.coordinates.lat},${prop.coordinates.lng}`;

        const popupContent = document.createElement("div");
        popupContent.className = "p-1 max-w-[220px]";
        popupContent.innerHTML = `
          <div style="font-family: system-ui, sans-serif;">
            <img src="${prop.coverImage || prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <div style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase;">${prop.category} • ${prop.locality}</div>
            <h4 style="font-size: 13px; font-weight: 700; margin: 2px 0 4px; color: #142D4E; line-height: 1.2;">${prop.title}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
              <span style="font-size: 13px; font-weight: 800; color: #142D4E;">${formatPrice(prop.price, prop.pricingType)}</span>
              <a href="/property/${prop.slug}" style="font-size: 11px; font-weight: 700; color: #159A91; text-decoration: none;">View details &rarr;</a>
            </div>
            <div style="margin-top: 8px; border-top: 1px solid #E7EDF3; padding-top: 6px;">
              <a href="${googleMapsDirUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: #159A91; font-weight: 600; text-decoration: none;">
                🧭 Open in Google Maps
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          if (onSelectProperty) onSelectProperty(prop);
        });

        markersRef.current.push(marker);
        bounds.push([prop.coordinates.lat, prop.coordinates.lng]);
      });

      if (bounds.length > 0 && properties.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }

    renderMarkers();
  }, [properties, selectedProperty, mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProperty || !selectedProperty.coordinates) return;
    mapInstanceRef.current.flyTo(
      [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng],
      15,
      { duration: 1 }
    );
  }, [selectedProperty]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-[#E7EDF3] shadow-soft bg-[#F7F8FA]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px]" />

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-[500] bg-white p-3 rounded-xl shadow-soft border border-[#E7EDF3] text-xs space-y-1.5 hidden sm:block">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#667A91] block mb-1">
          Categories
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#159A91]" />
          <span className="font-semibold text-[#142D4E]">PG Accommodation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#142D4E]" />
          <span className="font-semibold text-[#142D4E]">Hotels & Suites</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E9A23B]" />
          <span className="font-semibold text-[#142D4E]">Hostels</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C3C66]" />
          <span className="font-semibold text-[#142D4E]">Apartments & Rooms</span>
        </div>
      </div>
    </div>
  );
}
