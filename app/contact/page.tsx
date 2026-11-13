import { Sparkles, Mail, Phone, MapPin, Send } from "lucide-react";
import { GlassPanel, GlassBadge, GlassCard } from "@/components/ui/glisse";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <GlassBadge variant="primary" size="default" className="mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Studio Production Desk</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-base text-muted-foreground">
            Ready to start your next campaign? Fill out the inquiry details below and our production directors will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">Studio Office</h3>
              <div className="space-y-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <div>
                    <strong className="text-foreground block">Mumbai Studio</strong>
                    <span>Lower Parel, Mumbai, Maharashtra 400013</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <div>
                    <strong className="text-foreground block">Email Desk</strong>
                    <a href="mailto:contact@epicpix.media" className="text-sky-400 hover:underline">
                      contact@epicpix.media
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary flex-none mt-0.5" />
                  <div>
                    <strong className="text-foreground block">Production Helpline</strong>
                    <span>+91 98200 12345 (10am - 7pm IST)</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-primary/20">
              <h4 className="font-display font-semibold text-sm text-foreground mb-2">Escrow Protection</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All production quotes booked through EpicPix are protected with YouPI-PG milestone escrow, ensuring high-res releases only upon your sign-off.
              </p>
            </GlassCard>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <GlassPanel glow className="p-8 sm:p-10">
              <form className="space-y-6" action="/api/contact" method="POST">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="e.g. rahul@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Company / Brand
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      className="w-full h-11 rounded-xl bg-black/40 border border-white/10 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                      placeholder="Your brand name"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full h-11 rounded-xl bg-black/60 border border-white/10 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                    >
                      <option value="">Select a service</option>
                      <option value="video_pro">Commercial Video (Pro)</option>
                      <option value="video_premium">Showcase & Documentary</option>
                      <option value="thumbnail">Thumbnail Pack</option>
                      <option value="photography">Product Photography</option>
                      <option value="drone">Drone Cinematography</option>
                      <option value="custom">Enterprise / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budget" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Estimated Budget (INR)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      className="w-full h-11 rounded-xl bg-black/60 border border-white/10 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-15k">Under ₹15,000</option>
                      <option value="15k-30k">₹15,000 - ₹30,000</option>
                      <option value="30k-75k">₹30,000 - ₹75,000</option>
                      <option value="75k-150k">₹75,000 - ₹1,50,000</option>
                      <option value="150k+">₹1,50,000+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timeline" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full h-11 rounded-xl bg-black/60 border border-white/10 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
                    >
                      <option value="">Select turnaround time</option>
                      <option value="rush-48h">Rush (Within 48 Hours)</option>
                      <option value="1-week">Within 1 Week</option>
                      <option value="2-3-weeks">2 - 3 Weeks</option>
                      <option value="flexible">Flexible Timeline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Project Vision & Requirements *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md resize-none"
                    placeholder="Tell us about the deliverable, desired style, target audience, and any reference links..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/40 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to Studio</span>
                </button>
              </form>
            </GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
