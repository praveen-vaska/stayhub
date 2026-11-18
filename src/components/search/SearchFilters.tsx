"use client";

import React from "react";
import {
  Filter,
  RotateCcw,
  Wifi,
  Utensils,
  Wind,
  Car,
  Home,
  Layers,
  Check,
  MapPin,
  Globe2,
} from "lucide-react";
import { SEED_CITIES } from "@/lib/db/seedData";
import FancySelect from "@/components/common/FancySelect";

export interface FilterState {
  city: string;
  locality: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  genderPreference: string;
  furnishingStatus: string;
  sharingType: string;
  rating: number;
  availableNow: boolean;
  amenities: string[];
  sort: string;
}

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export default function SearchFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: SearchFiltersProps) {
  const currentCityData = SEED_CITIES.find((c) => c.name.toLowerCase() === filters.city.toLowerCase()) || SEED_CITIES[0];

  const handleCityChange = (newCity: string) => {
    onChange({
      ...filters,
      city: newCity,
      locality: "All",
    });
  };

  const handleLocalityChange = (loc: string) => {
    onChange({
      ...filters,
      locality: loc,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: updated });
  };

  const amenityOptions = [
    { label: "Wi-Fi", icon: Wifi },
    { label: "Food", icon: Utensils },
    { label: "AC", icon: Wind },
    { label: "Parking", icon: Car },
    { label: "Attached Bathroom", icon: Home },
    { label: "Power Backup", icon: Layers },
    { label: "Housekeeping", icon: Home },
    { label: "Laundry", icon: Home },
    { label: "CCTV", icon: Home },
  ];

  return (
    <aside className="w-full bg-white rounded-2xl p-5 border border-[#E7EDF3] shadow-soft space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7EDF3]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8F5F4] text-[#159A91] flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#142D4E]">Filters</h3>
            <span className="text-xs text-[#667A91] font-medium">{totalResults} stays available</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-bold text-[#667A91] hover:text-rose-600 transition-colors p-1"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* City & Locality Hierarchy */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#667A91] block">
          City & Locality
        </label>

        {/* City Select */}
        <FancySelect
          value={filters.city}
          onChange={handleCityChange}
          ariaLabel="City"
          options={[
            { value: "All", label: "All cities", hint: "Search across India", icon: Globe2 },
            ...SEED_CITIES.map((c) => ({ value: c.name, label: c.name, hint: c.state, icon: MapPin })),
          ]}
          leadingIcon={<MapPin className="w-4 h-4 text-[#159A91] shrink-0" />}
          buttonClassName="h-11 px-3 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] hover:border-[#C9D5E1] transition-all"
          labelClassName="text-sm font-semibold text-[#142D4E]"
          menuWidth="w-full"
        />

        {/* Localities List */}
        {filters.city !== "All" && (
        <div>
          <span className="text-[11px] font-bold text-[#667A91] block mb-2">
            Localities in {currentCityData.name}:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => handleLocalityChange("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filters.locality === "All" || !filters.locality
                  ? "bg-[#142D4E] text-white font-bold"
                  : "bg-[#F7F8FA] text-[#667A91] hover:bg-[#E7EDF3] border border-[#E7EDF3]"
              }`}
            >
              All {currentCityData.name}
            </button>
            {currentCityData.localities.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocalityChange(loc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filters.locality.toLowerCase() === loc.toLowerCase()
                    ? "bg-[#159A91] text-white font-bold"
                    : "bg-[#F7F8FA] text-[#667A91] hover:bg-[#E7EDF3] border border-[#E7EDF3]"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-[#E7EDF3] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#667A91]">
            Price Range
          </label>
          <span className="text-xs font-bold text-[#159A91]">
            ₹{filters.minPrice.toLocaleString("en-IN")} - ₹{filters.maxPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[#667A91] block font-semibold mb-1">Min Price (₹)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-xs font-bold text-[#142D4E] focus:outline-none focus:border-[#159A91]"
              step="500"
              min="0"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#667A91] block font-semibold mb-1">Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) || 100000 })}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F8FA] border border-[#E7EDF3] text-xs font-bold text-[#142D4E] focus:outline-none focus:border-[#159A91]"
              step="1000"
              min="1000"
            />
          </div>
        </div>
      </div>

      {/* Gender Preference */}
      <div className="pt-4 border-t border-[#E7EDF3] space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#667A91] block">
          Gender / Resident Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "Any", label: "Anyone / All" },
            { id: "Boys", label: "Men Only" },
            { id: "Girls", label: "Women Only" },
            { id: "Family", label: "Family" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChange({ ...filters, genderPreference: item.id })}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                filters.genderPreference === item.id
                  ? "bg-[#142D4E] text-white font-bold"
                  : "bg-[#F7F8FA] text-[#667A91] hover:bg-[#E7EDF3] border border-[#E7EDF3]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sharing / Room Type */}
      <div className="pt-4 border-t border-[#E7EDF3] space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#667A91] block">
          Sharing / Room Type
        </label>
        <div className="flex flex-wrap gap-2">
          {["All", "Single", "Double", "Triple", "Four+", "Private Suite"].map((type) => (
            <button
              key={type}
              onClick={() => onChange({ ...filters, sharingType: type })}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                filters.sharingType === type
                  ? "bg-[#142D4E] text-white font-bold"
                  : "bg-[#F7F8FA] text-[#667A91] hover:bg-[#E7EDF3] border border-[#E7EDF3]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities & Amenities */}
      <div className="pt-4 border-t border-[#E7EDF3] space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#667A91] block">
          Facilities & Amenities
        </label>
        <div className="space-y-2">
          {amenityOptions.map((am) => {
            const Icon = am.icon;
            const isChecked = filters.amenities.includes(am.label);
            return (
              <label
                key={am.label}
                onClick={() => handleAmenityToggle(am.label)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7F8FA] cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2.5 text-xs font-medium text-[#142D4E]">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{am.label}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                    isChecked
                      ? "bg-[#159A91] border-[#159A91] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Instant Occupancy Toggle */}
      <div className="pt-4 border-t border-[#E7EDF3]">
        <label
          onClick={() => onChange({ ...filters, availableNow: !filters.availableNow })}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#E8F5F4] border border-[#159A91]/20 cursor-pointer select-none hover:bg-[#E8F5F4]/80"
        >
          <div>
            <span className="text-xs font-bold text-[#142D4E] block">Available Right Now</span>
            <span className="text-[10px] text-[#159A91] font-semibold">Immediate move-in beds</span>
          </div>
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
              filters.availableNow ? "bg-[#159A91]" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                filters.availableNow ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </aside>
  );
}
