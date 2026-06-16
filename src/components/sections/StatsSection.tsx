import { motion } from 'framer-motion';
import { Award, Building2, Users, Clock } from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const STATS = [
  { label: 'Projects Completed', value: 340, suffix: '+', icon: Building2 },
  { label: 'Happy Clients', value: 280, suffix: '+', icon: Users },
  { label: 'Years of Excellence', value: 20, suffix: '', icon: Clock },
  { label: 'Industry Awards', value: 45, suffix: '', icon: Award },
];

export default function StatsSection() {
  return (
    <section className="bg-primary py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-construction-pattern opacity-40" />
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-accent/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-8 px-6 group"
              >
                <div className="w-12 h-12 bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent transition-colors duration-300">
                  <Icon size={22} className="text-accent group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
