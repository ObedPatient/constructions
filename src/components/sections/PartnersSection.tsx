import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useSelector } from 'react-redux';
import SectionHeader from '../common/SectionHeader';
import type { RootState } from '../../redux/store';
import type { Partner } from '../../types';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function PartnerTile({ partner }: { partner: Partner }) {
  const content = (
    <div
      className="group relative min-h-[148px] bg-white dark:bg-primary border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-4 px-5 py-6 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="h-16 w-full flex items-center justify-center">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            className="max-h-14 max-w-[150px] object-contain grayscale opacity-75 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="h-14 min-w-14 px-4 bg-gray-100 dark:bg-white/10 flex items-center justify-center font-display font-bold text-primary dark:text-white">
            {initials(partner.name)}
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-primary dark:text-white leading-tight">{partner.name}</p>
        {partner.website && (
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Visit <ExternalLink size={11} />
          </span>
        )}
      </div>
    </div>
  );

  if (!partner.website) return content;

  return (
    <a href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${partner.name}`}>
      {content}
    </a>
  );
}

export default function PartnersSection() {
  const partners = useSelector((state: RootState) => state.content.partners);

  const orderedPartners = useMemo(
    () => [...partners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name)),
    [partners]
  );
  const carouselPartners = orderedPartners.length ? [...orderedPartners, ...orderedPartners] : [];

  return (
    <section className="section-padding bg-gray-50 dark:bg-primary/60">
      <div className="container-custom">
        <SectionHeader
          label="Trusted By"
          title="Partners & Clients"
          center
          subtitle="We work with leading institutions, governments, and private sector organisations across the region."
        />

        <div className="relative">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex w-max animate-[partnerCarousel_28s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
            >
              {carouselPartners.map((partner, index) => (
                <div key={`${partner.id}-${index}`} className="w-[50vw] shrink-0 px-1.5 py-3 md:w-[33.333vw] lg:w-[25vw] xl:w-[20vw]">
                  <PartnerTile partner={partner} />
                </div>
              ))}
            </motion.div>
          </div>

          {orderedPartners.length === 0 && (
            <div className="bg-white dark:bg-primary border border-gray-100 dark:border-white/10 py-12 text-center text-sm text-gray-400">
              Partners will appear here once they are added.
            </div>
          )}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 dark:bg-white/5">
          {[
            { value: 'ISO 9001:2015', label: 'Quality Management Certified' },
            { value: 'RURA Licensed', label: 'Rwanda Utilities Regulatory Authority' },
            { value: 'MININFRA', label: 'Ministry of Infrastructure Registered' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-primary flex items-center gap-5 px-8 py-6"
            >
              <div className="w-12 h-12 bg-accent/10 flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-primary dark:text-white">{item.value}</p>
                <p className="text-gray-500 dark:text-white/50 text-xs mt-0.5">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
