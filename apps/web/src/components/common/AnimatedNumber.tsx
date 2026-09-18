import React, { useEffect, useState, useRef } from 'react';

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * AnimatedNumber Component
 * Provides smooth requestAnimationFrame count-up / count-down interpolation for telemetry
 * and KPI cards, completely eliminating abrupt number snapping while preserving tabular layout.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  durationMs = 600,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const startValRef = useRef<number>(value);
  const targetValRef = useRef<number>(value);
  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if client prefers reduced motion
    const prefersReducedMotion = 
      typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || durationMs <= 0) {
      setDisplayValue(value);
      startValRef.current = value;
      targetValRef.current = value;
      return;
    }

    startValRef.current = displayValue;
    targetValRef.current = value;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);

      // Smooth cubic-out easing curve
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValRef.current + (targetValRef.current - startValRef.current) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValRef.current);
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, durationMs]);

  const formatted = decimals > 0
    ? displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
