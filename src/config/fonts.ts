// src/config/fonts.ts

// Define available font families
export const fonts = [
  "inter",
  "playfair-display",
  "jetbrains-mono",
  "system",
  "sans-serif",
  "serif",
  "monospace",
] as const;

export type Font = (typeof fonts)[number];

// Font display names for UI
export const fontDisplayNames: Record<Font, string> = {
  inter: "Inter",
  "playfair-display": "Playfair Display",
  "jetbrains-mono": "JetBrains Mono",
  system: "System Default",
  "sans-serif": "Sans Serif",
  serif: "Serif",
  monospace: "Monospace",
};

// Font CSS imports for Google Fonts
export const fontImports: Record<Font, string | null> = {
  inter:
    "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  "playfair-display":
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@100..900&display=swap",
  "jetbrains-mono":
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap",
  system: null,
  "sans-serif": null,
  serif: null,
  monospace: null,
};

// Font CSS class names
export const fontClassNames: Record<Font, string> = {
  inter: "font-inter",
  "playfair-display": "font-playfair-display",
  "jetbrains-mono": "font-jetbrains-mono",
  system: "font-system",
  "sans-serif": "font-sans-serif",
  serif: "font-serif",
  monospace: "font-monospace",
};
