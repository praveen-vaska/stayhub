"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@/types";

interface CompareContextType {
  compareProperties: Property[];
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  toggleCompare: (property: Property) => void;
  isInCompare: (propertyId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "stayhub_compare_properties";

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareProperties, setCompareProperties] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Load initial from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareProperties(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse compare storage", e);
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = (props: Property[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
    } catch (e) {
      console.error("Failed to save compare properties", e);
    }
  };

  const addToCompare = (property: Property): boolean => {
    if (compareProperties.some((p) => p.id === property.id)) {
      return false;
    }
    if (compareProperties.length >= 4) {
      alert("You can compare up to 4 accommodations at a time.");
      return false;
    }
    const updated = [...compareProperties, property];
    setCompareProperties(updated);
    saveToStorage(updated);
    return true;
  };

  const removeFromCompare = (propertyId: string) => {
    const updated = compareProperties.filter((p) => p.id !== propertyId);
    setCompareProperties(updated);
    saveToStorage(updated);
  };

  const toggleCompare = (property: Property) => {
    if (isInCompare(property.id)) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  };

  const isInCompare = (propertyId: string) => {
    return compareProperties.some((p) => p.id === propertyId);
  };

  const clearCompare = () => {
    setCompareProperties([]);
    saveToStorage([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProperties,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
