import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Layers, Hammer, Network, ClipboardList, Lightbulb, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SectionHeader from '../common/SectionHeader';

const ICON_MAP: Record<string, React.ReactNode> = {
  Building2: <Building2 size={28} />,
  Layers: <Layers size={28} />,
  Hammer: <Hammer size={28} />,
  Network: <Network size={28} />,
  ClipboardList: <ClipboardList size={28} />,
  Lightbulb: <Lightbulb size={28} />,
};

export default function ServicesSection() {
  const services = useSelector((state: RootState) => state.content.services);

  return (
    <section className="section-padding bg-white dark:bg-secondary">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
          <SectionHeader
            label="What We Do"
            title="Comprehensive Construction Solutions"
            subtitle="From groundbreaking to handover, we deliver every phase with precision."
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="btn-dark shrink-0 group">
              All Services
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100 dark:bg-white/5">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white dark:bg-primary p-8 hover:bg-primary dark:hover:bg-accent transition-all duration-500 cursor-pointer"
            >
              <div className="text-accent group-hover:text-white dark:group-hover:text-white transition-colors mb-5">
                {ICON_MAP[service.icon] ?? <Building2 size={28} />}
              </div>
              <h3 className="font-display text-xl font-bold text-primary dark:text-white group-hover:text-white mb-3 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-500 dark:text-white/60 group-hover:text-white/80 text-sm leading-relaxed mb-6 transition-colors">
                {service.description}
              </p>
              <ul className="space-y-1">
                {service.features.slice(0, 2).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-400 group-hover:text-white/60 transition-colors">
                    <div className="w-1 h-1 bg-accent group-hover:bg-white rounded-full transition-colors" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-accent group-hover:text-white transition-colors text-sm font-medium">
                Learn more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
