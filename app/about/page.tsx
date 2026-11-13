import Image from "next/image";
import Link from "next/link";
import { Sparkles, Target, Zap, HeartHandshake, ArrowRight } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton, GlassPanel } from "@/components/ui/glisse";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="max-w-3xl mb-16">
          <GlassBadge variant="primary" size="default" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Behind the Studio</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            About EpicPix Media
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We are a hybrid media production studio and creative marketplace dedicated to producing compelling visual stories for businesses that demand excellence.
          </p>
        </div>

        {/* Story Section */}
        <GlassPanel glow className="p-8 sm:p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <GlassBadge variant="default" size="sm" className="mb-3">
                Our Story
              </GlassBadge>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                Bridging Elite Creative Talent with Modern Brands
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Founded in 2020, EpicPix Media emerged from a simple observation: too many companies struggle to find reliable video production and photography talent that respects deadlines and creative vision.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Today, EpicPix combines in-house director oversight with a vetted marketplace of cinematographers, editors, drone pilots, and retouchers across India. We manage milestones, private cloud storage, and escrow payments so you can focus on scale.
              </p>
              <div className="flex gap-4">
                <GlassButton href="/explore" variant="filled" size="default">
                  Meet Our Creators
                </GlassButton>
                <GlassButton href="/portfolio" variant="glass" size="default">
                  View Portfolio
                </GlassButton>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] glass-card border border-white/10 shadow-2xl">
              <Image
                src="/images/about-studio.jpg"
                alt="EpicPix Media studio"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </GlassPanel>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
              Our Principles
            </h2>
            <p className="text-sm text-muted-foreground">
              What sets every EpicPix delivery apart from generic freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <GlassCard variant="interactive" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Precision Craft
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every frame is deliberate. We storyboard, grade, and mix with the rigorous discipline of cinema craftsmen.
              </p>
            </GlassCard>

            <GlassCard variant="interactive" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Guaranteed SLAs
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fixed 48-hour to 7-day turnaround with automated status notifications and escrow protection on every order.
              </p>
            </GlassCard>

            <GlassCard variant="interactive" className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                Client Ownership
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You retain 100% commercial intellectual property rights, master deliverables, and raw DaVinci/Premiere source files.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  );
}
