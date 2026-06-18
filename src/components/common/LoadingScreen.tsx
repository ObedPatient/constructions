import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-[radial-gradient(circle_at_top,_rgba(0,90,167,0.16),transparent_35%),linear-gradient(180deg,#1a1a1a_0%,#111111_100%)] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <img
          src="/build_max.jpeg"
          alt="Builders Max Construction Ltd"
          className="w-20 h-20 object-contain rounded-md bg-white p-2 shadow-2xl shadow-black/20"
        />
        <div className="w-48 h-0.5 bg-white/15 overflow-hidden">
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
