import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-primary flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 bg-accent flex items-center justify-center font-display font-bold text-white text-3xl">
          R
        </div>
        <div className="w-48 h-0.5 bg-white/20 overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-white/50 text-xs tracking-[0.4em] uppercase">Loading...</p>
      </motion.div>
    </div>
  );
}
