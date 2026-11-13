import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="font-display text-lg mb-4">EpicPix Media</h3>
            <p className="text-muted-foreground text-sm">
              Professional media production services for businesses who demand excellence.
              We create corporate videos, commercials, brand films, photography, and content
              that captivates audiences and drives results.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-primary transition-colors">
                  Explore Creators
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-primary transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Video Production
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Content Creation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Post-Production
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Drone Cinematography
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <a href="mailto:contact@epicpix.media"
                  className="hover:text-primary transition-colors"
                >
                  contact@epicpix.media
                </a>
              </li>
              <li>
                <a href="tel:+1234567890"
                  className="hover:text-primary transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p>2026 EpicPix Media. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://twitter.com/epicpix_media"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Twitter
            </a>
            <a href="https://linkedin.com/company/epicpix"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}