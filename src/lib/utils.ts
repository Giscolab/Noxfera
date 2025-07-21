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

/**
 * Attache un displayName personnalisé à un composant React
 * 
 * @param Component - Le composant à modifier
 * @param displayName - Le nom à attribuer
 * @returns Le composant original avec son displayName mis à jour
 */
export function withDisplayName<P = Record<string, unknown>, T extends React.ComponentType<P>>(
  Component: T,
  displayName: string
): T {
  Component.displayName = displayName;
  return Component;
}