"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Video, Palette, Sparkles } from "lucide-react";
import { formatINRSimple } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  basePrice: number;
  delivery: string;
  description: string;
  tier?: string[];
  addOns?: AddOn[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

const services: Service[] = [
  {
    id: "thumbnail",
    name: "Thumbnail Creation",
    basePrice: 2417,
    delivery: "48 hours",
    description: "Custom thumbnails for YouTube, Instagram, Facebook",
    tier: ["Standard"],
  },
  {
    id: "video_basic",
    name: "Video Editing (Basic)",
    basePrice: 8247,
    delivery: "5 days",
    description: "Perfect for short videos, reels, social content",
    tier: ["Basic"],
  },
  {
    id: "video_pro",
    name: "Video Editing (Pro)",
    basePrice: 16541,
    delivery: "7 days",
    description: "For promotional videos, business content, ads",
    tier: ["Pro"],
  },
  {
    id: "video_premium",
    name: "Video Editing (Premium)",
    basePrice: 33083,
    delivery: "10 days",
    description: "Comprehensive video production editing",
    tier: ["Premium"],
  },
  {
    id: "color_grading",
    name: "Color Grading",
    basePrice: 12393,
    delivery: "3 days",
    description: "LUT application, color consistency, mood grading",
    tier: ["Standard"],
  },
  {
    id: "motion_graphics",
    name: "Motion Graphics",
    basePrice: 16541,
    delivery: "5 days",
    description: "Intro/outro animations, title sequences, lower thirds",
    tier: ["Standard"],
  },
];

// Add-ons per service type
const THUMBNAIL_ADD_ONS: AddOn[] = [
  { id: "rush", name: "Rush Delivery (24 hours)", price: 1250 },
  { id: "source", name: "Source Files Included", price: 1667 },
  { id: "bgremove", name: "Background Removal", price: 833 },
];

const VIDEO_ADD_ONS: AddOn[] = [
  { id: "rush", name: "Rush Delivery", price: 2500 },
  { id: "motion", name: "Motion Graphics", price: 3333 },
  { id: "sound", name: "Sound Design", price: 2500 },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case "thumbnail":
        return <Camera className="h-6 w-6" />;
      case "video_basic":
      case "video_pro":
      case "video_premium":
        return <Video className="h-6 w-6" />;
      case "color_grading":
        return <Palette className="h-6 w-6" />;
      case "motion_graphics":
        return <Sparkles className="h-6 w-6" />;
      default:
        return <Camera className="h-6 w-6" />;
    }
  };

  const getServiceName = (serviceId: string): string => {
    const names: Record<string, string> = {
      thumbnail: "Thumbnail Creation",
      video_basic: "Video Editing (Basic)",
      video_pro: "Video Editing (Pro)",
      video_premium: "Video Editing (Premium)",
      color_grading: "Color Grading",
      motion_graphics: "Motion Graphics",
    };
    return names[serviceId] || serviceId;
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-display mb-8">
          Our Services
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12">
          Professional media production services tailored to your business needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/order/configure?service=${service.id}`}
              className="group border rounded-2xl p-8 hover:border-accent transition-colors cursor-pointer"
              style={{
                borderColor: selectedService === service.id ? "hsl(var(--accent))" : "transparent",
              }}
            >
              <div
                className="h-12 w-12 mb-4 flex items-center justify-center rounded-xl transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-3"
              >
                {getServiceIcon(service.id)}
              </div>

              <h3 className="text-xl font-display mb-2">
                {service.name}
              </h3>
              <p className="text-muted-foreground mb-3">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  {formatINRSimple(service.basePrice)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {service.delivery}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}