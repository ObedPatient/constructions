import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

export default function ContactCTA() {
  const phone = useSelector((state: RootState) => state.company.profile.phone);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
          alt="Construction"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="relative container-custom section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-accent text-xs tracking-[0.3em] uppercase font-semibold block mb-4">
            Start Your Project
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Build Something<br />
            <span className="text-accent">Extraordinary?</span>
          </h2>
          <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Let's talk about your vision. Our team of experts is ready to bring your construction project to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary group">
              Get a Free Quote
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={`tel:${phone}`} className="btn-outline group">
              <Phone size={16} />
              {phone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
