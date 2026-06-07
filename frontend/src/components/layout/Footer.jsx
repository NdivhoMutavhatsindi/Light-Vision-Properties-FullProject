import { Link, useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Globe, Camera, Users, Bird } from 'lucide-react';

const footerLinks = {
  Properties: [
    { label: 'All Properties', href: '/properties' },
    { label: 'For Sale', href: '/properties' },
    { label: 'To Let', href: '/properties' },
    { label: 'Commercial', href: '/services' },
    { label: 'New Developments', href: '/properties' },
  ],
  Services: [
    { label: 'Property Valuation', href: '/valuation' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Legal Advisors', href: '/legal' },
    { label: 'Offer to Purchase', href: '/offer-to-purchase' },
    { label: 'Bond Calculator', href: '/bond-calculator' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Agents', href: '/agents' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/contact' },
  ],
};

export default function Footer() {
  const location = useLocation();
  if (typeof window !== 'undefined' && location.pathname.startsWith('/admin')) return null;
  return (
    <footer className="bg-navy-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/">
              <img src="/LOGO.png" alt="Light Vision Property" className="h-16 w-auto mb-6 brightness-0 invert" />
            </Link>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
              South Africa's premier luxury real estate group. Delivering exceptional results with unparalleled service since 2009.
            </p>
            <div className="space-y-3">
              <a href="tel:+27717093059" className="flex items-center gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold-500 transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-sm">+27 71 709 3059</span>
              </a>
              <a href="mailto:info@lightvisionproperties.co.za" className="flex items-center gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold-500 transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-sm">info@lightvisionproperties.co.za</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <span className="text-sm">Narehousing Tswinga Block 09, House number 283<br />Thohoyandou, 0950</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-6">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Gold Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Light Vision Property. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
