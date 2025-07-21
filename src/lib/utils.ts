import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine plusieurs classes CSS conditionnelles avec `clsx`,
 * puis fusionne les conflits Tailwind avec `tailwind-merge`.
 *
 * @param inputs - Liste de classes conditionnelles ou dynamiques
 * @returns Chaîne de classes fusionnées sans doublons
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function withDisplayName<T extends React.ComponentType<any>>(
  Component: T,
  displayName: string
): T {
  Component.displayName = displayName
  return Component
}
