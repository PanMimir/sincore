import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Łączy klasy CSS i rozwiązuje konflikty Tailwinda.
 * Np. cn("p-4", "p-2") → "p-2" (twMerge usuwa duplikaty)
 * Używaj tego zamiast zwykłego string concatenation przy klasach.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
