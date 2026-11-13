import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0c] text-apple-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14 text-xs">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="w-2.5 h-2.5 rounded-full bg-apple-blue-vibrant shadow-[0_0_10px_#2997ff]" />
              <span className="text-lg font-display font-semibold tracking-tight text-white group-hover:text-apple-blue-vibrant transition-colors">
                EpicPix Media
              </span>
            </Link>
            <p className="text-apple-gray text-xs leading-relaxed max-w-sm mb-4">
              The premier media production marketplace. Connecting visionary enterprises with vetted commercial filmmakers, luxury product photographers, and aerial cinematographers.
            </p>
            <p className="text-[11px] text-apple-gray/70">
              Secured with YouPI-PG Smart Escrow & Supabase Encrypted Storage.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wide uppercase text-[11px] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Creators</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-apple-blue/20 text-apple-blue-vibrant font-medium">New</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Selected Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wide uppercase text-[11px] mb-4">
              Capabilities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/order/configure?service=video_pro" className="hover:text-white transition-colors">
                  Cinema Video 4K
                </Link>
              </li>
              <li>
                <Link href="/order/configure?service=thumbnail" className="hover:text-white transition-colors">
                  Product Photography
                </Link>
              </li>
              <li>
                <Link href="/order/configure?service=video_premium" className="hover:text-white transition-colors">
                  Drone Cinematography
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  DaVinci Color Grading
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Dolby Atmos Sound
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wide uppercase text-[11px] mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Studio Inquiry
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@epicpix.media"
                  className="hover:text-white transition-colors"
                >
                  contact@epicpix.media
                </a>
              </li>
              <li>
                <Link href="/auth/signup?role=FREELANCER" className="hover:text-apple-blue-vibrant transition-colors font-medium">
                  Join as Creator →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-apple-gray">
          <p>© 2026 EpicPix Media Inc. All rights reserved. Designed with Apple Keynote & Liquid Glass aesthetics.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}