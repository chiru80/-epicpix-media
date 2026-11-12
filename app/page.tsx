import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - one bright element, quiet chrome */}
      <section className="py-20 md:py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-6">
              <span className="block text-primary">EpicPix</span> Media
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Professional media production services for businesses who demand excellence.
              We create corporate videos, commercials, brand films, photography, and content
              that captivates audiences and drives results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <Link
                href="/services"
                className="inline-block px-6 py-3 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                View Our Services
              </Link>
              <Link
                href="/portfolio"
                className="inline-block px-6 py-3 rounded-full bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors duration-300"
              >
                Browse Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section - one rich moment */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Featured Work
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've collaborated with leading brands across industries to create compelling
              visual stories that connect with audiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Project Card */}
            <article className="border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/images/project-1.jpg"
                alt="Corporate promotional video for Acme Corp"
                width={800}
                height={600}
                className="h-64 w-full object-cover rounded-t-2xl transition-colors duration-300"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">Corporate Promo Video</h3>
                <p className="text-sm text-muted-foreground">Acme Corp</p>
              </div>
            </article>

            {/* Project Card */}
            <article className="border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/images/project-2.jpg"
                alt="Lifestyle product photography"
                width={800}
                height={600}
                className="h-64 w-full object-cover rounded-t-2xl transition-colors duration-300"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">Product Photography</h3>
                <p className="text-sm text-muted-foreground">Luna Cosmetics</p>
              </div>
            </article>

            {/* Project Card */}
            <article className="border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/images/project-3.jpg"
                alt="Drone aerial cinematography"
                width={800}
                height={600}
                className="h-64 w-full object-cover rounded-t-2xl transition-colors duration-300"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-2">Drone Cinematography</h3>
                <p className="text-sm text-muted-foreground">Coastal Properties</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section - one primary action */}
      <section className="py-24 md:py-32 bg-primary/5 text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/20 rounded-3xl p-8 backdrop-blur-sm text-center">
            <h2 className="text-4xl md:text-5xl font-display mb-6">Let's Create Something Amazing</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Ready to elevate your brand with professional media production? Get in touch
              today and let's discuss how we can bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}