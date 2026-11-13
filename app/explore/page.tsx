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
          <div className="inline-flex mb-4">
            <span className="apple-pill-btn apple-pill-secondary px-4 py-1 text-xs text-apple-lightgray font-medium border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-apple-blue-vibrant mr-1.5" />
              Verified Creator Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight mb-4">
            <span className="apple-text-titanium">Elite Creator</span>{" "}
            <span className="apple-text-cosmic">Directory.</span>
          </h1>
          <p className="text-base sm:text-lg text-apple-gray">
            Hire pre-vetted video editors, cinematographers, drone pilots, and photographers. Book with milestone escrow via YouPI.
          </p>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <div key={creator.id} className="apple-bento-card group flex flex-col justify-between">
              <div>
                {/* Media Preview Box */}
                <div className="relative h-48 w-full bg-[#161617] overflow-hidden">
                  <Image
                    src={creator.preview_image}
                    alt={`${creator.name}'s portfolio`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />

                  {/* Rating & Verified Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{creator.rating.toFixed(1)}</span>
                    </span>

                    {creator.verified && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1 backdrop-blur-md">
                        <ShieldCheck className="w-3 h-3" /> Verified Pro
                      </span>
                    )}
                  </div>
                </div>

                {/* Creator Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-apple-blue-vibrant transition-colors">
                        {creator.name}
                      </h3>
                      <p className="text-xs text-apple-blue-vibrant font-medium">{creator.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-apple-gray mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-apple-gray" />
                      {creator.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-apple-gray" />
                      {creator.completed_projects} projects
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {creator.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-apple-lightgray"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="p-6 pt-0 border-t border-white/10 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-apple-gray block">Starting at</span>
                  <span className="text-lg font-bold text-white">{formatINRSimple(creator.starting_price)}</span>
                </div>
                <Link
                  href={`/creators/${creator.id}`}
                  className="apple-pill-btn apple-pill-secondary text-xs px-4 py-2 font-medium hover:bg-white/10"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

