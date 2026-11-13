"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Video, Palette, Sparkles, Check, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { formatINRSimple } from "@/lib/utils";
import { GlassCard, GlassButton, GlassBadge, GlassPanel } from "@/components/ui/glisse";

interface Service {
  id: string;
  name: string;
  basePrice: number;
  delivery: string;
  description: string;
  tier: string;
  deliverables: string[];
  popular?: boolean;
}

const services: Service[] = [
  {
    id: "thumbnail",
    name: "Thumbnail Creation",
    basePrice: 2417,
    delivery: "48 Hours",
    description: "High-CTR custom thumbnails tailored for YouTube, Instagram, and LinkedIn.",
    tier: "Standard",
    deliverables: ["3 Concept Variants", "PSD Source Files", "Face Retouching", "A/B Test Ready"],
  },
  {
    id: "video_basic",
    name: "Video Editing (Basic)",
    basePrice: 8247,
    delivery: "5 Days",
    description: "Ideal for short videos, reels, TikToks, and episodic social media content.",
    tier: "Starter",
    deliverables: ["Up to 60s Final Cut", "Captions & Subtitles", "Background Music", "2 Revision Rounds"],
  },
  {
    id: "video_pro",
    name: "Video Editing (Pro)",
    basePrice: 16541,
    delivery: "7 Days",
    description: "For promotional brand videos, startup pitches, and corporate campaigns.",
    tier: "Pro",
    popular: true,
    deliverables: ["Multi-Camera Editing", "DaVinci Color Grade", "Sound Design & Mix", "3 Revision Rounds", "Commercial License"],
  },
  {
    id: "video_premium",
    name: "Video Editing (Premium)",
    basePrice: 33083,
    delivery: "10 Days",
    description: "Full-scale documentary, commercial, and high-production value broadcast.",
    tier: "Enterprise",
    deliverables: ["Unlimited Length Cuts", "Motion Graphics Suite", "Pro Sound Mix 5.1", "Dedicated Director", "Unlimited Revisions"],
  },
  {
    id: "color_grading",
    name: "Color Grading & Mastering",
    basePrice: 12393,
    delivery: "3 Days",
    description: "Film emulation, custom show LUTs, scene consistency, and HDR mastering.",
    tier: "Specialized",
    deliverables: ["Shot Matching", "Skin Tone Perfection", "ACES / Color Managed", "Deliverable XML Export"],
  },
  {
    id: "motion_graphics",
    name: "Motion Graphics & 3D",
    basePrice: 16541,
    delivery: "5 Days",
    description: "Kinetic typography, animated brand logos, UI demos, and 3D product passes.",
    tier: "Specialized",
    deliverables: ["Custom 2D/3D Animation", "Alpha Channel Assets", "Sound Effects", "Modular Templates"],
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case "thumbnail":
        return <Camera className="h-6 w-6 text-primary" />;
      case "video_basic":
      case "video_pro":
      case "video_premium":
        return <Video className="h-6 w-6 text-primary" />;
      case "color_grading":
        return <Palette className="h-6 w-6 text-primary" />;
      case "motion_graphics":
        return <Sparkles className="h-6 w-6 text-primary" />;
      default:
        return <Camera className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <GlassBadge variant="primary" size="default" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Guaranteed Production SLAs</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Production Services & Packages
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Clear, upfront INR pricing with milestone protection. Backed by private media deliveries and 18% GST invoicing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <GlassCard
              key={service.id}
              variant={service.popular ? "elevated" : "default"}
              glow={service.popular}
              className={`p-7 flex flex-col justify-between group ${
                service.popular ? "border-primary/40 ring-1 ring-primary/20" : ""
              }`}
            >
              <div>
                {/* Top Badge & Tier */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center border border-white/10 group-hover:bg-primary/10 transition-colors">
                    {getServiceIcon(service.id)}
                  </div>
                  {service.popular ? (
                    <GlassBadge variant="primary" size="sm">
                      ★ Most Popular
                    </GlassBadge>
                  ) : (
                    <GlassBadge variant="default" size="sm">
                      {service.tier}
                    </GlassBadge>
                  )}
                </div>

                <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Price */}
                <div className="pb-6 mb-6 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {formatINRSimple(service.basePrice)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">+ 18% GST</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Estimated Delivery: <strong>{service.delivery}</strong></span>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-2.5 mb-8">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary flex-none" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <GlassButton
                href={`/order/configure?service=${service.id}`}
                variant={service.popular ? "filled" : "glass"}
                size="default"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Configure & Book
              </GlassButton>
            </GlassCard>
          ))}
        </div>

        {/* Custom Project Banner */}
        <GlassPanel glow className="p-8 sm:p-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              Need custom enterprise production?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              For multi-month retainer contracts, commercial television ads, or custom crew deployments across India, speak directly with our studio directors.
            </p>
            <GlassButton href="/contact" variant="glass" size="default">
              Request Studio Quote
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </main>
  );
}
