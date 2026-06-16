import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Layers, Hammer, Network, ClipboardList, Lightbulb, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SectionHeader from '../../components/common/SectionHeader';
import ContactCTA from '../../components/sections/ContactCTA';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building2, Layers, Hammer, Network, ClipboardList, Lightbulb,
};

export default function ServicesPage() {
  const services = useSelector((state: RootState) => state.content.services);
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();
  const filteredServices = services.filter((service) =>
    !normalizedSearch ||
    service.title.toLowerCase().includes(normalizedSearch) ||
    service.description.toLowerCase().includes(normalizedSearch) ||
    service.features.some((feature) => feature.toLowerCase().includes(normalizedSearch))
  );

  return (
    <>
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-primary overflow-hidden flex items-end">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80" alt="Services" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50" />
        <div className="relative container-custom px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-2">What We Offer</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white">Our Services</h1>
        </div>
      </div>

      {/* Services grid */}
      <section className="section-padding bg-white dark:bg-secondary" id="services">
        <div className="container-custom">
          <SectionHeader label="Capabilities" title="End-to-End Construction Services" center
            subtitle="From concept to completion, we handle every aspect of your construction project with expert precision." />

          <div className="mx-auto mb-10 max-w-2xl">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services, capabilities, or features..."
                className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 transition-colors focus:border-accent focus:outline-none dark:border-white/10 dark:bg-primary/50 dark:text-white"
              />
            </div>
            <p className="mt-3 text-center text-sm text-gray-500 dark:text-white/50">
              Showing {filteredServices.length} of {services.length} services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, i) => {
              const Icon = ICON_MAP[service.icon] || Building2;
              return (
                <motion.div key={service.id} id={service.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group scroll-mt-28 border border-gray-100 dark:border-white/10 p-8 hover:border-accent hover:shadow-2xl transition-all duration-500">
                  <div className="w-16 h-16 bg-accent/10 group-hover:bg-accent flex items-center justify-center mb-6 transition-all duration-300">
                    <Icon size={28} className="text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-primary dark:text-white mb-3">{service.title}</h2>
                  <p className="text-gray-500 dark:text-white/60 text-sm leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-white/70">
                        <CheckCircle2 size={14} className="text-accent shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                    Request This Service <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
          {filteredServices.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400">No services match your search.</p>
              <button type="button" onClick={() => setSearch('')} className="mt-2 text-sm text-accent hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why choose us strip */}
      <section className="py-20 bg-accent">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-white/70 text-xs tracking-[0.3em] uppercase font-semibold block mb-3">Why REAL?</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                The REAL Difference
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['ISO 9001 Certified', 'On-Time Delivery', 'Transparent Pricing', 'Post-Build Support', '500+ Experts', 'Sustainability Focus'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-white/10 px-4 py-3">
                  <CheckCircle2 size={16} className="text-white shrink-0" />
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <ContactCTA />
    </>
  );
}
