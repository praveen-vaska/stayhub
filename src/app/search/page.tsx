"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/types";
import TopFilterBar from "@/components/search/TopFilterBar";
import SearchFilters, { FilterState } from "@/components/search/SearchFilters";
import PropertyCard from "@/components/search/PropertyCard";
import InteractiveMap from "@/components/search/InteractiveMap";
import EnquiryModal from "@/components/property/EnquiryModal";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  // Free-text query (property name / area). A name search with no city covers all cities.
  const [query, setQuery] = useState(initialQuery);

  const [filters, setFilters] = useState<FilterState>({
    city: searchParams.get("city") || (initialQuery ? "All" : "Hyderabad"),
    locality: searchParams.get("locality") || "All",
    category: searchParams.get("category") || "All",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 100000,
    genderPreference: searchParams.get("genderPreference") || "Any",
    furnishingStatus: searchParams.get("furnishingStatus") || "All",
    sharingType: searchParams.get("sharingType") || "All",
    rating: Number(searchParams.get("rating")) || 0,
    availableNow: searchParams.get("availableNow") === "true",
    amenities: searchParams.getAll("amenity") || [],
    sort: searchParams.get("sort") || "recommended",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "map" | "split">("split");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== "All") params.set("city", filters.city);
        if (filters.locality && filters.locality !== "All") params.set("locality", filters.locality);
        if (filters.category && filters.category !== "All") params.set("category", filters.category);
        if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice < 100000) params.set("maxPrice", filters.maxPrice.toString());
        if (filters.genderPreference && filters.genderPreference !== "Any") {
          params.set("genderPreference", filters.genderPreference);
        }
        if (filters.furnishingStatus && filters.furnishingStatus !== "All") {
          params.set("furnishingStatus", filters.furnishingStatus);
        }
        if (filters.sharingType && filters.sharingType !== "All") {
          params.set("sharingType", filters.sharingType);
        }
        if (filters.rating > 0) params.set("rating", filters.rating.toString());
        if (filters.availableNow) params.set("availableNow", "true");
        if (filters.sort) params.set("sort", filters.sort);
        filters.amenities.forEach((a) => params.append("amenity", a));
        if (query) params.set("q", query);
        params.set("page", page.toString());
        params.set("limit", "12");

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        setProperties(data.properties || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [filters, page, query]);

  // Keep the URL shareable: reflect the text query without a navigation.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [query]);

  const handleQueryChange = useCallback((q: string) => {
    setQuery(q);
    setPage(1);
  }, []);

  const cityLabel = filters.city === "All" ? "all cities" : filters.city;

  const handleResetFilters = () => {
    setQuery("");
    setFilters({
      city: "Hyderabad",
      locality: "All",
      category: "All",
      minPrice: 0,
      maxPrice: 100000,
      genderPreference: "Any",
      furnishingStatus: "All",
      sharingType: "All",
      rating: 0,
      availableNow: false,
      amenities: [],
      sort: "recommended",
    });
    setPage(1);
  };

  const handleContact = (property: Property) => {
    setSelectedProperty(property);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* Search Header Banner */}
      <div className="bg-white border-b border-[#E7EDF3] py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#159A91] uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {filters.city === "All" ? "All cities" : filters.city}{" "}
                  {filters.city !== "All" && filters.locality !== "All" && `› ${filters.locality}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142D4E] tracking-tight">
                {query ? (
                  <>
                    Results for <span className="text-[#159A91]">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  <>
                    Accommodation in{" "}
                    {filters.city !== "All" && filters.locality !== "All" ? `${filters.locality}, ` : ""}
                    {filters.city === "All" ? "India" : filters.city}
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-[#667A91] mt-1">
                Explore verified PGs, hotels, lodges and rooms in {cityLabel} • {total} stays found
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto bg-[#F7F8FA] border border-[#E7EDF3] p-1.5 rounded-xl text-xs font-semibold text-[#142D4E]">
              <span className="px-2 text-[#667A91]">Category:</span>
              <span className="px-3 py-1 rounded-lg bg-white text-[#142D4E] font-bold shadow-soft border border-[#E7EDF3]">
                {filters.category === "All" ? "All Categories" : filters.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Filter Bar */}
        <TopFilterBar
          category={filters.category}
          onCategoryChange={(cat) => {
            setFilters({ ...filters, category: cat });
            setPage(1);
          }}
          sort={filters.sort}
          onSortChange={(sort) => setFilters({ ...filters, sort })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenMobileFilters={() => setMobileFilterOpen(true)}
          query={query}
          onQueryChange={handleQueryChange}
        />

        {/* Dynamic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <SearchFilters
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              onReset={handleResetFilters}
              totalResults={total}
            />
          </div>

          {/* Center Listings / Right Map */}
          <div
            className={`w-full ${
              viewMode === "split"
                ? "lg:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-6"
                : "lg:col-span-9"
            }`}
          >
            {/* Split Mode */}
            {viewMode === "split" && (
              <>
                <div className="xl:col-span-8 space-y-6">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-80 rounded-2xl bg-white border border-[#E7EDF3] animate-pulse" />
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDF3]">
                      <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-[#142D4E]">No properties found</h3>
                      <p className="text-xs text-[#667A91] max-w-sm mx-auto mt-1">
                        Try adjusting your price range, selected locality, or gender filter to view available stays.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#142D4E] text-white text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {properties.map((prop) => (
                          <PropertyCard
                            key={prop.id}
                            property={prop}
                            onContactClick={handleContact}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                          <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-2 rounded-xl bg-white border border-[#E7EDF3] text-[#142D4E] disabled:opacity-30 hover:bg-[#F7F8FA]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-[#142D4E] px-3">
                            Page {page} of {totalPages}
                          </span>
                          <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-xl bg-white border border-[#E7EDF3] text-[#142D4E] disabled:opacity-30 hover:bg-[#F7F8FA]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Sticky Interactive Map Column */}
                <div className="hidden xl:block xl:col-span-4 sticky top-24 h-[650px]">
                  <InteractiveMap
                    properties={properties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                  />
                </div>
              </>
            )}

            {/* List Only Mode */}
            {viewMode === "list" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="h-80 rounded-2xl bg-white border border-[#E7EDF3] animate-pulse" />
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-[#E7EDF3]">
                    <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#142D4E]">No properties found</h3>
                    <p className="text-xs text-[#667A91] max-w-sm mx-auto mt-1">
                      Try widening your filter options to find accommodation in nearby localities.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#142D4E] text-white text-xs font-bold"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {properties.map((prop) => (
                        <PropertyCard
                          key={prop.id}
                          property={prop}
                          onContactClick={handleContact}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="p-2 rounded-xl bg-white border border-[#E7EDF3] text-[#142D4E] disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-[#142D4E] px-3">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className="p-2 rounded-xl bg-white border border-[#E7EDF3] text-[#142D4E] disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Map Only Mode */}
            {viewMode === "map" && (
              <div className="h-[700px] w-full">
                <InteractiveMap
                  properties={properties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-[#142D4E]/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E7EDF3] mb-4">
                <h3 className="text-base font-bold text-[#142D4E]">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-[#F7F8FA] text-[#142D4E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <SearchFilters
                filters={filters}
                onChange={(f) => setFilters(f)}
                onReset={handleResetFilters}
                totalResults={total}
              />
            </div>

            <div className="pt-4 border-t border-[#E7EDF3] mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#142D4E] text-white text-sm font-bold shadow-sm"
              >
                Apply Filters ({total} stays)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact / Enquiry Modal */}
      <EnquiryModal
        property={selectedProperty}
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          setSelectedProperty(null);
        }}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#667A91]">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
