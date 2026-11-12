import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-6">
              About EpicPix Media
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We are a professional media production studio dedicated to creating
              compelling visual stories for businesses that demand excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Founded in 2020, EpicPix Media emerged from a simple observation:
                too many businesses struggle to tell their story through video
                and photography. We set out to change that.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we work with brands across technology, healthcare, real
                estate, and consumer goods to produce content that connects,
                converts, and stands the test of time.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/about-studio.jpg"
                alt="EpicPix Media studio"
                width={600}
                height={400}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 border rounded-2xl">
              <h3 className="text-2xl font-display mb-4">Precision</h3>
              <p className="text-muted-foreground">
                Every frame is deliberate. We plan, shoot, and edit with the
                discipline of craftsmen who take pride in their work.
              </p>
            </div>
            <div className="p-8 border rounded-2xl">
              <h3 className="text-2xl font-display mb-4">Creativity</h3>
              <p className="text-muted-foreground">
                We bring fresh ideas to every project, finding the unique
                angle that makes your brand stand out from the competition.
              </p>
            </div>
            <div className="p-8 border rounded-2xl">
              <h3 className="text-2xl font-display mb-4">Partnership</h3>
              <p className="text-muted-foreground">
                We work alongside you, not for you. Your vision guides every
                creative decision we make throughout the production process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}