"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Camera, Film, Sparkles, ArrowRight, Eye, Check, X } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: "Video" | "Photography" | "Drone" | "Commercial";
  image: string;
  orderServiceId: string;
  specs: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "promo-video",
    title: "Corporate Promo Video",
    client: "Acme Corp",
    category: "Video",
    image: "/images/portfolio-1.jpg",
    orderServiceId: "video_pro",
    specs: "4K 60fps • DaVinci Color • Multi-Cam",
    description: "High-octane multi-camera documentary produced across 3 global offices with cinematic lighting.",
  },
  {
    id: "product-photo",
    title: "Luxury Product Photography",
    client: "Luna Cosmetics",
    category: "Photography",
    image: "/images/portfolio-2.jpg",
    orderServiceId: "thumbnail",
    specs: "Macro Studio • Retouched Masters",
    description: "Precision studio lighting and micro-detail macro photography for international packaging and billboard campaigns.",
  },
  {
    id: "drone-cinema",
    title: "Drone Aerial Cinematography",
    client: "Coastal Properties",
    category: "Drone",
    image: "/images/portfolio-3.jpg",
    orderServiceId: "video_premium",
    specs: "ProRes 422 • FPV Chase • Golden Hour",
    description: "Sunset FPV tracking shots sweeping over coastal architecture and cliffside luxury developments.",
  },
  {
    id: "brand-film",
    title: "Founder Documentary & Anthem",
    client: "Apex Ventures",
    category: "Commercial",
    image: "/images/project-1.jpg",
    orderServiceId: "video_premium",
    specs: "RED 8K • 5.1 Surround Mix",
    description: "Intimate portrait of technical founders scaling from garage to IPO with spatial orchestral score.",
  },
  {
    id: "studio-session",
    title: "Lifestyle Lookbook Campaign",
    client: "Saffron Living",
    category: "Photography",
    image: "/images/project-2.jpg",
    orderServiceId: "thumbnail",
    specs: "Location Stills • Editorial Retouch",
    description: "Natural-light architectural lifestyle captures curated for quarterly editorial catalogs.",
  },
  {
    id: "coastal-reel",
    title: "Resort Architectural Showcase",
    client: "Azure Coastlines",
    category: "Drone",
    image: "/images/project-3.jpg",
    orderServiceId: "video_pro",
    specs: "4K HDR Aerial • Horizon Stabilized",
    description: "High-speed stabilized gimbal tracking of oceanfront amenities and luxury suites at golden hour.",
  },
];

const categories = ["All", "Video", "Photography", "Drone", "Commercial"] as const;

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);

  const filteredItems = selectedCategory === "All"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Apple Keynote Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex mb-4">
            <span className="apple-pill-btn apple-pill-secondary px-4 py-1 text-xs text-apple-lightgray font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-apple-blue-vibrant mr-1.5" />
              Pro Media Portfolio
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-4">
            <span className="apple-text-titanium">Featured</span>{" "}
            <span className="apple-text-cosmic">Productions.</span>
          </h1>
          <p className="text-base sm:text-lg text-apple-gray">
            Explore 4K commercials, product photography, and drone cinematography delivered by top creators on EpicPix.
          </p>

          {/* Apple Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`apple-pill-btn px-5 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "apple-pill-primary shadow-lg shadow-blue-500/25"
                    : "apple-pill-secondary text-apple-lightgray hover:text-white hover:bg-white/10"
                }`}
              >
                {cat === "All" ? "All Works" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="apple-bento-card group flex flex-col justify-between cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              <div>
                {/* Media Presentation Box */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#161617]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white font-medium flex items-center gap-1.5">
                      {item.category === "Video" && <Film className="w-3 h-3 text-apple-blue-vibrant" />}
                      {item.category === "Photography" && <Camera className="w-3 h-3 text-apple-purple" />}
                      {item.category === "Drone" && <Film className="w-3 h-3 text-apple-green" />}
                      {item.category === "Commercial" && <Sparkles className="w-3 h-3 text-apple-gold" />}
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Glass Controls Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-apple-blue-vibrant block mb-1">
                    {item.client}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-apple-blue-vibrant transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-apple-gray leading-relaxed mb-2">{item.specs}</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 border-t border-white/10 flex items-center justify-between mt-auto">
                <span className="text-xs text-apple-gray font-mono">Master Delivery</span>
                <Link
                  href={`/order/configure?service=${item.orderServiceId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold text-apple-blue-vibrant hover:underline flex items-center gap-1"
                >
                  <span>Order Similar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="apple-bento-card max-w-3xl w-full border border-white/20 bg-[#161617]/95 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] w-full bg-black">
                <Image
                  src={previewItem.image}
                  alt={previewItem.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setPreviewItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-apple-blue-vibrant">
                    {previewItem.client} • {previewItem.category}
                  </span>
                  <span className="text-xs font-mono text-apple-gray">{previewItem.specs}</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-3">
                  {previewItem.title}
                </h2>
                <p className="text-sm text-apple-lightgray leading-relaxed mb-6">
                  {previewItem.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-apple-gray">Protected by YouPI Escrow</span>
                  <Link
                    href={`/order/configure?service=${previewItem.orderServiceId}`}
                    className="apple-pill-btn apple-pill-primary text-xs px-6 py-2.5 font-medium"
                  >
                    Configure Project with This Spec →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
