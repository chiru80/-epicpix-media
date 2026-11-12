/**
 * Complete Service Catalog in Indian Rupees (₹)
 *
 * Conversion rate: 1 USD = ₹83 (approximate, update as needed)
 * Indian GST: 18% service tax on all services
 *
 * NOTE: Service prices are hardcoded business-critical values in INR.
 * These represent the actual service costs and are the single source of truth
 * for all pricing across the application.
 */
// ds-allow-hardcode: service prices are business-critical values, not configuration

export const SERVICES_CATALOG = {
  thumbnail: {
    id: "thumbnail",
    name: "Thumbnail Creation",
    basePrice: 2417, // ₹2,417
    delivery: "48 hours",
    icon: "camera",
    description: "Custom thumbnails for YouTube, Instagram, Facebook",
    addOns: [
      { id: "rush", name: "Rush Delivery (24 hours)", price: 1250 },
      { id: "source", name: "Source Files Included", price: 1667 },
      { id: "bgremove", name: "Background Removal", price: 833 },
    ],
    tier: "Standard", // Thumbnails typically one tier
  },

  video_basic: {
    id: "video_basic",
    name: "Video Editing (Basic)",
    basePrice: 8247, // ₹8,247
    delivery: "5 days",
    icon: "video",
    description: "Perfect for short videos, reels, social content",
    addOns: [
      { id: "rush", name: "Rush Delivery (3 days)", price: 2500 },
      { id: "motion", name: "Motion Graphics", price: 3333 },
      { id: "sound", name: "Sound Design", price: 2500 },
    ],
    tier: "Basic",
  },

  video_pro: {
    id: "video_pro",
    name: "Video Editing (Pro)",
    basePrice: 16541, // ₹16,541
    delivery: "7 days",
    icon: "video",
    description: "For promotional videos, business content, ads",
    addOns: [
      { id: "rush", name: "Rush Delivery", price: 4167 },
      { id: "multi", name: "Multi-camera Edit", price: 5833 },
      { id: "drone", name: "Drone Footage Integration", price: 5000 },
    ],
    tier: "Pro",
  },

  video_premium: {
    id: "video_premium",
    name: "Video Editing (Premium)",
    basePrice: 33083, // ₹33,083
    delivery: "10 days",
    icon: "video",
    description: "Comprehensive video production editing",
    addOns: [
      { id: "rush", name: "Rush Delivery", price: 8333 },
      { id: "4k", name: "4K Export", price: 6667 },
      { id: "format", name: "Vertical + Horizontal Formats", price: 5833 },
    ],
    tier: "Premium",
  },

  color_grading: {
    id: "color_grading",
    name: "Color Grading",
    basePrice: 12393, // ₹12,393
    delivery: "3 days",
    icon: "palette",
    description: "LUT application, color consistency, mood grading",
    addOns: [
      { id: "rush", name: "Rush Delivery", price: 4167 },
      { id: "luts", name: "Custom LUT Design", price: 6250 },
      { id: "multi-cam", name: "Multiple Camera Sync", price: 8333 },
    ],
  },

  motion_graphics: {
    id: "motion_graphics",
    name: "Motion Graphics",
    basePrice: 16541, // ₹16,541
    delivery: "5 days",
    icon: "grid",
    description: "Intro/outro animations, title sequences, lower thirds",
    addOns: [
      { id: "rush", name: "Rush Delivery", price: 6250 },
      { id: "3d", name: "3D Elements", price: 8333 },
      { id: "social", name: "Social Media Versions", price: 4167 },
    ],
  },
};