import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import SectionHeader from '../common/SectionHeader';

export default function ProcessSection() {
  const milestones = useSelector((state: RootState) => state.content.milestones);

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-construction-pattern opacity-30" />

      <div className="relative container-custom">
        <SectionHeader
          label="How We Work"
          title="Our Construction Process"
          subtitle="A proven, transparent methodology that ensures quality at every stage."
          light
        />

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[8.33%] right-[8.33%] h-0.5 bg-white/10" />
          <motion.div
            className="hidden lg:block absolute top-10 left-[8.33%] h-0.5 bg-accent"
            initial={{ width: 0 }}
            whileInView={{ width: '83.34%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {milestones.slice(0, 6).map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-secondary border-2 border-white/20 flex items-center justify-center group-hover:border-accent transition-colors duration-300 relative z-10">
                    <span className="font-display text-2xl font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
