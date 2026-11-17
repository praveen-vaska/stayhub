"use client";

import React from "react";
import { CompareProvider, useCompare } from "@/lib/compare/context";
import CompareFloatingBar from "@/components/compare/CompareFloatingBar";
import CompareModal from "@/components/compare/CompareModal";

function GlobalCompareOverlays() {
  const { isCompareModalOpen, setIsCompareModalOpen } = useCompare();

  return (
    <>
      <CompareFloatingBar onOpenCompare={() => setIsCompareModalOpen(true)} />
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </>
  );
}

export default function CompareGlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <GlobalCompareOverlays />
    </CompareProvider>
  );
}
