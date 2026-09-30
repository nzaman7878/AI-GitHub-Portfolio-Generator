type ClassValue =
  | string
  | number
  | boolean
  | bigint
  | undefined
  | null
  | Record<string, boolean | null | undefined>;

/**
 * Merges class names conditionally into a single class string.
 */
export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  const classes: string[] = [];

  const process = (item: ClassValue | ClassValue[]) => {
    if (!item) return;

    if (Array.isArray(item)) {
      item.forEach(process);
    } else if (typeof item === "string" || typeof item === "number" || typeof item === "bigint") {
      classes.push(String(item));
    } else if (typeof item === "object") {
      for (const [key, value] of Object.entries(item)) {
        if (value) classes.push(key);
      }
    }
  };

  inputs.forEach(process);
  return classes.join(" ");
}
