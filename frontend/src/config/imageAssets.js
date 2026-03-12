/**
 * HOPEDROP - Centralized Image Assets Configuration
 * All images stored in Google Drive
 */

// ============================================
// LOGOS
// ============================================
export const LOGOS = {
  // Dark logo icon
  iconDark: 'https://lh3.googleusercontent.com/d/1nsuVmmSRO7ayFu59fBIRHaC20ReJYpL_',
  
  // Regular logo icon (used in navbar)
  icon: 'https://lh3.googleusercontent.com/d/131qdM3saBLgNBTThX4iRabqrJweiWMuO',
  
  // Favicon (browser tab icon)
  favicon: 'https://lh3.googleusercontent.com/d/131qdM3saBLgNBTThX4iRabqrJweiWMuO',
};

// ============================================
// PHOTOS
// ============================================
export const PHOTOS = {
  photo1: 'https://lh3.googleusercontent.com/d/1sXD_-GD1xuKmdsNpmuYPu4vFhPVWJuZm',
  photo2: 'https://lh3.googleusercontent.com/d/1_izCMzexgRvNkDk2IpY6TnKVeN1_su_P',
  photo3: 'https://lh3.googleusercontent.com/d/1aY_2AHZPK98xSIvpc7EAHIRtrEJXcHi7',
  photo4: 'https://lh3.googleusercontent.com/d/1SMIsG3q5CDGLOXVaWm7wBcFtWZ5qAf0e',
  photo5: 'https://lh3.googleusercontent.com/d/1fHkX9QGfoOOYFbVlmQu2aJeR7gPZQn6S',
  photo6: 'https://lh3.googleusercontent.com/d/11GIwJh8VM4-RFvLEAALo46EJywvXhRCj',
};

// ============================================
// SVG ASSETS
// ============================================
export const SVG_ASSETS = {
  react: 'https://lh3.googleusercontent.com/d/17LnmfOfcB7rF3IFIE5rS5sEl5wtB0PYy',
};

// Helper functions
export const getAllPhotos = () => Object.values(PHOTOS);
export const getAllLogos = () => Object.values(LOGOS);

export default {
  LOGOS,
  PHOTOS,
  SVG_ASSETS,
  getAllPhotos,
  getAllLogos,
};