
import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-display-lg font-light tracking-tight", className)}>
      {children}
    </h1>
  );
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("text-display-sm font-normal tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("text-title-lg font-medium", className)}>
      {children}
    </h3>
  );
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("text-title-md font-medium", className)}>
      {children}
    </h4>
  );
}

export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body-md text-white/80", className)}>
      {children}
    </p>
  );
}

export function TypographyLead({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body-lg text-white/90 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function TypographyLarge({ children, className }: TypographyProps) {
  return (
    <div className={cn("text-lg font-semibold", className)}>
      {children}
    </div>
  );
}

export function TypographySmall({ children, className }: TypographyProps) {
  return (
    <small className={cn("text-body-sm text-white/70", className)}>
      {children}
    </small>
  );
}

export function TypographyMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-body-sm text-white/60", className)}>
      {children}
    </p>
  );
}

export function TypographyGradient({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-gradient-purple", className)}>
      {children}
    </span>
  );
}

export function TypographyDisplay({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("text-display-2xl font-light tracking-tighter", className)}>
      {children}
    </h1>
  );
}

export function TypographyMetric({ children, className }: TypographyProps) {
  return (
    <div className={cn("text-display-md font-medium text-gradient-blue", className)}>
      {children}
    </div>
  );
}
