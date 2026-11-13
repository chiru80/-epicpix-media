import Image from "next/image";
import Link from "next/link";

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-6">
              Portfolio
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our featured projects across various categories and industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <article className="border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-card">
              <Image
                src="/images/portfolio-1.jpg"
                alt="Corporate promotional video showcase"
                width={400}
                height={300}
                className="h-48 w-full object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2 text-foreground">Corporate Promo Video</h3>
                <p className="text-sm text-muted-foreground">Acme Corp</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Video</span>
                  <Link href="/order/configure?service=video_pro" className="text-primary hover:underline text-sm font-medium">
                    Order similar project →
                  </Link>
                </div>
              </div>
            </article>

            {/* Project Card 2 */}
            <article className="border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-card">
              <Image
                src="/images/portfolio-2.jpg"
                alt="Product photography portfolio"
                width={400}
                height={300}
                className="h-48 w-full object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2 text-foreground">Product Photography</h3>
                <p className="text-sm text-muted-foreground">Luna Cosmetics</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Photography</span>
                  <Link href="/services" className="text-primary hover:underline text-sm font-medium">
                    Explore services →
                  </Link>
                </div>
              </div>
            </article>

            {/* Project Card 3 */}
            <article className="border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-card">
              <Image
                src="/images/portfolio-3.jpg"
                alt="Drone aerial cinematography reel"
                width={400}
                height={300}
                className="h-48 w-full object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2 text-foreground">Drone Cinematography</h3>
                <p className="text-sm text-muted-foreground">Coastal Properties</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Drone</span>
                  <Link href="/services" className="text-primary hover:underline text-sm font-medium">
                    Explore services →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
