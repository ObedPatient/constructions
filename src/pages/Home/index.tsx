import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

// Eager load above-the-fold sections
import HeroSection from '../../components/sections/HeroSection';
import StatsSection from '../../components/sections/StatsSection';
import SectionHeader from '../../components/common/SectionHeader';
import { ProjectCardSkeleton } from '../../components/ui/Skeleton';

// Lazy load below-the-fold sections
const ServicesSection = lazy(() => import('../../components/sections/ServicesSection'));
const FeaturedProjects = lazy(() => import('../../components/sections/FeaturedProjects'));
const WhyChooseUs = lazy(() => import('../../components/sections/WhyChooseUs'));
const ProcessSection = lazy(() => import('../../components/sections/ProcessSection'));
const PartnersSection = lazy(() => import('../../components/sections/PartnersSection'));
const ContactCTA = lazy(() => import('../../components/sections/ContactCTA'));

const WHY_US = [
  'ISO-certified quality management',
  '20+ years of regional expertise',
  'On-time, on-budget delivery',
  'Sustainable construction practices',
  'Experienced team of 500+ professionals',
  'End-to-end project management',
];

function SectionFallback() {
  return (
    <div className="section-padding bg-white dark:bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => <ProjectCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Above the fold: eager ── */}
      <HeroSection />
      <StatsSection />

      {/* ── Company Intro ── */}
      <section className="section-padding bg-white dark:bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionHeader
                label="About REAL Construction"
                title="20 Years of Building Rwanda's Greatest Landmarks"
              />
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                Founded in 2005, REAL Construction has grown from a local contractor into East Africa's most
                respected construction company. We've built over 340 landmark projects — from soaring commercial
                towers to critical infrastructure that powers communities.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Our philosophy is simple: every structure we build must stand the test of time. That means
                engineering precision, sustainable materials, and an obsessive commitment to quality at every level.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {WHY_US.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-dark group">
                Our Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                  alt="REAL Construction team at work"
                  className="w-full h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent -z-10" />
                <div className="absolute -bottom-8 left-8 bg-accent text-white p-6 shadow-2xl">
                  <div className="font-display text-4xl font-bold">20+</div>
                  <div className="text-white/80 text-sm mt-1">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Lazy sections ── */}
      <Suspense fallback={<SectionFallback />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeaturedProjects />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <ProcessSection />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <PartnersSection />
      </Suspense>

      <Suspense fallback={<div className="h-64" />}>
        <ContactCTA />
      </Suspense>
    </>
  );
}
