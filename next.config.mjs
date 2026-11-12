import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESM-only for Next.js 15
  // App Router enabled by default
  // Image optimization for Vercel
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com", "lh3.googleusercontent.com"],
  },
  // Disable bundle analyzer for faster builds
  // poweredByHeader: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
      "@/lib": path.resolve(__dirname, "lib"),
      "@/components": path.resolve(__dirname, "components"),
    };
    return config;
  },
};

export default nextConfig;