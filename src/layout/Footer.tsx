import { Link } from 'react-router-dom';
import { Globe, Share2, Link2, Mail as MailIcon, Play, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NAV_ITEMS } from '../constants';
import type { RootState } from '../redux/store';

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <Globe size={16} />,
  twitter: <Share2 size={16} />,
  linkedin: <Link2 size={16} />,
  instagram: <MailIcon size={16} />,
  youtube: <Play size={16} />,
};

export default function Footer() {
  const year = new Date().getFullYear();
  const profile = useSelector((state: RootState) => state.company.profile);

  return (
    <footer className="bg-[linear-gradient(180deg,#111111_0%,#0b0b0b_100%)] text-white border-t border-white/10">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/build_max.jpeg"
                alt="Builders Max Construction Ltd"
                className="w-12 h-12 object-contain rounded-md bg-white p-1 shadow-lg shadow-black/20"
              />
              <div>
                <span className="font-display font-bold text-white text-xl">Builders Max</span>
                <span className="block text-white/40 text-[9px] tracking-[0.3em] uppercase -mt-1">Construction</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {profile.description.slice(0, 150)}...
            </p>
            <div className="flex gap-3">
              {Object.entries(profile.socialLinks).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 hover:bg-accent flex items-center justify-center transition-all duration-300 border border-white/5"
                    aria-label={platform}
                  >
                    {socialIcons[platform]}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item: { href: string; label: string }) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6 text-lg">Our Services</h4>
            <ul className="space-y-3">
              {['Building Construction', 'Civil Engineering', 'Renovation', 'Infrastructure', 'Project Management', 'Consultancy'].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-white/60 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6 text-lg">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">{profile.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-accent shrink-0 mt-0.5" />
                <a href={`tel:${profile.phone}`} className="text-white/60 hover:text-white text-sm transition-colors">
                  {profile.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-accent shrink-0 mt-0.5" />
                <a href={`mailto:${profile.email}`} className="text-white/60 hover:text-white text-sm transition-colors">
                  {profile.email}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-white/60 text-xs mb-3 uppercase tracking-wider">Newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/40 px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                />
                <button className="bg-accent hover:bg-secondary px-4 py-2.5 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">
            © {year} {profile.companyName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <Link key={item} to="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
