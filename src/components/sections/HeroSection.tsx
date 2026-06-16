import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=90',
    title: "Building Rwanda's",
    highlight: 'Future',
    subtitle: 'Delivering world-class construction excellence across East Africa',
  },
  {
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=90',
    title: 'Engineering',
    highlight: 'Excellence',
    subtitle: 'From bridges to towers — infrastructure that defines generations',
  },
  {
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=90',
    title: 'Precision Meets',
    highlight: 'Innovation',
    subtitle: '20 years of building trust, one landmark at a time',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const profile = useSelector((state: RootState) => state.company.profile);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background slides */}
      {HERO_SLIDES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <img
            src={s.image}
            alt="Hero"
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>
      ))}

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />

      {/* Diagonal accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-3xl">
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-0.5 bg-accent" />
            <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold">
              {profile.companyName}
            </span>
          </motion.div>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6"
          >
            {slide.title}
            <br />
            <span className="text-accent">{slide.highlight}</span>
          </motion.h1>

          <motion.p
            key={`sub-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-xl mb-10 max-w-lg leading-relaxed"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/projects" className="btn-primary group">
              View Our Projects
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Get a Quote
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 transition-all duration-500 ${i === current ? 'w-10 bg-accent' : 'w-4 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/40 z-20"
      >
        <span className="text-xs tracking-[0.2em] uppercase [writing-mode:vertical-rl]">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>

      {/* Floating stats card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-2 gap-px bg-white/10 backdrop-blur-md border border-white/20 z-20"
      >
        {[
          { value: `${profile.projectsCompleted}+`, label: 'Projects' },
          { value: String(profile.yearsExperience), label: 'Years' },
          { value: `${profile.clientsSatisfied}+`, label: 'Clients' },
          { value: String(profile.awardsWon), label: 'Awards' },
        ].map((stat) => (
          <div key={stat.label} className="bg-primary/40 backdrop-blur px-6 py-5 text-center">
            <div className="font-display text-2xl font-bold text-accent">{stat.value}</div>
            <div className="text-white/60 text-xs mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
