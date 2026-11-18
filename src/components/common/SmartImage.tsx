"use client";

import React, { useEffect, useRef, useState } from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper (controls size/rounding). */
  wrapperClassName?: string;
}

/**
 * <img> that shows a shimmering skeleton while loading, fades in when ready,
 * and degrades to a branded gradient if the remote image fails.
 */
export default function SmartImage({ wrapperClassName = "", className = "", alt = "", onLoad, onError, ...rest }: SmartImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Images served from cache (or finished before hydration) never fire onLoad for React,
  // so check the element's real state after mount.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setFailed(true);
  }, [rest.src]);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && !failed && <div className="absolute inset-0 skeleton" aria-hidden />}
      {failed ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C3C66] via-[#142D4E] to-[#159A91]/70" aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          {...rest}
          alt={alt}
          loading={rest.loading ?? "lazy"}
          decoding="async"
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setFailed(true);
            onError?.(e);
          }}
          className={`transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
      )}
    </div>
  );
}
