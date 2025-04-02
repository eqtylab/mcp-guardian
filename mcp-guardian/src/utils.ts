import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a deterministic string representation of an object
 */
export function deterministicStringify(obj: any) {
  return JSON.stringify(
    obj,
    (_, value) =>
      value instanceof Object && !Array.isArray(value)
        ? Object.keys(value)
            .sort()
            .reduce((sorted: any, k) => {
              sorted[k] = value[k];
              return sorted;
            }, {})
        : value,
    2,
  );
}
