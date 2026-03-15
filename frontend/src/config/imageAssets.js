/**
 * HOPEDROP - Centralized Image Assets Configuration
 * Using Google UserContent CDN for all images
 */

const DRIVE_BASE = 'https://lh3.googleusercontent.com/d/';
const DRIVE_SUFFIX = '=w2000?authuser=0';

// ============================================
// LOGOS
// ============================================
export const LOGOS = {
  iconDark: `${DRIVE_BASE}1nsuVmmSRO7ayFu59fBIRHaC20ReJYpL_${DRIVE_SUFFIX}`,
  icon: `${DRIVE_BASE}131qdM3saBLgNBTThX4iRabqrJweiWMuO${DRIVE_SUFFIX}`,
  favicon: `${DRIVE_BASE}1X59sC1LVcy46ESBE4SU9I0goAJlX71in${DRIVE_SUFFIX}`,
};

// ============================================
// ABOUT US PAGE
// ============================================
export const ABOUT_US = {
  workingTogether: `${DRIVE_BASE}1_jaXlBLOLTSMrQdJvWHpeplPmSVKrCiO${DRIVE_SUFFIX}`,
  auHero: `${DRIVE_BASE}1RNAs-064iCwYmPfc9xn-OfTVsPT5qNdC${DRIVE_SUFFIX}`,
};

// ============================================
// CONTACT PAGE
// ============================================
export const CONTACT = {
  generalEnquiries: `${DRIVE_BASE}1onaaegQrVkokkXAqaap3RaqVUNFcqjwY${DRIVE_SUFFIX}`,
  hotlineEmergency: `${DRIVE_BASE}1MIRqQJOdAz_1GHsya4ehQA_cHfXQL9jM${DRIVE_SUFFIX}`,
  mainBranch: `${DRIVE_BASE}1JQtKJe0_58Z-HCVhQVg8eeIaa5vbWXAS${DRIVE_SUFFIX}`,
};

// ============================================
// EVENTS PAGE
// ============================================
export const EVENTS = {
  // Upcoming Events
  upcomingEvent: `${DRIVE_BASE}1Rw8aRLwyLpUSv3Birqljcpuv98fENLIg${DRIVE_SUFFIX}`,
  onlineEvent: `${DRIVE_BASE}1rzJFt-H78PDdc8bfp9ML6JfEk9uXKh24${DRIVE_SUFFIX}`,
  urgentEvent: `${DRIVE_BASE}1VNfr_sAP4KhSTJPHu8nzF3Sx5KbZIvfk${DRIVE_SUFFIX}`,
  
  // Past Events
  worldBloodDonorDay: `${DRIVE_BASE}1o6n_yg59fcGxU_2AjOYW8-0nSkqalbOg${DRIVE_SUFFIX}`,
  corporateBloodDrive: `${DRIVE_BASE}1pEzGVvON76XEIcgHpjA-3YytNImnpPwP${DRIVE_SUFFIX}`,
  communityHealthFair: `${DRIVE_BASE}1jdOeO9kD_0mggCGpsnFq3MQ6KwBjQMiO${DRIVE_SUFFIX}`,
  
  // News
  newBloodCenter: `${DRIVE_BASE}1dH2l8UXb0xVS-liTUZf9W78nVd-EP0go${DRIVE_SUFFIX}`,
  hospitalNetwork: `${DRIVE_BASE}1IJj-qTFPgo3yNvEtvLm9svvxQd3MSXcm${DRIVE_SUFFIX}`,
  mobileAppLaunch: `${DRIVE_BASE}1zpSMG48zD6ZQNieOgQJJu9mrLqoDzMUO${DRIVE_SUFFIX}`,
};

// ============================================
// LANDING PAGE
// ============================================
export const LANDING = {
  donorRegistration: `${DRIVE_BASE}1ywIyfhVTYArv1C6dyOiwaRFGkYBSbDuy${DRIVE_SUFFIX}`,
  checkEligibility: `${DRIVE_BASE}1MnSvkQ2L3EpcqAebYFJIiWcdsQ6BZeTc${DRIVE_SUFFIX}`,
  bloodCampDetails: `${DRIVE_BASE}1zb-GnvvIJn_NzCKgg6xISm9zkG2edLpb${DRIVE_SUFFIX}`,
  whyDonate: `${DRIVE_BASE}1dIg5zEdILxqdeexAcsZyPozA2OCUTfas${DRIVE_SUFFIX}`,
};

// ============================================
// SERVICES PAGE
// ============================================
export const SERVICES = {
  heroImage: `${DRIVE_BASE}1LnXx55L0A70px_wUhAnLkRd9yrUK7jL0${DRIVE_SUFFIX}`,
  emergencyServices: `${DRIVE_BASE}1VOhSx7cJDl3iapQF6WMX0noN7thK7gQF${DRIVE_SUFFIX}`,
  advancedTesting: `${DRIVE_BASE}1mdzWqcpVY_0EUnOFfE4bPHuIsWaGYyhY${DRIVE_SUFFIX}`,
};

// ============================================
// LEGACY PHOTOS (Keep for compatibility)
// ============================================
export const PHOTOS = {
  photo1: `${DRIVE_BASE}1sXD_-GD1xuKmdsNpmuYPu4vFhPVWJuZm${DRIVE_SUFFIX}`,
  photo2: `${DRIVE_BASE}1_izCMzexgRvNkDk2IpY6TnKVeN1_su_P${DRIVE_SUFFIX}`,
  photo3: `${DRIVE_BASE}1aY_2AHZPK98xSIvpc7EAHIRtrEJXcHi7${DRIVE_SUFFIX}`,
  photo4: `${DRIVE_BASE}1SMIsG3q5CDGLOXVaWm7wBcFtWZ5qAf0e${DRIVE_SUFFIX}`,
  photo5: `${DRIVE_BASE}1fHkX9QGfoOOYFbVlmQu2aJeR7gPZQn6S${DRIVE_SUFFIX}`,
  photo6: `${DRIVE_BASE}11GIwJh8VM4-RFvLEAALo46EJywvXhRCj${DRIVE_SUFFIX}`,
};

export const SVG_ASSETS = {
  react: `${DRIVE_BASE}17LnmfOfcB7rF3IFIE5rS5sEl5wtB0PYy${DRIVE_SUFFIX}`,
};

// Helper functions
export const getAllPhotos = () => Object.values(PHOTOS);
export const getAllLogos = () => Object.values(LOGOS);

export default { 
  LOGOS, 
  PHOTOS, 
  SVG_ASSETS,
  ABOUT_US,
  CONTACT,
  EVENTS,
  LANDING,
  getAllPhotos, 
  getAllLogos 
};
