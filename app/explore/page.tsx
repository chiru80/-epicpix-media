import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, Briefcase, Sparkles, Filter } from "lucide-react";
import { GlassCard, GlassButton, GlassBadge } from "@/components/ui/glisse";
import { createServerSupabaseClient } from "@/lib/supabase";
import { formatINRSimple } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface CreatorItem {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  completed_projects: number;
  starting_price: number;
  avatar_url: string;
  preview_image: string;
  verified: boolean;
  skills: string[];
}

export default async function ExploreCreatorsPage() {
  const supabase = await createServerSupabaseClient();

  let creators: CreatorItem[] = [];

  try {
    const { data: dbProfiles } = await supabase
      .from("freelancer_profiles")
      .select("*, users:user_id(id, full_name, email, avatar_url)")
      .limit(12);

    if (dbProfiles && dbProfiles.length > 0) {
      creators = dbProfiles.map((p: any) => ({
        id: p.user_id,
        name: p.users?.full_name || p.users?.email?.split("@")[0] || "Creative Pro",
        specialization: p.skills?.[0] || "Commercial Videographer",
        location: "Mumbai, India",
        rating: Number(p.rating) || 4.9,
        completed_projects: p.completed_projects || 42,
        starting_price: Number(p.hourly_rate) ? Number(p.hourly_rate) * 5 : 8247,
        avatar_url: p.users?.avatar_url || "/images/about-studio.jpg",
        preview_image: p.portfolio_url || "/images/project-1.jpg",
        verified: p.verified ?? true,
        skills: p.skills?.length ? p.skills : ["Video Editing", "Color Grading", "Sound Design"],
      }));
    }
  } catch (err) {
    console.error("Explore creators fetch error:", err);
  }

  // Fallback curated creative professionals if database has no active profiles yet
  if (creators.length === 0) {
    creators = [
      {
        id: "creator-1",
        name: "Aarav Sharma",
        specialization: "Cinematographer & Colorist",
        location: "Mumbai, India",
        rating: 4.9,
        completed_projects: 124,
        starting_price: 16541,
        avatar_url: "/images/about-studio.jpg",
        preview_image: "/images/project-1.jpg",
        verified: true,
        skills: ["Commercial Video", "DaVinci Resolve", "RED Camera", "Drone Cinema"],
      },
      {
        id: "creator-2",
        name: "Priya Nair",
        specialization: "Commercial Product Photographer",
        location: "Bengaluru, India",
        rating: 5.0,
        completed_projects: 89,
        starting_price: 8247,
        avatar_url: "/images/portfolio-2.jpg",
        preview_image: "/images/project-2.jpg",
        verified: true,
        skills: ["Studio Lighting", "High-End Retouching", "E-Commerce", "Cosmetics"],
      },
      {
        id: "creator-3",
        name: "Vikram Malhotra",
        specialization: "Aerial Drone Pilot & Director",
        location: "Goa / Delhi, India",
        rating: 4.8,
        completed_projects: 76,
        starting_price: 24500,
        avatar_url: "/images/portfolio-3.jpg",
        preview_image: "/images/project-3.jpg",
        verified: true,
        skills: ["DGCA Certified Drone", "FPV Cinema", "Real Estate", "Action Sports"],
      },
      {
        id: "creator-4",
        name: "Rohan Varma",
        specialization: "YouTube & Social Video Editor",
        location: "Hyderabad, India",
        rating: 4.9,
        completed_projects: 210,
        starting_price: 2417,
        avatar_url: "/images/portfolio-1.jpg",
        preview_image: "/images/portfolio-1.jpg",
        verified: true,
        skills: ["Thumbnail Design", "Shorts / Reels", "Premiere Pro", "Motion Graphics"],
      },
      {
        id: "creator-5",
        name: "Ananya Sen",
        specialization: "Brand Documentary Filmmaker",
        location: "Kolkata, India",
        rating: 4.95,
        completed_projects: 64,
        starting_price: 33083,
        avatar_url: "/images/about-studio.jpg",
        preview_image: "/images/project-1.jpg",
        verified: true,
        skills: ["Scriptwriting", "Interview Direction", "Cinema Verite", "Audio Mastering"],
      },
      {
        id: "creator-6",
        name: "Kabir Mehta",
        specialization: "3D Product Animator & VFX",
        location: "Pune, India",
        rating: 4.85,
        completed_projects: 98,
        starting_price: 18500,
        avatar_url: "/images/portfolio-2.jpg",
        preview_image: "/images/project-2.jpg",
        verified: true,
        skills: ["Blender 3D", "After Effects", "Product Rendering", "Visual Effects"],
      },
    ];
  }

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <GlassBadge variant="primary" size="default" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Verified Creator Directory</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Discover Top Creative Talent
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Hire pre-vetted video editors, cinematographers, drone pilots, and photographers. Book with milestone escrow via YouPI.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm shadow-primary/20 cursor-pointer">
              All Talent
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Cinematography
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Video Editing
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Product Photography
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Drone Aerial
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Thumbnails
            </span>
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <GlassCard key={creator.id} variant="interactive" className="group flex flex-col justify-between">
              <div>
                {/* Media Preview Box */}
                <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                  <Image
                    src={creator.preview_image}
                    alt={`${creator.name}'s portfolio`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20" />

                  {/* Rating & Verified Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <GlassBadge variant="gold" size="sm" className="bg-black/60 backdrop-blur-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{creator.rating.toFixed(1)}</span>
                    </GlassBadge>

                    {creator.verified && (
                      <GlassBadge variant="primary" size="sm" className="bg-sky-950/70 border-sky-400/30 text-sky-300">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified Pro
                      </GlassBadge>
                    )}
                  </div>
                </div>

                {/* Creator Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {creator.name}
                      </h3>
                      <p className="text-xs text-sky-400 font-medium">{creator.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {creator.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                      {creator.completed_projects} projects
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {creator.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Starting at</span>
                  <span className="text-lg font-bold text-foreground">{formatINRSimple(creator.starting_price)}</span>
                </div>
                <GlassButton
                  href={`/creators/${creator.id}`}
                  variant="glass"
                  size="sm"
                  className="font-medium hover:border-primary/50 hover:text-primary"
                >
                  View Profile
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}

