import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../constants';
import SectionHeader from '../common/SectionHeader';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  return (
    <section className="section-padding bg-white dark:bg-secondary relative overflow-hidden">
      {/* Accent block */}
      <div className="absolute left-0 top-0 w-24 h-full bg-accent/5" />
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-accent/5 rounded-full translate-x-32 translate-y-32" />

      <div className="relative container-custom">
        <SectionHeader
          label="Client Stories"
          title="What Our Clients Say"
          center
          subtitle="The trust of our clients is our greatest achievement."
        />

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-50 dark:bg-primary/50 p-10 md:p-14"
            >
              {/* Quote icon */}
              <Quote size={48} className="text-accent/20 absolute top-8 right-8" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => (
                  <Star key={i} size={18} className="text-accent fill-accent" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-white/80 text-xl leading-relaxed mb-8 italic">
                "{TESTIMONIALS[current].content}"
              </p>

              <div className="flex items-center gap-4">
                {TESTIMONIALS[current].image && (
                  <img
                    src={TESTIMONIALS[current].image}
                    alt={TESTIMONIALS[current].name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                )}
                <div>
                  <p className="font-display font-bold text-primary dark:text-white">
                    {TESTIMONIALS[current].name}
                  </p>
                  <p className="text-gray-500 dark:text-white/50 text-sm">
                    {TESTIMONIALS[current].role}, {TESTIMONIALS[current].company}
                  </p>
                </div>
              </div>

              {/* Left accent bar */}
              <div className="absolute left-0 top-8 bottom-8 w-1 bg-accent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 bg-gray-100 dark:bg-white/10 hover:bg-accent hover:text-white text-gray-600 dark:text-white/60 flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 transition-all duration-300 ${
                    i === current ? 'w-8 bg-accent' : 'w-3 bg-gray-300 dark:bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 bg-gray-100 dark:bg-white/10 hover:bg-accent hover:text-white text-gray-600 dark:text-white/60 flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
