import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Layers, Hammer, Network, ClipboardList, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Service } from '../../types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Building2, Layers, Hammer, Network, ClipboardList, Lightbulb,
};

interface ServiceCardProps {
  service: Service;
  index?: number;
  variant?: 'default' | 'dark' | 'minimal';
}

export default function ServiceCard({ service, index = 0, variant = 'default' }: ServiceCardProps) {
  const Icon = ICON_MAP[service.icon] || Building2;

  if (variant === 'dark') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className="group bg-secondary/80 hover:bg-accent p-8 border border-white/10 hover:border-accent transition-all duration-500"
      >
        <Icon size={28} className="text-accent group-hover:text-white transition-colors mb-5" />
        <h3 className="font-display text-xl font-bold text-white mb-3">{service.title}</h3>
        <p className="text-white/60 group-hover:text-white/80 text-sm leading-relaxed mb-6 transition-colors">
          {service.description}
        </p>
        <Link to="/services" className="flex items-center gap-2 text-accent group-hover:text-white text-sm font-medium transition-colors">
          Learn More <ArrowRight size={14} />
        </Link>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07 }}
        className="flex items-start gap-4 p-4 group hover:bg-accent/5 transition-colors"
      >
        <div className="w-11 h-11 bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
          <Icon size={20} className="text-accent group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="font-semibold text-primary dark:text-white mb-1">{service.title}</h3>
          <p className="text-gray-500 dark:text-white/50 text-sm line-clamp-2">{service.description}</p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group border border-gray-100 dark:border-white/10 p-8 bg-white dark:bg-primary hover:border-accent hover:shadow-xl transition-all duration-500"
    >
      <div className="w-14 h-14 bg-accent/10 group-hover:bg-accent flex items-center justify-center mb-6 transition-all duration-300">
        <Icon size={26} className="text-accent group-hover:text-white transition-colors" />
      </div>
      <h3 className="font-display text-xl font-bold text-primary dark:text-white mb-3">{service.title}</h3>
      <p className="text-gray-500 dark:text-white/60 text-sm leading-relaxed mb-5">{service.description}</p>
      <ul className="space-y-2 mb-6">
        {service.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-white/60">
            <CheckCircle2 size={13} className="text-accent shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <Link to="/contact" className="flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all">
        Get a Quote <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}
