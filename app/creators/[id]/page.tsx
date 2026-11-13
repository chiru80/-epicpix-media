import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, MapPin, Briefcase, Calendar, Check, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { GlassCard, GlassButton, GlassBadge, GlassPanel } from "@/components/ui/glisse";
import { createServerSupabaseClient } from "@/lib/supabase";
import { formatINRSimple } from "@/lib/utils";
import { SERVICES_CATALOG } from "@/app/services/catalog";

export const dynamic = "force-dynamic";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  let creatorData: any = null;

  try {
    // Try fetching from database
    const { data: profile } = await supabase
      .from("freelancer_profiles")
      .select("*, users:user_id(*)")
      .eq("user_id", id)
      .single();

    if (profile) {
      creatorData = {
        id: profile.user_id,
        name: profile.users?.full_name || profile.users?.email?.split("@")[0] || "Creative Professional",
        email: profile.users?.email,
        bio: profile.bio || "Dedicated creative director and visual specialist producing cinematic stories for digital and commercial brands.",
        specialization: profile.skills?.[0] || "Cinematographer & Colorist",
        location: "Mumbai, India",
        rating: Number(profile.rating) || 4.9,
        reviews_count: 38,
        completed_projects: profile.completed_projects || 42,
        hourly_rate: Number(profile.hourly_rate) || 2500,
        availability: profile.availability || "available",
        verified: profile.verified ?? true,
        skills: profile.skills?.length ? profile.skills : ["Video Production", "Commercial Film", "DaVinci Resolve", "Drone Cinematography"],
        portfolio_url: profile.portfolio_url || "/images/project-1.jpg",
      };
    }
  } catch (err) {
    console.error("Error fetching creator:", err);
  }

  // Fallback for creator demo ids or unseeded database
  if (!creatorData) {
    creatorData = {
      id,
      name: id === "creator-2" ? "Priya Nair" : id === "creator-3" ? "Vikram Malhotra" : "Aarav Sharma",
      bio: "Award-winning creative director with 7+ years of experience filming corporate brand films, high-speed commercials, and luxury product campaigns. Certified in DaVinci Resolve color grading.",
      specialization: id === "creator-2" ? "Commercial Product Photographer" : id === "creator-3" ? "Aerial Drone Pilot & Director" : "Cinematographer & Colorist",
      location: "Mumbai, India",
      rating: 4.9,
      reviews_count: 52,
      completed_projects: 124,
      hourly_rate: 3200,
      availability: "available",
      verified: true,
      skills: ["Commercial Film", "4K HDR Video", "DaVinci Color", "Sound Design", "RED Cinema"],
      portfolio_url: "/images/project-1.jpg",
    };
  }

  const sampleServices = [
    {
      id: "video_pro",
      name: "Commercial Brand Video (Pro)",
      price: 16541,
      delivery: "7 Days",
      revisions: "3 Revisions",
      deliverables: ["4K HDR Master", "Social Cuts (9:16 & 1:1)", "Sound Design & Mix", "Licensed Music"],
    },
    {
      id: "video_premium",
      name: "Cinematic Showcase & Documentary",
      price: 33083,
      delivery: "10 Days",
      revisions: "Unlimited Revisions",
      deliverables: ["Full Production Reel", "Raw DaVinci Color XML", "Multi-platform Exports", "Dedicated Sound Engineer"],
    },
    {
      id: "thumbnail",
      name: "High-CTR Social Thumbnails (Pack of 3)",
      price: 2417,
      delivery: "48 Hours",
      revisions: "2 Revisions",
      deliverables: ["3 High-CTR Concepts", "Source PSD Files", "Face Retouching", "A/B Variants"],
    },
  ];

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Creator Hero Header */}
        <GlassPanel glow className="p-8 sm:p-12 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden glass-card border-2 border-white/20 shadow-xl flex-none">
                <Image
                  src={creatorData.portfolio_url}
                  alt={creatorData.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                    {creatorData.name}
                  </h1>
                  {creatorData.verified && (
                    <GlassBadge variant="primary" size="sm">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Pro
                    </GlassBadge>
                  )}
                  <GlassBadge variant={creatorData.availability === "available" ? "success" : "warning"} size="sm">
                    ● {creatorData.availability === "available" ? "Accepting Orders" : "Booked Out"}
                  </GlassBadge>
                </div>

                <p className="text-sm font-medium text-sky-400 mb-3">{creatorData.specialization}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {creatorData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <strong className="text-foreground">{creatorData.rating.toFixed(1)}</strong> ({creatorData.reviews_count} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {creatorData.completed_projects} projects completed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <GlassButton
                href={`/order/configure?freelancer=${creatorData.id}&service=video_pro`}
                variant="filled"
                size="lg"
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center"
              >
                Book Creator
              </GlassButton>
              <GlassButton
                href={`/contact?recipient=${encodeURIComponent(creatorData.name)}`}
                variant="glass"
                size="lg"
                icon={<MessageSquare className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center"
              >
                Inquire
              </GlassButton>
            </div>
          </div>
        </GlassPanel>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Services & Packages */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">Services & Packages</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Protected with 100% YouPI escrow</p>
                </div>
              </div>

              <div className="space-y-6">
                {sampleServices.map((pkg) => (
                  <GlassCard key={pkg.id} variant="elevated" className="p-6 group">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-white/5">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {pkg.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>⏱ {pkg.delivery}</span>
                          <span>•</span>
                          <span>🔄 {pkg.revisions}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-2xl font-bold text-foreground block">
                          {formatINRSimple(pkg.price)}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">+ 18% GST</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                      {pkg.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-primary flex-none" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <GlassButton
                        href={`/order/configure?freelancer=${creatorData.id}&service=${pkg.id}`}
                        variant="filled"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Book This Package
                      </GlassButton>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Portfolio Reel Showcase */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">Featured Work</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard variant="interactive" className="overflow-hidden">
                  <div className="relative h-44 w-full">
                    <Image
                      src="/images/project-1.jpg"
                      alt="Project showcase 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-semibold text-foreground text-sm">Commercial Reel 2026</h4>
                    <p className="text-xs text-muted-foreground mt-1">Acme Brand Campaign</p>
                  </div>
                </GlassCard>

                <GlassCard variant="interactive" className="overflow-hidden">
                  <div className="relative h-44 w-full">
                    <Image
                      src="/images/project-2.jpg"
                      alt="Project showcase 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-semibold text-foreground text-sm">Studio Lighting Session</h4>
                    <p className="text-xs text-muted-foreground mt-1">Cosmetics Macro Photography</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Sidebar: About & Verification */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-3">About Creator</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {creatorData.bio}
              </p>

              <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground/80 mb-3">
                Skills & Gear
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {creatorData.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground font-medium">May 2024</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="text-foreground font-medium">&lt; 2 Hours</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Payment Protection</span>
                  <span className="text-emerald-400 font-medium">YouPI Escrow</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground">Verified Creator</h4>
                  <p className="text-[11px] text-muted-foreground">Identity & Portfolios Vetted</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All deliverables are submitted through private Supabase media storage with watermarked review rounds and full resolution releases.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}

