import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Film, Camera, Play, Star, CheckCircle2, Zap, Monitor, Disc, Compass } from "lucide-react";
import { GlassBadge } from "@/components/ui/glisse";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Keynote Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Apple Keynote Eyebrow */}
            <div className="inline-flex mb-6">
              <div className="apple-pill-btn apple-pill-secondary px-4 py-1.5 gap-2 text-xs border border-white/15 bg-white/5 backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-apple-blue-vibrant shadow-[0_0_8px_#2997ff]" />
                <span className="font-medium text-apple-lightgray tracking-wide">Keynote Edition 2026</span>
                <span className="text-apple-gray">•</span>
                <span className="text-apple-blue-vibrant font-semibold">Pro Media Marketplace</span>
              </div>
            </div>

            {/* Apple Keynote Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.05] mb-6">
              <span className="apple-text-titanium block">Pro visuals.</span>
              <span className="apple-text-cosmic block">Unrivaled masters.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-2xl text-apple-gray max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Commercial films, viral social video, and luxury product photography. Produced by elite creators with YouPI smart escrow.
            </p>

            {/* Apple Pill CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/explore"
                className="apple-pill-btn apple-pill-primary text-sm px-8 py-3.5 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35"
              >
                Explore Creators
              </Link>
              <Link
                href="/order/configure"
                className="apple-pill-btn apple-pill-secondary text-sm px-8 py-3.5 font-medium hover:bg-white/10"
              >
                Configure Project
              </Link>
              <Link
                href="/auth/signup?role=FREELANCER"
                className="text-sm font-medium text-apple-gray hover:text-white transition-colors px-4 py-2"
              >
                Join as Creator →
              </Link>
            </div>
          </div>

          {/* Studio Display Hardware Presentation */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="apple-bento-card p-3 sm:p-4 rounded-[32px] border border-white/15 bg-gradient-to-b from-[#1d1d1f] to-[#121214] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
              {/* Hardware Bezel & Camera Notch */}
              <div className="flex items-center justify-between px-4 py-2 mb-2 border-b border-white/5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-apple-gray tracking-wider uppercase">ProRes 422 HQ • 8K Master</span>
                </div>
                <div className="text-[11px] text-apple-gray">DaVinci ACES</div>
              </div>

              {/* Display Screen */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-black group">
                <Image
                  src="/images/project-1.jpg"
                  alt="EpicPix cinematic showcase"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Floating Glass Metadata Chips */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white group-hover:bg-apple-blue group-hover:border-apple-blue-vibrant transition-all">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                    <div>
                      <h3 className="text-white font-display font-semibold text-lg leading-snug">
                        Cinematic Master Reel 2026
                      </h3>
                      <p className="text-xs text-apple-lightgray">Shot on RED V-Raptor 8K • 120fps High-Speed • Color Graded in DaVinci</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono">
                      4K HDR
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono">
                      Dolby Atmos
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-950/80 backdrop-blur-md border border-blue-500/40 text-blue-300 font-medium">
                      Studio Certified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple Bento Box Grid: Capabilities & Specs */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-apple-blue-vibrant mb-2 block">
              Architected for Creators & Brands
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
              Every detail. Supercharged.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Large Span */}
            <div className="md:col-span-2 apple-bento-card p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-apple-blue-vibrant mb-6">
                  <Film className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-apple-gray">Cinema Pipeline</span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1 mb-3">
                  8K Cinema Masters & True HDR
                </h3>
                <p className="text-apple-gray text-sm leading-relaxed max-w-xl">
                  Full uncompressed raw masters, DaVinci ACES 1.3 color grading pipelines, and custom LUT handoffs. Your deliverables look breathtaking on Pro Display XDR, OLED TVs, and mobile screens alike.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold font-display text-white">12-bit</div>
                  <div className="text-xs text-apple-gray">Raw Color Depth</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-white">ProRes</div>
                  <div className="text-xs text-apple-gray">422 HQ / 4444 XQ</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-white">48h</div>
                  <div className="text-xs text-apple-gray">Fast Draft Preview</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: YouPI Smart Escrow */}
            <div className="apple-bento-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-apple-green mb-6">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-apple-gray">Payment Protocol</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3">
                  YouPI Smart Escrow
                </h3>
                <p className="text-apple-gray text-xs leading-relaxed">
                  Military-grade UPI and card transactions. Your funds are secured in escrow until you inspect and approve the watermark-free deliverable.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-apple-green font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
                  Instant UPI Verification
                </span>
                <span className="text-xs text-apple-gray font-mono">100% Protected</span>
              </div>
            </div>

            {/* Bento Card 3: Dolby Atmos Audio */}
            <div className="apple-bento-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-apple-purple mb-6">
                  <Disc className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-apple-gray">Spatial Sound</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1 mb-3">
                  Spatial Cinema Audio
                </h3>
                <p className="text-apple-gray text-xs leading-relaxed">
                  Broadcast-ready loudness mastering (-14 LUFS for streaming, -24 LKFS for TV), licensed score composition, and immersive binaural spatial audio.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-apple-purple font-medium">Dolby 5.1 & Stereo</span>
                <span className="text-xs text-apple-gray font-mono">-14 LUFS Clean</span>
              </div>
            </div>

            {/* Bento Card 4: Large Span - Vetted Creators */}
            <div className="md:col-span-2 apple-bento-card p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-apple-gold mb-6">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-apple-gray">Talent Network</span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1 mb-3">
                  Curated Elite Creators
                </h3>
                <p className="text-apple-gray text-sm leading-relaxed max-w-xl">
                  Every cinematographer, photographer, and colorist on EpicPix passes rigorous technical audits. We review raw camera tests, color science knowledge, and commercial client references before admittance.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-white">4.92 / 5.0</span>
                  <span className="text-xs text-apple-gray">Average Rating across 500+ Projects</span>
                </div>
                <Link
                  href="/explore"
                  className="apple-pill-btn apple-pill-secondary text-xs px-5 py-2 font-medium"
                >
                  Browse Creator Roster →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Productions Showcase */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-apple-blue-vibrant mb-2 block">
                Selected Works
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
                Mastered for Impact.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="apple-pill-btn apple-pill-secondary text-xs px-5 py-2 font-medium"
            >
              View Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="apple-bento-card group flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/project-1.jpg"
                  alt="Corporate promotional video for Acme Corp"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-medium flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-apple-blue-vibrant" />
                    Cinema Video
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-apple-blue-vibrant transition-colors">
                    Corporate Brand Film
                  </h3>
                  <span className="text-xs text-apple-gray">Acme Corp</span>
                </div>
                <p className="text-xs text-apple-gray line-clamp-2 mb-4 leading-relaxed">
                  Multi-location documentary brand story filmed with cinema primes and custom sound design.
                </p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-apple-gray font-mono">7 Days Turnaround</span>
                  <Link href="/order/configure?service=video_pro" className="text-apple-blue-vibrant hover:underline font-medium">
                    Order Similar →
                  </Link>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="apple-bento-card group flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/project-2.jpg"
                  alt="Product photography for Luna Cosmetics"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-medium flex items-center gap-1.5">
                    <Camera className="w-3 h-3 text-apple-purple" />
                    Commercial Photo
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-apple-purple transition-colors">
                    Luxury Product Photography
                  </h3>
                  <span className="text-xs text-apple-gray">Luna Cosmetics</span>
                </div>
                <p className="text-xs text-apple-gray line-clamp-2 mb-4 leading-relaxed">
                  High-fashion studio lighting and macro optical precision for global packaging launch.
                </p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-apple-gray font-mono">3 Days Turnaround</span>
                  <Link href="/services" className="text-apple-blue-vibrant hover:underline font-medium">
                    View Package →
                  </Link>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="apple-bento-card group flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src="/images/project-3.jpg"
                  alt="Drone aerial cinematography for Coastal Properties"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-medium flex items-center gap-1.5">
                    <Film className="w-3 h-3 text-apple-green" />
                    Drone Aerial
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-apple-green transition-colors">
                    Architectural Drone Showcase
                  </h3>
                  <span className="text-xs text-apple-gray">Coastal Properties</span>
                </div>
                <p className="text-xs text-apple-gray line-clamp-2 mb-4 leading-relaxed">
                  Cinematic golden-hour aerial tracking shots capturing high-end architectural real estate.
                </p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-apple-gray font-mono">5 Days Turnaround</span>
                  <Link href="/services" className="text-apple-blue-vibrant hover:underline font-medium">
                    View Package →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple 3-Step Process */}
      <section className="py-24 border-t border-white/10 bg-[#0a0a0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-apple-blue-vibrant mb-2 block">
              Pure Efficiency
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white">
              From Concept to Master in 3 Steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="apple-bento-card p-8">
              <div className="text-4xl font-display font-bold apple-text-cosmic mb-4">01</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Configure & Brief</h3>
              <p className="text-sm text-apple-gray leading-relaxed">
                Select your service, choose runtime and resolution add-ons, and provide your creative vision with upfront transparent INR pricing.
              </p>
            </div>

            <div className="apple-bento-card p-8">
              <div className="text-4xl font-display font-bold apple-text-cosmic mb-4">02</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">YouPI Smart Escrow</h3>
              <p className="text-sm text-apple-gray leading-relaxed">
                Fund your order with instant UPI or card. Your payment is held securely in escrow while your assigned creator records and edits.
              </p>
            </div>

            <div className="apple-bento-card p-8">
              <div className="text-4xl font-display font-bold apple-text-cosmic mb-4">03</div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Inspect & Unlock</h3>
              <p className="text-sm text-apple-gray leading-relaxed">
                Stream time-coded draft cuts, submit precision feedback, and unlock full-resolution uncompressed master exports upon satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Apple Keynote Banner */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="apple-bento-card p-10 sm:p-16 text-center border border-white/20 bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0c]">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-6">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Rated 4.9/5 by 200+ Businesses</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-white mb-4">
                Ready to create something iconic?
              </h2>
              <p className="text-base sm:text-lg text-apple-gray mb-8 leading-relaxed">
                Start your next campaign with top tier creators and guaranteed YouPI escrow protection.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/order/configure"
                  className="apple-pill-btn apple-pill-primary text-sm px-8 py-3.5 font-medium"
                >
                  Configure Project
                </Link>
                <Link
                  href="/explore"
                  className="apple-pill-btn apple-pill-secondary text-sm px-8 py-3.5 font-medium"
                >
                  Browse Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
