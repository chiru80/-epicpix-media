import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Film, Camera, Play, Star, CheckCircle2 } from "lucide-react";
import { GlassCard, GlassButton, GlassPanel, GlassBadge } from "@/components/ui/glisse";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Glass Eyebrow */}
            <div className="inline-flex mb-6">
              <GlassBadge variant="primary" size="default" className="gap-2 px-4 py-1.5 shadow-lg shadow-primary/10">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold tracking-wide text-xs">The Next-Gen Media Marketplace</span>
              </GlassBadge>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground tracking-tight leading-[1.1] mb-6">
              Bring your vision to life with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500">professional creators</span>.
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-normal">
              Commercial films, viral social video, product photography, and high-impact digital content produced by vetted, world-class creators on liquid-fast deadlines.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <GlassButton
                href="/explore"
                variant="filled"
                size="lg"
                icon={<Sparkles className="w-4 h-4" />}
                className="shadow-xl shadow-primary/25"
              >
                Explore Creators
              </GlassButton>
              <GlassButton
                href="/auth/signup?role=FREELANCER"
                variant="glass"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Become a Creator
              </GlassButton>
              <GlassButton
                href="/services"
                variant="outline"
                size="lg"
              >
                Browse Services
              </GlassButton>
            </div>
          </div>

          {/* Hero Visual Glass Showcase */}
          <div className="mt-16 max-w-5xl mx-auto">
            <GlassPanel glow className="p-3 sm:p-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-black/60 group">
                <Image
                  src="/images/project-1.jpg"
                  alt="EpicPix cinematic showcase"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />

                {/* Floating Glass Metadata Chips */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center border border-white/20 text-white backdrop-blur-xl group-hover:bg-primary/30 transition-colors">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                    <div>
                      <h3 className="text-white font-display font-semibold text-lg leading-snug">
                        Corporate Showcase 2026
                      </h3>
                      <p className="text-xs text-white/70">Shot on RED V-Raptor 8K • Color Graded in DaVinci</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GlassBadge variant="default" className="text-white bg-black/40 border-white/20">
                      4K HDR
                    </GlassBadge>
                    <GlassBadge variant="default" className="text-white bg-black/40 border-white/20">
                      Dolby Atmos
                    </GlassBadge>
                    <GlassBadge variant="primary" className="text-sky-300 bg-sky-950/60 border-sky-400/30">
                      Top Rated
                    </GlassBadge>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Trust & Metrics Bar */}
      <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">500+</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Delivered Projects</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">4.9 / 5.0</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Average Creator Rating</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">100%</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Escrow Protection</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">48h</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Rush Turnaround</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <GlassBadge variant="primary" size="sm" className="mb-3">
                Selected Works
              </GlassBadge>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Crafted by EpicPix Creators
              </h2>
              <p className="text-muted-foreground mt-2 max-w-xl text-base">
                Discover exceptional visual stories delivered for global startups, enterprise brands, and modern creators.
              </p>
            </div>
            <GlassButton href="/portfolio" variant="glass" icon={<ArrowRight className="w-4 h-4" />}>
              View All Works
            </GlassButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <GlassCard variant="interactive" className="group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src="/images/project-1.jpg"
                  alt="Corporate promotional video for Acme Corp"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <GlassBadge variant="default" size="sm" className="bg-black/60 text-white border-white/20">
                    <Film className="w-3 h-3 mr-1" /> Video Production
                  </GlassBadge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Corporate Brand Film
                  </h3>
                  <span className="text-xs text-muted-foreground">Acme Corp</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  Multi-location documentary style brand story produced with high-speed cinema lenses and sound design.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Turnaround: 7 Days</span>
                  <Link href="/order/configure?service=video_pro" className="text-xs font-semibold text-primary hover:underline">
                    Order Similar →
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* Project Card 2 */}
            <GlassCard variant="interactive" className="group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src="/images/project-2.jpg"
                  alt="Product photography for Luna Cosmetics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <GlassBadge variant="default" size="sm" className="bg-black/60 text-white border-white/20">
                    <Camera className="w-3 h-3 mr-1" /> Commercial Photo
                  </GlassBadge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Luxury Product Photography
                  </h3>
                  <span className="text-xs text-muted-foreground">Luna Cosmetics</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  High-fashion studio lighting and micro-detail macro photography for global packaging campaign.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Turnaround: 3 Days</span>
                  <Link href="/services" className="text-xs font-semibold text-primary hover:underline">
                    View Package →
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* Project Card 3 */}
            <GlassCard variant="interactive" className="group">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src="/images/project-3.jpg"
                  alt="Drone aerial cinematography for Coastal Properties"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <GlassBadge variant="default" size="sm" className="bg-black/60 text-white border-white/20">
                    <Film className="w-3 h-3 mr-1" /> Drone Cinema
                  </GlassBadge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Architectural Drone Showcase
                  </h3>
                  <span className="text-xs text-muted-foreground">Coastal Properties</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  Cinematic golden-hour aerial tracking shots capturing high-end architectural real estate.
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Turnaround: 5 Days</span>
                  <Link href="/services" className="text-xs font-semibold text-primary hover:underline">
                    View Package →
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* How It Works - Liquid Glass Steps */}
      <section className="py-20 bg-black/10 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <GlassBadge variant="primary" size="sm" className="mb-3">
              Frictionless Process
            </GlassBadge>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              How EpicPix Works
            </h2>
            <p className="text-muted-foreground mt-2">
              From creative brief to final 4K export in three seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Discover or Configure
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse verified creators or configure custom video editing, thumbnail packages, and photography with upfront INR pricing.
              </p>
            </GlassCard>

            <GlassCard className="p-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Secure YouPI Escrow
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pay safely via UPI, netbanking, or cards through YouPI-PG. Funds are held safely in escrow until you approve deliveries.
              </p>
            </GlassCard>

            <GlassCard className="p-8 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold text-xl mb-6">
                03
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Master 4K Deliverables
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review revisions, download watermarked drafts, and unlock full resolution private masters from encrypted Supabase storage.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassPanel glow className="p-8 sm:p-14 text-center">
            <div className="max-w-2xl mx-auto">
              <GlassBadge variant="gold" size="default" className="mb-4">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-xs">Rated 4.9/5 by 200+ Businesses</span>
              </GlassBadge>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Ready to elevate your visual presence?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                Connect with an expert creator today, or browse our standard packages to start your next campaign.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <GlassButton
                  href="/order/configure"
                  variant="filled"
                  size="lg"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Configure Project
                </GlassButton>
                <GlassButton
                  href="/contact"
                  variant="glass"
                  size="lg"
                >
                  Contact Studio
                </GlassButton>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>
    </main>
  );
}
