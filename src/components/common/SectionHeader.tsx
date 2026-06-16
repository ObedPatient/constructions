import { motion } from 'framer-motion';

interface Props {
  label: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeader({ label, title, subtitle, center = false, light = false }: Props) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : ''}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-accent uppercase tracking-[0.3em] text-xs font-semibold mb-3 block"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`font-display text-4xl md:text-5xl font-bold leading-tight ${light ? 'text-white' : 'text-primary dark:text-white'}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`mt-4 text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
