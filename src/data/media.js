// Shared by the image tiles (components/Media.jsx) and the pages that use them.

export const INTER = '"Inter", sans-serif';
export const LIGHT = { fontFamily: INTER, fontWeight: 300 };

/* Images that read better zoomed in a touch, by project id. */
export const CROP = { "the-fifth-official": 1.1 };

/* Logos sit full width on their own background colour so the tile reads as
   one solid block; anything not listed (Blenman's heatmap) is cropped to fill. */
export const LOGO_BG = {
  "/shownspace-logo.png": "#1b1e26",
  "/kira.avif": "#442197",
  "/yale-ai.png": "#1e191a",
};
