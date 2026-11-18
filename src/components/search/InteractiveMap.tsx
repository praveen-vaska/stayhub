"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { getAccommodationFallback } from "@/lib/utils/fallbackImages";
import { MapPin, Navigation } from "lucide-react";

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  "AIzaSyDKz_0zAacZlP2RgekuyPEz_dZ6ImtwIc4";

// Clean, modern silver map styling matching StayHub UI
const GOOGLE_MAPS_STYLE: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#fcdcb8" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cde3eb" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#f3f5f8" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e8f1ea" }] },
];

/**
 * Loads the Google Maps JS API script safely into the page
 */
function loadGoogleMapsScript(apiKey: string): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);

  const existingScript = document.getElementById("google-maps-api-script") as HTMLScriptElement | null;
  if (existingScript) {
    return new Promise((resolve, reject) => {
      if ((window as any).google?.maps) {
        resolve((window as any).google);
      } else {
        existingScript.addEventListener("load", () => resolve((window as any).google));
        existingScript.addEventListener("error", reject);
      }
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "google-maps-api-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as any).google);
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
}

export default function InteractiveMap({
  properties,
  selectedProperty,
  onSelectProperty,
  center = [17.4401, 78.3489],
  zoom = 13,
}: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapEngine, setMapEngine] = useState<"google" | "leaflet" | "loading">("loading");
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleOverlaysRef = useRef<any[]>([]);
  const googleInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Fallback Leaflet refs
  const leafletMapRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);

  // Category Color mapping
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "PG":
        return "#159A91";
      case "Hotel":
        return "#142D4E";
      case "Hostel":
        return "#E9A23B";
      default:
        return "#1C3C66";
    }
  };

  // ─── 1. Initialize Google Maps ───────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    async function init() {
      if (!containerRef.current) return;

      try {
        const googleObj = await loadGoogleMapsScript(GOOGLE_MAPS_KEY);
        if (!active || !containerRef.current) return;

        const initialLat =
          properties.length > 0 && properties[0].coordinates?.lat
            ? properties[0].coordinates.lat
            : center[0];
        const initialLng =
          properties.length > 0 && properties[0].coordinates?.lng
            ? properties[0].coordinates.lng
            : center[1];

        const map = new googleObj.maps.Map(containerRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: zoom,
          styles: GOOGLE_MAPS_STYLE,
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: false,
        });

        googleMapRef.current = map;
        googleInfoWindowRef.current = new googleObj.maps.InfoWindow();

        // Close infoWindow when clicking on map
        map.addListener("click", () => {
          googleInfoWindowRef.current?.close();
        });

        setMapEngine("google");
      } catch (err) {
        console.warn("Google Maps failed to load, falling back to OpenStreetMap Leaflet:", err);
        if (!active || !containerRef.current) return;

        // Fallback: Leaflet with clean OpenStreetMap tiles (NO Carto watermark!)
        const L = (await import("leaflet")).default;
        if (!active || !containerRef.current) return;

        const map = L.map(containerRef.current, {
          center: center as [number, number],
          zoom: zoom,
          zoomControl: true,
        });

        // OpenStreetMap standard tiles (completely free & open, no API key watermark)
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        leafletMapRef.current = map;
        setMapEngine("leaflet");
      }
    }

    init();

    return () => {
      active = false;
      googleOverlaysRef.current.forEach((o) => o.setMap?.(null));
      googleOverlaysRef.current = [];
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // ─── 2. Render Google Maps Custom Price Markers ─────────────────────────────
  useEffect(() => {
    if (mapEngine !== "google" || !googleMapRef.current || !(window as any).google?.maps) return;

    const g = (window as any).google.maps;
    const map = googleMapRef.current;
    const infoWindow = googleInfoWindowRef.current;

    // Clear previous overlays
    googleOverlaysRef.current.forEach((o) => o.setMap(null));
    googleOverlaysRef.current = [];

    const bounds = new g.LatLngBounds();
    let validCoordsCount = 0;

    // Define custom HTML price pill overlay
    class PricePillOverlay extends g.OverlayView {
      pos: google.maps.LatLng;
      div: HTMLDivElement | null = null;
      prop: Property;

      constructor(prop: Property) {
        super();
        this.prop = prop;
        this.pos = new g.LatLng(prop.coordinates.lat, prop.coordinates.lng);
      }

      onAdd() {
        const div = document.createElement("div");
        div.className = "stayhub-price-marker";
        div.style.position = "absolute";
        div.style.cursor = "pointer";
        div.style.zIndex = "10";
        div.style.transition = "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0.1s";

        const isSelected = selectedProperty?.id === this.prop.id;
        const color = getCategoryColor(this.prop.category);

        div.innerHTML = `
          <div style="
            background: ${isSelected ? "#142D4E" : color};
            color: #FFFFFF;
            padding: 4px 9px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            font-family: system-ui, -apple-system, sans-serif;
            letter-spacing: -0.01em;
            box-shadow: 0 4px 12px rgba(20, 45, 78, 0.3);
            border: 2px solid #FFFFFF;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
            transition: all 0.2s ease;
          ">
            <span>${formatPrice(this.prop.price, this.prop.pricingType)}</span>
          </div>
        `;

        div.addEventListener("mouseenter", () => {
          div.style.zIndex = "999";
          (div.firstElementChild as HTMLElement).style.transform = "scale(1.14)";
        });

        div.addEventListener("mouseleave", () => {
          div.style.zIndex = isSelected ? "50" : "10";
          (div.firstElementChild as HTMLElement).style.transform = isSelected ? "scale(1.15)" : "scale(1)";
        });

        div.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onSelectProperty) onSelectProperty(this.prop);

          const fallbackImg = getAccommodationFallback(this.prop.category, this.prop.id);
          const coverImg = this.prop.coverImage || (this.prop.images && this.prop.images[0]) || fallbackImg;
          const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${this.prop.coordinates.lat},${this.prop.coordinates.lng}`;

          const popupHtml = `
            <div style="font-family: system-ui, -apple-system, sans-serif; width: 220px; padding: 2px;">
              <div style="position: relative; width: 100%; height: 110px; border-radius: 10px; overflow: hidden; background: #EEF2F6; margin-bottom: 8px;">
                <img src="${coverImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" alt="${this.prop.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                <span style="position: absolute; top: 6px; left: 6px; background: rgba(20,45,78,0.85); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">
                  ${this.prop.category}
                </span>
              </div>
              <div style="font-size: 11px; font-weight: 700; color: ${color}; text-transform: uppercase;">${this.prop.locality}</div>
              <h4 style="font-size: 13px; font-weight: 700; color: #142D4E; margin: 3px 0 6px; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${this.prop.title}
              </h4>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding-top: 6px; border-top: 1px solid #E7EDF3;">
                <span style="font-size: 13px; font-weight: 800; color: #142D4E;">${formatPrice(this.prop.price, this.prop.pricingType)}</span>
                <a href="/property/${this.prop.slug}" style="font-size: 11px; font-weight: 700; color: #159A91; text-decoration: none;">
                  View &rarr;
                </a>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #E7EDF3;">
                <a href="${dirUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #159A91; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                  🧭 Open in Google Maps
                </a>
              </div>
            </div>
          `;

          infoWindow?.setContent(popupHtml);
          infoWindow?.setPosition(this.pos);
          infoWindow?.open(map);
        });

        this.div = div;
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(div);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection || !this.div) return;
        const point = projection.fromLatLngToDivPixel(this.pos);
        if (point) {
          this.div.style.left = `${point.x}px`;
          this.div.style.top = `${point.y}px`;
          this.div.style.transform = "translate(-50%, -50%)";
        }
      }

      onRemove() {
        if (this.div?.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    properties.forEach((prop) => {
      if (!prop.coordinates?.lat || !prop.coordinates?.lng) return;
      const overlay = new PricePillOverlay(prop);
      overlay.setMap(map);
      googleOverlaysRef.current.push(overlay);

      bounds.extend(new g.LatLng(prop.coordinates.lat, prop.coordinates.lng));
      validCoordsCount++;
    });

    if (validCoordsCount > 1) {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
    } else if (validCoordsCount === 1) {
      const p = properties[0];
      map.setCenter({ lat: p.coordinates.lat, lng: p.coordinates.lng });
      map.setZoom(15);
    }
  }, [properties, selectedProperty, mapEngine, onSelectProperty]);

  // Pan to selectedProperty in Google Maps
  useEffect(() => {
    if (mapEngine !== "google" || !googleMapRef.current || !selectedProperty?.coordinates) return;
    googleMapRef.current.panTo({
      lat: selectedProperty.coordinates.lat,
      lng: selectedProperty.coordinates.lng,
    });
    googleMapRef.current.setZoom(15);
  }, [selectedProperty, mapEngine]);

  // ─── 3. Fallback Leaflet Markers (OpenStreetMap - NO watermark) ─────────────
  useEffect(() => {
    if (mapEngine !== "leaflet" || !leafletMapRef.current) return;

    async function renderLeaflet() {
      const L = (await import("leaflet")).default;
      const map = leafletMapRef.current;

      leafletMarkersRef.current.forEach((m) => m.remove());
      leafletMarkersRef.current = [];

      const bounds: any[] = [];

      properties.forEach((prop) => {
        if (!prop.coordinates?.lat || !prop.coordinates?.lng) return;

        const isSelected = selectedProperty?.id === prop.id;
        const color = getCategoryColor(prop.category);

        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="
              background: ${isSelected ? "#142D4E" : color};
              color: white;
              padding: 4px 8px;
              border-radius: 9999px;
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

        const fallbackImg = getAccommodationFallback(prop.category, prop.id);
        const coverImg = prop.coverImage || (prop.images && prop.images[0]) || fallbackImg;

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; width: 210px; padding: 2px;">
            <img src="${coverImg}" onerror="this.onerror=null;this.src='${fallbackImg}';" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <div style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase;">${prop.category} • ${prop.locality}</div>
            <h4 style="font-size: 13px; font-weight: 700; margin: 2px 0 4px; color: #142D4E; line-height: 1.2;">${prop.title}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
              <span style="font-size: 13px; font-weight: 800; color: #142D4E;">${formatPrice(prop.price, prop.pricingType)}</span>
              <a href="/property/${prop.slug}" style="font-size: 11px; font-weight: 700; color: #159A91; text-decoration: none;">View details &rarr;</a>
            </div>
          </div>
        `);

        marker.on("click", () => {
          if (onSelectProperty) onSelectProperty(prop);
        });

        leafletMarkersRef.current.push(marker);
        bounds.push([prop.coordinates.lat, prop.coordinates.lng]);
      });

      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    renderLeaflet();
  }, [properties, selectedProperty, mapEngine, onSelectProperty]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-2xl overflow-hidden border border-[#E7EDF3] shadow-soft bg-[#F7F8FA]">
      {/* Map DOM Canvas */}
      <div ref={containerRef} className="w-full h-full min-h-[450px]" />

      {/* Loading state indicator */}
      {mapEngine === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F7F8FA]/90 backdrop-blur-sm z-[20]">
          <div className="w-8 h-8 rounded-full border-2 border-[#159A91] border-t-transparent animate-spin mb-2" />
          <span className="text-xs font-bold text-[#142D4E]">Loading Google Maps...</span>
        </div>
      )}

      {/* Google Maps Powered Badge */}
      {mapEngine === "google" && (
        <div className="absolute bottom-6 left-3 z-[10] flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#E7EDF3] shadow-xs text-[10px] font-bold text-[#142D4E]">
          <Navigation className="w-3 h-3 text-[#159A91]" />
          <span>Google Maps Live</span>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-[10] bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-soft border border-[#E7EDF3] text-xs space-y-1.5 hidden sm:block">
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
