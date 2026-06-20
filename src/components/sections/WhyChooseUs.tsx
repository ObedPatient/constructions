import { motion } from 'framer-motion';
import { ShieldCheck, Clock3, BadgeCheck, Leaf, Users2, BarChart3 } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'ISO-Certified Quality',
    desc: 'ISO 9001:2015 certified processes ensure every project meets rigorous international quality standards.',
    stat: '0',
    statLabel: 'Defect Rate Target',
  },
  {
    icon: Clock3,
    title: 'On-Time Delivery',
    desc: '96% of our projects are delivered on or ahead of schedule, thanks to advanced project management tools.',
    stat: '96%',
    statLabel: 'On-Time Rate',
  },
  {
    icon: BadgeCheck,
    title: 'Licensed & Insured',
    desc: 'Fully licensed by MININFRA and RURA with comprehensive project and liability insurance coverage.',
    stat: '100%',
    statLabel: 'Fully Insured',
  },
  {
    icon: Leaf,
    title: 'Sustainability First',
    desc: 'We integrate green building practices, solar integration, and sustainable materials into every project.',
    stat: '60%',
    statLabel: 'Projects Green-Certified',
  },
  {
    icon: Users2,
    title: 'Expert Team of 500+',
    desc: 'Architects, civil engineers, project managers, and skilled tradespeople — all under one roof.',
    stat: '500+',
    statLabel: 'Professionals',
  },
  {
    icon: BarChart3,
    title: 'Transparent Reporting',
    desc: 'Real-time project dashboards and weekly reports keep clients fully informed at every stage.',
    stat: '24/7',
    statLabel: 'Project Visibility',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-secondary relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-48 -translate-y-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 -translate-x-32 translate-y-32 pointer-events-none" />

      <div className="relative container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text + image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader
              label="Why Choose REAL"
              title="The Standard Everyone Else Aspires To"
            />
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              When you work with Builders max construction ltd, you're not just hiring a contractor — you're partnering 
              with East Africa's most trusted builder. Our track record speaks for itself: 340+ completed 
              projects, zero major safety incidents in the last 8 years, and a client retention rate of 78%.
            </p>

            {/* Visual stat highlight */}
            <div className="grid grid-cols-3 gap-0.5 bg-gray-100 dark:bg-white/5">
              {[
                { v: '96%', l: 'On-Time' },
                { v: '78%', l: 'Repeat Clients' },
                { v: '8yr', l: 'Safety Record' },
              ].map((s) => (
                <div key={s.l} className="bg-primary dark:bg-secondary text-center py-5 px-2">
                  <div className="font-display text-2xl font-bold text-accent">{s.v}</div>
                  <div className="text-white/60 text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Photo */}
            <div className="mt-8 relative">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Construction team"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
            </div>
          </motion.div>

          {/* Right: reasons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 bg-gray-100 dark:bg-white/5">
            {REASONS.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white dark:bg-primary p-6 group hover:bg-accent transition-all duration-400"
                >
                  <Icon
                    size={22}
                    className="text-accent group-hover:text-white mb-4 transition-colors"
                  />
                  <div className="font-display text-2xl font-bold text-primary dark:text-white group-hover:text-white transition-colors mb-0.5">
                    {reason.stat}
                  </div>
                  <div className="text-accent group-hover:text-white/80 text-xs uppercase tracking-wider mb-3 transition-colors">
                    {reason.statLabel}
                  </div>
                  <h3 className="font-display font-bold text-sm text-primary dark:text-white group-hover:text-white mb-2 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-500 dark:text-white/50 group-hover:text-white/70 text-xs leading-relaxed transition-colors">
                    {reason.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
