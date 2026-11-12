import Image from "next/image";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your next project? Fill out the form and we'll get back to
              you within 24 hours.
            </p>
          </div>

          <form className="mt-12 space-y-8" action="/api/contact" method="POST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  placeholder="Your company (optional)"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                  Service Interested In
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
                >
                  <option value="">Select a service</option>
                  <option value="video">Video Production</option>
                  <option value="photography">Photography</option>
                  <option value="content">Content Creation</option>
                  <option value="post-production">Post-Production</option>
                  <option value="drone">Drone Cinematography</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
                >
                  <option value="">Select budget range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-30k">$15,000 - $30,000</option>
                  <option value="30k-50k">$30,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-foreground mb-2">
                  Project Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
                >
                  <option value="">Select timeline</option>
                  <option value="1-month">1 month</option>
                  <option value="2-3-month">2-3 months</option>
                  <option value="3-6-month">3-6 months</option>
                  <option value="6-month+">6+ months</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-md border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-colors"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors duration-300 mt-6"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}