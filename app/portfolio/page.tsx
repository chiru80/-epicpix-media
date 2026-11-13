import Image from "next/image";
import Link from "next/link";
import { Play, Camera, Film, Sparkles, ArrowRight, Eye } from "lucide-react";
import { GlassCard, GlassBadge, GlassButton } from "@/components/ui/glisse";

interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: "Video" | "Photography" | "Drone" | "Commercial";
  image: string;
  orderServiceId: string;
  specs: string;
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
  },
  {
    id: "product-photo",
    title: "Luxury Product Photography",
    client: "Luna Cosmetics",
    category: "Photography",
    image: "/images/portfolio-2.jpg",
    orderServiceId: "thumbnail",
    specs: "Macro Studio • Retouched Masters",
  },
  {
    id: "drone-cinema",
    title: "Drone Aerial Cinematography",
    client: "Coastal Properties",
    category: "Drone",
    image: "/images/portfolio-3.jpg",
    orderServiceId: "video_premium",
    specs: "ProRes 422 • FPV Chase • Golden Hour",
  },
  {
    id: "brand-film",
    title: "Founder Documentary & Anthem",
    client: "Apex Ventures",
    category: "Commercial",
    image: "/images/project-1.jpg",
    orderServiceId: "video_premium",
    specs: "RED 8K • 5.1 Surround Mix",
  },
  {
    id: "studio-session",
    title: "Lifestyle Lookbook Campaign",
    client: "Saffron Living",
    category: "Photography",
    image: "/images/project-2.jpg",
    orderServiceId: "thumbnail",
    specs: "Location Stills • Editorial Retouch",
  },
  {
    id: "coastal-reel",
    title: "Resort Architectural Showcase",
    client: "Azure Coastlines",
    category: "Drone",
    image: "/images/project-3.jpg",
    orderServiceId: "video_pro",
    specs: "4K HDR Aerial • Horizon Stabilized",
  },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <GlassBadge variant="primary" size="default" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Master Media Portfolio</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
            Featured Productions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Explore 4K commercials, product photography, and drone cinematography delivered by top creators on EpicPix.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm shadow-primary/20 cursor-pointer">
              All Works
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Video Production
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Product Photography
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Drone Cinematography
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-medium glass-card text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Commercial Films
            </span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <GlassCard key={item.id} variant="interactive" className="group flex flex-col justify-between">
              <div>
                {/* Media Presentation Box */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/30" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <GlassBadge variant="default" size="sm" className="bg-black/60 text-white border-white/20">
                      {item.category === "Video" && <Film className="w-3 h-3 mr-1" />}
                      {item.category === "Photography" && <Camera className="w-3 h-3 mr-1" />}
                      {item.category === "Drone" && <Film className="w-3 h-3 mr-1" />}
                      {item.category === "Commercial" && <Sparkles className="w-3 h-3 mr-1" />}
                      {item.category}
                    </GlassBadge>
                  </div>

                  {/* Hover Glass Controls Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-black/30">
                    <div className="w-12 h-12 rounded-full glass-card border border-white/30 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-400 block mb-1">
                    {item.client}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{item.specs}</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-auto">
                <span className="text-xs text-muted-foreground">High-Res Delivery</span>
                <Link
                  href={`/order/configure?service=${item.orderServiceId}`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Order Similar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
